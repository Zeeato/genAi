import { useEffect, useRef, useState } from 'react'
import { askQuestion } from '@/services/chatService'

type Message = { role: 'user' | 'assistant'; text: string }

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Hi! I can answer questions about your document. Paste context and ask away.' },
  ])
  const [input, setInput] = useState('')
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const send = async () => {
    const q = input.trim()
    if (!q || loading) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text: q }])
    setLoading(true)
    const a = await askQuestion(q, context)
    setMessages((m) => [...m, { role: 'assistant', text: a }])
    setLoading(false)
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-4">
        <div className="card h-100">
          <div className="card-body">
            <h5 className="card-title">Document Context</h5>
            <textarea
              className="form-control"
              rows={12}
              placeholder="Paste the relevant clauses or document text here so the chatbot can reference it."
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-8">
        <div className="card h-100">
          <div className="card-body d-flex flex-column">
            <h5 className="card-title">Q&A Chatbot</h5>
            <div className="flex-grow-1 overflow-auto border rounded p-3 mb-3 bg-body-tertiary" style={{ maxHeight: 420 }}>
              {messages.map((m, i) => (
                <div key={i} className={`d-flex mb-2 ${m.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                  <div className={`chat-bubble ${m.role}`}>{m.text}</div>
                </div>
              ))}
              {loading && (
                <div className="d-flex justify-content-start mb-2">
                  <div className="chat-bubble assistant"><span className="spinner-border spinner-border-sm me-2"></span>Thinking…</div>
                </div>
              )}
            </div>
            <div className="input-group">
              <input
                ref={inputRef}
                type="text"
                className="form-control"
                placeholder="Ask a follow-up question…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
              />
              <button className="btn btn-primary" onClick={send} disabled={loading || !input.trim()}>
                <i className="bi bi-send me-1"></i> Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
