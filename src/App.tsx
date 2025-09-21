import { Outlet, NavLink } from 'react-router-dom'
import ChatWidget from '@/components/ChatWidget'

export default function App() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-brand border-bottom sticky-top shadow-sm">
        <div className="container">
          <NavLink className="navbar-brand fw-bold text-ink" to="/">
            <i className="bi bi-bounding-box-circles me-2"></i>
            LexiAI
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#nav"
            aria-controls="nav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="nav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/summarize">Summarize</NavLink>
              </li>
              {/* Chat moved to floating widget */}
              <li className="nav-item">
                <NavLink className="nav-link" to="/benchmark">Benchmark</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/risk">Risk</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="py-4">
        <div className="container">
          <Outlet />
        </div>
      </main>

      <footer className="bg-body-tertiary py-4 border-top">
        <div className="container d-flex justify-content-between align-items-center small text-secondary">
          <span>© {new Date().getFullYear()} LexiAI</span>
          <span className="d-none d-sm-inline">Legal insights, simplified.</span>
        </div>
      </footer>
      <ChatWidget />
    </div>
  )
}
