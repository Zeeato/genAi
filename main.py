from dotenv import load_dotenv
load_dotenv() # Load environment variables from .env file at the very start

import os
import uuid
import asyncio
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from typing import List, Dict, Any

# LangChain Core
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory

# LangChain Community & Document Processing
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, UnstructuredImageLoader
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
# --- FIX: Updated ChatMessageHistory import ---
from langchain_community.chat_message_histories import ChatMessageHistory

# Project-Specific Imports
from Clients.gemini import llm, embeddings
from Clients.llama import classifier # Import the main client
from rules import rules

# FastAPI App
app = FastAPI(
    title="Document Analysis and Chat API",
    description="API to classify document risk and chat with content using Gemini."
)

# In-Memory Storage
vector_stores: Dict[str, FAISS] = {}
chat_histories: Dict[str, ChatMessageHistory] = {}
file_classifications: Dict[str, Dict[str, Any]] = {}

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

# Helper Functions
def get_document_loader(file_path: str, file_name: str):
    _, ext = os.path.splitext(file_name)
    ext = ext.lower()
    if ext == ".pdf":
        return PyPDFLoader(file_path)
    elif ext in [".doc", ".docx"]:
        return Docx2txtLoader(file_path)
    elif ext in [".png", ".jpg", ".jpeg"]:
        return UnstructuredImageLoader(file_path, mode="single")
    else:
        raise ValueError(f"Unsupported file type: {ext}")

async def classify_document_risk(file_path: str, file_name: str) -> Dict[str, Any]:
    try:
        # Use the imported LlamaCloud client directly
        job = await classifier.acreate_classify_job(
            file_paths=[file_path],
            rules=rules
        )
        
        while job.status not in ["SUCCESS", "PARTIAL_SUCCESS", "ERROR"]:
            await asyncio.sleep(2)
            job = await classifier.aget_classify_job(job.id)

        if job.status == "ERROR":
            return {"error": f"LlamaCloud classification job failed for {file_name}."}

        predictions = await classifier.aget_classify_job_predictions(job.id)
        if not predictions:
            return {"error": f"No classification prediction returned for {file_name}."}

        result = predictions[0]
        return {
            "filename": file_name,
            "risk_category": result.type,
            "confidence": result.confidence,
            "reasoning": result.reasoning
        }
    except Exception as e:
        return {"error": f"An unexpected error occurred during classification: {str(e)}"}

# RAG Chain Configuration (Unchanged)
contextualize_q_system_prompt = (
    "Given a chat history and the latest user question "
    "which might reference context in the chat history, "
    "formulate a standalone question which can be understood "
    "without the chat history. Do NOT answer the question, "
    "just reformulate it if needed and otherwise return it as is."
)
contextualize_q_prompt = ChatPromptTemplate.from_messages(
    [("system", contextualize_q_system_prompt), MessagesPlaceholder("chat_history"), ("human", "{input}")]
)

qa_system_prompt = (
    "You are an assistant for question-answering tasks. "
    "Use the following pieces of retrieved context to answer the question. "
    "If you don't know the answer, just say that you don't know. "
    "Keep the answer concise and based only on the provided context."
    "\n\n"
    "{context}"
)
qa_prompt = ChatPromptTemplate.from_messages(
    [("system", qa_system_prompt), MessagesPlaceholder("chat_history"), ("human", "{input}")]
)

def create_conversational_rag_chain(vector_store: FAISS):
    retriever = vector_store.as_retriever()
    history_aware_retriever = create_history_aware_retriever(llm, retriever, contextualize_q_prompt)
    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
    rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

    def get_session_history(session_id: str) -> ChatMessageHistory:
        if session_id not in chat_histories:
            chat_histories[session_id] = ChatMessageHistory()
        return chat_histories[session_id]

    return RunnableWithMessageHistory(
        rag_chain, get_session_history,
        input_messages_key="input", history_messages_key="chat_history", output_messages_key="answer",
    )

# FastAPI Endpoints (Unchanged from your logic)
@app.post("/process-files/")
async def process_files_endpoint(session_id: str = Form(default_factory=lambda: str(uuid.uuid4())), files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No files provided.")

    temp_dir = f"temp_files_{session_id}"
    os.makedirs(temp_dir, exist_ok=True)

    all_docs = []
    classification_tasks = []
    file_paths_for_cleanup = []

    for uploaded_file in files:
        file_path = os.path.join(temp_dir, uploaded_file.filename)
        file_paths_for_cleanup.append(file_path)
        with open(file_path, "wb") as buffer:
            buffer.write(await uploaded_file.read())
        
        classification_tasks.append(classify_document_risk(file_path, uploaded_file.filename))
        
        try:
            loader = get_document_loader(file_path, uploaded_file.filename)
            all_docs.extend(loader.load())
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    classification_results = await asyncio.gather(*classification_tasks)
    
    for path in file_paths_for_cleanup:
        os.remove(path)
    os.rmdir(temp_dir)

    if not all_docs:
        raise HTTPException(status_code=400, detail="Failed to extract any text content from the files.")
    
    splits = text_splitter.split_documents(all_docs)
    vector_stores[session_id] = FAISS.from_documents(documents=splits, embedding=embeddings)
    file_classifications[session_id] = {res['filename']: res for res in classification_results if 'filename' in res}

    return JSONResponse(
        content={
            "session_id": session_id,
            "message": f"Successfully processed and indexed {len(files)} files.",
            "classifications": classification_results
        }
    )

@app.post("/chat/")
async def chat_endpoint(session_id: str = Form(...), query: str = Form(...)):
    if session_id not in vector_stores:
        raise HTTPException(status_code=404, detail="Session ID not found. Please process files first.")

    vector_store = vector_stores[session_id]
    conversational_rag_chain = create_conversational_rag_chain(vector_store)

    response = await conversational_rag_chain.ainvoke(
        {"input": query},
        config={"configurable": {"session_id": session_id}}
    )

    return {"answer": response["answer"]}

@app.get("/history/{session_id}")
async def get_history_endpoint(session_id: str):
    if session_id not in chat_histories:
        raise HTTPException(status_code=404, detail="Chat history not found for this session ID.")
    
    history = chat_histories[session_id]
    return {"history": [msg.dict() for msg in history.messages]}
