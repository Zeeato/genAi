import { useState } from 'react'
import { analyzeRisk } from '@/services/riskService'

type Flag = { clause: string; severity: 'low' | 'medium' | 'high'; note: string }

export default function Risk() {
  const [text, setText] = useState('')
  const [flags, setFlags] = useState<Flag[]>([])
  const [loading, setLoading] = useState(false)

  const run = async () => {
    if (!text.trim()) return
    setLoading(true)
    const r = await analyzeRisk(text)
    setFlags(r)
    setLoading(false)
  }

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-5">
        <div className="card h-100">
          <div className="card-body">
            <h5 className="card-title">Document</h5>
            <textarea className="form-control mb-3" rows={12} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste document text for risk analysis..." />
            <button className="btn btn-primary" disabled={loading || !text.trim()} onClick={run}>
              {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-shield-exclamation me-2"></i>}
              Analyze Risk
            </button>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-7">
        <div className="card h-100">
          <div className="card-body">
            <h5 className="card-title">Flags</h5>
            {flags.length === 0 ? (
              <p className="text-secondary mb-0">No flags yet.</p>
            ) : (
              <ul className="list-group list-group-flush">
                {flags.map((f, i) => (
                  <li key={i} className="list-group-item d-flex align-items-start gap-3">
                    <span className={`badge rounded-pill ${
                      f.severity === 'high' ? 'text-bg-danger' : f.severity === 'medium' ? 'text-bg-warning' : 'text-bg-success'
                    }`}>{f.severity.toUpperCase()}</span>
                    <div>
                      <div className="fw-semibold">{f.clause}</div>
                      <div className="small text-secondary">{f.note}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
