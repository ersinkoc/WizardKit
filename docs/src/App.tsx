import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import GettingStarted from './pages/GettingStarted'
import ApiDocs from './pages/ApiDocs'
import ReactDocs from './pages/ReactDocs'
import VueDocs from './pages/VueDocs'
import SvelteDocs from './pages/SvelteDocs'
import Examples from './pages/Examples'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-header">
            <h1>🧙 WizardKit</h1>
            <p className="version">v1.0.0</p>
          </div>
          <nav>
            <Link to="/">Overview</Link>
            <Link to="/getting-started">Getting Started</Link>
            <Link to="/api">API Reference</Link>
            <Link to="/react">React Adapter</Link>
            <Link to="/vue">Vue Adapter</Link>
            <Link to="/svelte">Svelte Adapter</Link>
            <Link to="/examples">Examples</Link>
          </nav>
          <div className="sidebar-footer">
            <a href="https://github.com/ersinkoc/wizardkit" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://wizardkit.oxog.dev" target="_blank" rel="noopener noreferrer">
              Website
            </a>
          </div>
        </aside>
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/getting-started" element={<GettingStarted />} />
            <Route path="/api" element={<ApiDocs />} />
            <Route path="/react" element={<ReactDocs />} />
            <Route path="/vue" element={<VueDocs />} />
            <Route path="/svelte" element={<SvelteDocs />} />
            <Route path="/examples" element={<Examples />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
