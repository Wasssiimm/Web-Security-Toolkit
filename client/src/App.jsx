import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import ScannerPage from './pages/ScannerPage'
import PasswordPage from './pages/PasswordPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex gap-6">
          <span className="font-bold text-green-400 mr-4">Web Security Toolkit</span>
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-green-400' : 'text-gray-400 hover:text-white'}>
            Scanner
          </NavLink>
          <NavLink to="/password" className={({ isActive }) => isActive ? 'text-green-400' : 'text-gray-400 hover:text-white'}>
            Password
          </NavLink>
        </nav>
        <main className="max-w-4xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<ScannerPage />} />
            <Route path="/password" element={<PasswordPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
