import { useMemo, useState } from 'react'
import FileDrop from '@/components/FileDrop'
import { chunkText, extractTerms, summarizeText } from '@/services/summarizeService'

export default function Summarize() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [chunks, setChunks] = useState<string[]>([])
  const [summary, setSummary] = useState('')
  const [terms, setTerms] = useState<string[]>([])

  const canRun = useMemo(() => input.trim().length > 0 && !loading, [input, loading])

  const run = async () => {
    setLoading(true)
    try {
      const c = chunkText(input)
      const s = await summarizeText(input)
      const t = extractTerms(input)
      setChunks(c)
      setSummary(s)
      setTerms(t)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-5">
        <div className="card h-100">
          <div className="card-body">
            <h5 className="card-title mb-3">Document Input</h5>
            <div className="mb-3">
              <FileDrop onText={setInput} />
            </div>
            <textarea
              className="form-control mb-3"
              rows={10}
              placeholder="Paste your document text here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button disabled={!canRun} onClick={run} className="btn btn-primary">
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : (
                <i className="bi bi-magic me-2"></i>
              )}
              Summarize & Extract
            </button>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-7">
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title mb-2">Summary</h5>
            {summary ? <p className="mb-0">{summary}</p> : <p className="text-secondary mb-0">No summary yet.</p>}
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-xl-6">
            <div className="card h-100">
              <div className="card-body">
                <h6 className="card-title">Chunks</h6>
                {chunks.length ? (
                  <ol className="mb-0 small">
                    {chunks.map((c, i) => (
                      <li key={i} className="mb-1">{c}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-secondary mb-0">No chunks yet.</p>
                )}
              </div>
            </div>
          </div>
          <div className="col-12 col-xl-6">
            <div className="card h-100">
              <div className="card-body">
                <h6 className="card-title">Extracted Terms</h6>
                {terms.length ? (
                  <div className="d-flex flex-wrap gap-2">
                    {terms.map((t) => (
                      <span key={t} className="badge text-bg-primary-subtle border border-primary-subtle text-primary">{t}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-secondary mb-0">No terms yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
