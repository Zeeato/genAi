import { useEffect, useRef, useState } from 'react'
import { askQuestion } from '@/services/chatService'

type Message = { role: 'user' | 'assistant'; text: string }

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Hi! Paste context and ask anything about your document.' },
  ])
  const [input, setInput] = useState('')
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handler = () => setOpen((v) => !v)
    window.addEventListener('lexiai:toggle-chat', handler as EventListener)
    return () => window.removeEventListener('lexiai:toggle-chat', handler as EventListener)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

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

  return (
    <>
      <button
        aria-label="Open chatbot"
        className="btn btn-primary chat-widget-fab shadow"
        onClick={() => setOpen((v) => !v)}
      >
        <i className="bi bi-chat-dots"></i>
      </button>

      {open && (
        <div className="chat-widget-panel shadow-lg border rounded-3">
          <div className="d-flex align-items-center justify-content-between p-2 border-bottom bg-primary-subtle">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-bounding-box-circles text-ink"></i>
              <strong className="text-ink">LexiAI Chat</strong>
            </div>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setOpen(false)} aria-label="Close">
              <i className="bi bi-x"></i>
            </button>
          </div>

          <div className="p-2">
            <textarea
              className="form-control mb-2"
              rows={3}
              placeholder="Optional: paste document context so I can give clause-specific answers"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />

            <div className="chat-scroll border rounded p-2 bg-brand mb-2">
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
                placeholder="Ask a question…"
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
      )}
    </>
  )
}
