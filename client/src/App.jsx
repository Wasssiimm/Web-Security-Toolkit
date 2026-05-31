import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import AnimatedBackground from './components/shared/AnimatedBackground'
import Footer from './components/shared/Footer'
import CorvexLogo from './components/shared/CorvexLogo'
import HomePage from './pages/HomePage'
import ScannerPage from './pages/ScannerPage'
import PasswordPage from './pages/PasswordPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import DisclaimerPage from './pages/DisclaimerPage'

function ThemeToggle() {
  const { dark, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      className="group relative flex items-center gap-2 text-xs font-mono-cyber text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 border border-slate-200 dark:border-white/10 hover:border-cyan-400/40 rounded-md px-3 py-1.5 transition-all bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm"
      aria-label="Toggle theme"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 group-hover:animate-pulse-glow" />
      {dark ? 'LIGHT' : 'DARK'}
    </button>
  )
}

function Brand() {
  return (
    <NavLink to="/" className="flex items-center gap-3 group">
      <div className="w-14 h-14 rounded-md bg-slate-900 dark:bg-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/50 transition-shadow border border-white/5">
        <CorvexLogo size={44} />
      </div>
      <p className="text-lg font-orbitron font-bold tracking-wider text-slate-900 dark:text-white">
        CRUCEX
      </p>
    </NavLink>
  )
}

function NavItem({ to, end, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `relative px-3 py-2 text-sm transition-colors font-medium ${
          isActive
            ? 'text-cyan-600 dark:text-cyan-300'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        } group`
      }
    >
      {({ isActive }) => (
        <>
          <span>{children}</span>
          <span className={`absolute left-3 right-3 -bottom-0.5 h-px bg-gradient-to-r from-cyan-400 to-fuchsia-500 transition-transform origin-left ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
        </>
      )}
    </NavLink>
  )
}

function Layout() {
  return (
    <div className="min-h-screen flex flex-col text-slate-900 dark:text-slate-100 transition-colors">
      <AnimatedBackground />

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/60 dark:bg-slate-950/60 border-b border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
          <Brand />

          <nav className="hidden md:flex items-center gap-1">
            <NavItem to="/" end>Home</NavItem>
            <NavItem to="/scanner">Scanner</NavItem>
            <NavItem to="/password">Password</NavItem>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#"
              className="hidden sm:inline-flex text-xs font-mono-cyber text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 border border-slate-200 dark:border-white/10 hover:border-cyan-400/40 rounded-md px-3 py-1.5 transition-all bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm items-center gap-2"
            >
              <span>★</span> STAR ON GITHUB
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        <Routes>
          <Route path="/"           element={<HomePage />} />
          <Route path="/scanner"    element={<ScannerPage />} />
          <Route path="/password"   element={<PasswordPage />} />
          <Route path="/terms"      element={<TermsPage />} />
          <Route path="/privacy"    element={<PrivacyPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
        </Routes>
      </main>

      <Footer />
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
