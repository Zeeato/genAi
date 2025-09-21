import { useState } from 'react'
import { compareRent } from '@/services/benchmarkService'

export default function Benchmark() {
  const [address, setAddress] = useState('')
  const [rent, setRent] = useState<number | ''>('')
  const [beds, setBeds] = useState<number | ''>('')
  const [baths, setBaths] = useState<number | ''>('')
  const [result, setResult] = useState<{ marketAvg: number; delta: number; verdict: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    if (!address.trim() || !rent || !beds || !baths) return
    setLoading(true)
    const r = await compareRent({ address, rent: Number(rent), beds: Number(beds), baths: Number(baths) })
    setResult(r)
    setLoading(false)
  }

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-5">
        <div className="card h-100">
          <div className="card-body">
            <h5 className="card-title">Rental Inputs</h5>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="row g-3">
              <div className="col-6">
                <label className="form-label">Monthly Rent ($)</label>
                <input type="number" className="form-control" value={rent} onChange={(e) => setRent(e.target.value ? Number(e.target.value) : '')} />
              </div>
              <div className="col-3">
                <label className="form-label">Beds</label>
                <input type="number" className="form-control" value={beds} onChange={(e) => setBeds(e.target.value ? Number(e.target.value) : '')} />
              </div>
              <div className="col-3">
                <label className="form-label">Baths</label>
                <input type="number" className="form-control" value={baths} onChange={(e) => setBaths(e.target.value ? Number(e.target.value) : '')} />
              </div>
            </div>
            <button className="btn btn-primary mt-3" disabled={loading} onClick={run}>
              {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-graph-up-arrow me-2"></i>}
              Compare with Market
            </button>
            <p className="text-secondary small mt-2 mb-0">Uses live property data APIs in production. Mocked here.</p>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-7">
        <div className="card h-100">
          <div className="card-body">
            <h5 className="card-title">Results</h5>
            {!result ? (
              <p className="text-secondary mb-0">No results yet.</p>
            ) : (
              <div>
                <div className="d-flex flex-wrap gap-3 mb-3">
                  <div className="stat">
                    <div className="label">Your Rent</div>
                    <div className="value">${' '}{rent}</div>
                  </div>
                  <div className="stat">
                    <div className="label">Market Average</div>
                    <div className="value">${' '}{result.marketAvg.toFixed(0)}</div>
                  </div>
                  <div className="stat">
                    <div className="label">Delta</div>
                    <div className={`value ${result.delta >= 0 ? 'text-danger' : 'text-success'}`}>
                      {result.delta >= 0 ? '+' : ''}{result.delta.toFixed(0)}
                    </div>
                  </div>
                </div>
                <div className="alert bg-body-tertiary border">
                  <strong>Verdict:</strong> {result.verdict}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
