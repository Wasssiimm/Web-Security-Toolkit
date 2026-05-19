import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ScannerPage from './pages/ScannerPage'
import PasswordPage from './pages/PasswordPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <nav className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <span className="font-bold text-green-400 text-lg tracking-tight">
                Web Security Toolkit
              </span>
              <p className="text-xs text-gray-500 mt-0.5">
                Open-source security analysis tools
              </p>
            </div>
            <div className="flex items-center gap-6">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive ? 'text-green-400 text-sm font-medium' : 'text-gray-400 hover:text-white text-sm transition-colors'
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/scanner"
                className={({ isActive }) =>
                  isActive ? 'text-green-400 text-sm font-medium' : 'text-gray-400 hover:text-white text-sm transition-colors'
                }
              >
                Scanner
              </NavLink>
              <NavLink
                to="/password"
                className={({ isActive }) =>
                  isActive ? 'text-green-400 text-sm font-medium' : 'text-gray-400 hover:text-white text-sm transition-colors'
                }
              >
                Password Analyser
              </NavLink>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/scanner" element={<ScannerPage />} />
            <Route path="/password" element={<PasswordPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
