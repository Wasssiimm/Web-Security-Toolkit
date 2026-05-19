import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import HomePage from './pages/HomePage'
import ScannerPage from './pages/ScannerPage'
import PasswordPage from './pages/PasswordPage'

function ThemeToggle() {
  const { dark, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 transition-colors bg-transparent"
      aria-label="Toggle theme"
    >
      {dark ? '☀ Light' : '🌙 Dark'}
    </button>
  )
}

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <span className="font-bold text-cyan-500 dark:text-cyan-400 text-lg tracking-tight">
              Web Security Toolkit
            </span>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Open-source security analysis tools
            </p>
          </div>
          <div className="flex items-center gap-6">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? 'text-cyan-500 dark:text-cyan-400 text-sm font-medium'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors'
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/scanner"
              className={({ isActive }) =>
                isActive
                  ? 'text-cyan-500 dark:text-cyan-400 text-sm font-medium'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors'
              }
            >
              Scanner
            </NavLink>
            <NavLink
              to="/password"
              className={({ isActive }) =>
                isActive
                  ? 'text-cyan-500 dark:text-cyan-400 text-sm font-medium'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors'
              }
            >
              Password Analyser
            </NavLink>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="p-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scanner" element={<ScannerPage />} />
          <Route path="/password" element={<PasswordPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </ThemeProvider>
  )
}
