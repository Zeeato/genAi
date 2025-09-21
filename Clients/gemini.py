from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0)

embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")