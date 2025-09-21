import { Outlet, NavLink, useLocation } from 'react-router-dom'
import ChatWidget from '@/components/ChatWidget'
import { createContext, useContext, useState } from 'react'

// Context for controlling chat visibility on Summarize page
type SummarizeChatContextType = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
}

const SummarizeChatContext = createContext<SummarizeChatContextType | null>(null);

// Hook to access chat state
export const useSummarizeChat = () => useContext(SummarizeChatContext);

// Component to render chat on Summarize page
function SummarizeChatWidget() {
  const context = useSummarizeChat();
  if (!context) return null;
  
  return (
    <ChatWidget 
      showFab={false} 
      panelVariant="full" 
      isOpen={context.isOpen} 
      onOpenChange={context.setOpen}
    />
  );
}

export default function App() {
  const location = useLocation()
  const onSummarize = location.pathname.startsWith('/summarize')
  const onHome = location.pathname === '/'
  const [chatOpen, setChatOpen] = useState(true);
  
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

      {/* On Home: hide FAB. On Summarize: full-width under navbar with control from page. Elsewhere: default floating. */}
      {onSummarize ? (
        <SummarizeChatContext.Provider value={{ isOpen: chatOpen, setOpen: setChatOpen }}>
          <main className="py-4">
            <div className="container">
              <Outlet />
            </div>
          </main>
          <SummarizeChatWidget />
        </SummarizeChatContext.Provider>
      ) : (
        <>
          <main className="py-4">
            <div className="container">
              <Outlet />
            </div>
          </main>
          <ChatWidget showFab={!onHome} />
        </>
      )}

      <footer className="bg-body-tertiary py-4 border-top">
        <div className="container d-flex justify-content-between align-items-center small text-secondary">
          <span>© {new Date().getFullYear()} LexiAI</span>
          <span className="d-none d-sm-inline">Legal insights, simplified.</span>
        </div>
      </footer>
    </div>
  )
}
