import { NavLink } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <section className="py-5 rounded-4 bg-gradient-primary text-center shadow-sm">
        <h1 className="display-5 fw-bold text-white">LexiAI</h1>
        <p className="lead mb-4 text-white">Legal insights without the legalese. Summaries, Q&amp;A, rent benchmarks, and risk flags—instantly.</p>
        <div className="d-flex gap-2 justify-content-center flex-wrap">
          <NavLink to="/summarize" className="btn btn-accent fw-semibold">
            Try Summarization
          </NavLink>
          <button
            className="btn btn-primary"
            onClick={() => window.dispatchEvent(new Event('lexiai:toggle-chat'))}
          >
            Ask the Chatbot
          </button>
        </div>
      </section>

      <section className="row g-4 mt-1">
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card h-100 feature-card">
            <div className="card-body">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-magic me-2 text-primary fs-4"></i>
                <h5 className="card-title mb-0">Summarize & Extract</h5>
              </div>
              <p className="card-text text-secondary">AI-powered summaries with plain-English explanations and key term extraction via langextract.</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card h-100 feature-card">
            <div className="card-body">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-chat-dots me-2 text-primary fs-4"></i>
                <h5 className="card-title mb-0">Interactive Q&A</h5>
              </div>
              <p className="card-text text-secondary">Ask follow-up questions about any clause or legal term in a conversational interface.</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card h-100 feature-card">
            <div className="card-body">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-graph-up-arrow me-2 text-primary fs-4"></i>
                <h5 className="card-title mb-0">Rent Benchmarking</h5>
              </div>
              <p className="card-text text-secondary">Compare specified rent against live market rates using property data APIs (mocked).</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card h-100 feature-card">
            <div className="card-body">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-shield-exclamation me-2 text-primary fs-4"></i>
                <h5 className="card-title mb-0">Risk Analysis</h5>
              </div>
              <p className="card-text text-secondary">Score and flag potentially problematic clauses with color-coded severity indicators.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
