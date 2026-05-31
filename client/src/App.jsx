import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import AnimatedBackground from './components/shared/AnimatedBackground'
import Footer from './components/shared/Footer'
import HomePage from './pages/HomePage'
import ScannerPage from './pages/ScannerPage'
import PasswordPage from './pages/PasswordPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import DisclaimerPage from './pages/DisclaimerPage'

function SunIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M8 12a4 4 0 100-8 4 4 0 000 8zm0 1a5 5 0 100-10 5 5 0 000 10zm.5-10.5a.5.5 0 11-1 0 .5.5 0 011 0zm0 9a.5.5 0 11-1 0 .5.5 0 011 0zm-5-4.5a.5.5 0 110-1 .5.5 0 010 1zm9 0a.5.5 0 110-1 .5.5 0 010 1zM3.05 4.464a.5.5 0 10.707-.707.5.5 0 00-.707.707zm7.778 7.778a.5.5 0 10.707-.707.5.5 0 00-.707.707zM3.757 11.535a.5.5 0 10-.707-.707.5.5 0 00.707.707zm7.779-7.778a.5.5 0 10-.707-.707.5.5 0 00.707.707z"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M6 .278a.768.768 0 01.08.858 7.208 7.208 0 00-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 01.81.316.733.733 0 01-.031.893A8.349 8.349 0 018.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 016 .278z"/>
    </svg>
  )
}

function ThemeToggle() {
  const { dark, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 text-xs font-mono-cyber text-gray-600 dark:text-[#666] hover:text-gray-900 dark:hover:text-[#f2f2f2] border border-gray-200 dark:border-[#222] hover:border-gray-300 dark:hover:border-[#333] rounded px-2.5 py-1.5 transition-all"
      aria-label="Toggle theme"
    >
      {dark ? <SunIcon /> : <MoonIcon />}
      {dark ? 'Light' : 'Dark'}
    </button>
  )
}

function Brand() {
  return (
    <NavLink to="/" className="flex items-center gap-2.5 group">
      <img src="/crucexv3.png" alt="Crucex Logo" width={36} height={36} className="w-9 h-9 rounded object-contain" />
      <span className="text-base font-bold tracking-wide text-gray-900 dark:text-[#f2f2f2] group-hover:text-lime-700 dark:group-hover:text-lime-400 transition-colors">
        CRUCEX
      </span>
    </NavLink>
  )
}

function NavItem({ to, end, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `px-3 py-1.5 text-sm rounded transition-colors ${
          isActive
            ? 'text-lime-700 dark:text-lime-400'
            : 'text-gray-600 dark:text-[#888] hover:text-gray-900 dark:hover:text-[#f2f2f2]'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

function Layout() {
  return (
    <div className="min-h-screen flex flex-col transition-colors text-gray-900 dark:text-[#f2f2f2]">
      <AnimatedBackground />

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/85 dark:bg-[#090909]/90 border-b border-gray-100 dark:border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
          <Brand />

          <nav className="hidden md:flex items-center">
            <NavItem to="/" end>Home</NavItem>
            <NavItem to="/scanner">Scanner</NavItem>
            <NavItem to="/password">Password</NavItem>
          </nav>

          <ThemeToggle />
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
