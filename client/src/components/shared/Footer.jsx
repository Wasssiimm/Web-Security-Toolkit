import { Link, useNavigate, useLocation } from 'react-router-dom'

function scrollToFaq() {
  const el = document.getElementById('faq')
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - 80
  window.scrollTo({ top, behavior: 'smooth' })
}

function FaqLink() {
  const navigate  = useNavigate()
  const { pathname } = useLocation()

  function handleClick(e) {
    e.preventDefault()
    if (pathname === '/') {
      scrollToFaq()
    } else {
      navigate('/')
      setTimeout(scrollToFaq, 120)
    }
  }

  return (
    <a
      href="/#faq"
      onClick={handleClick}
      className="text-sm text-gray-600 dark:text-[#666] hover:text-gray-900 dark:hover:text-[#f2f2f2] transition-colors"
    >
      FAQ
    </a>
  )
}

const TOOLS = [
  { label: 'Web Security Scanner', to: '/scanner' },
  { label: 'Password Analyser',    to: '/password' },
]

const LEGAL = [
  { label: 'Terms of Service', to: '/terms'      },
  { label: 'Privacy Policy',   to: '/privacy'    },
  { label: 'Disclaimer',       to: '/disclaimer' },
]

const SOCIALS = [
  {
    label: 'GitHub',
    icon: 'M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z',
  },
]

function NavCol({ title, links }) {
  return (
    <div>
      <p className="text-xs font-mono-cyber uppercase tracking-wider text-gray-500 dark:text-[#555] mb-4">
        {title}
      </p>
      <ul className="space-y-2.5">
        {links.map(l => (
          <li key={l.label}>
            <Link
              to={l.to}
              className="text-sm text-gray-600 dark:text-[#666] hover:text-gray-900 dark:hover:text-[#f2f2f2] transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-[#1a1a1a] bg-white/50 dark:bg-[#090909]/60 mt-24">
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">

          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/crucexv3.png" alt="Crucex" width={36} height={36} className="w-9 h-9 rounded object-contain" />
              <span className="text-base font-bold tracking-wide text-gray-900 dark:text-[#f2f2f2]">CRUCEX</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-[#666] leading-relaxed max-w-sm">
              An open-source suite for security analysis. No tracking, no accounts, no data
              retention. Your passwords and scans never leave your stack.
            </p>

            <div className="flex items-center gap-2 mt-6">
              {SOCIALS.map(s => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-8 h-8 rounded border border-gray-200 dark:border-[#222] flex items-center justify-center text-gray-500 dark:text-[#555] hover:text-lime-700 dark:hover:text-lime-400 hover:border-lime-300 dark:hover:border-lime-800 transition-all"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <NavCol title="Tools" links={TOOLS} />

          <div>
            <p className="text-xs font-mono-cyber uppercase tracking-wider text-gray-500 dark:text-[#555] mb-4">
              Resources
            </p>
            <ul className="space-y-2.5">
              <li><FaqLink /></li>
            </ul>
          </div>

          <NavCol title="Legal" links={LEGAL} />
        </div>

        <div className="mt-12 py-4 border-t border-gray-100 dark:border-[#1a1a1a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-mono-cyber text-xs text-lime-700 dark:text-lime-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse" />
              online
            </span>
            <span className="text-gray-200 dark:text-[#222]">|</span>
            <p className="text-sm text-gray-600 dark:text-[#666]">
              Questions?  { ' '}
              <a href="mailto:contact@crucex.dev" className="text-lime-700 dark:text-lime-400 hover:underline font-mono-cyber">
                contact@crucex.dev
              </a>
            </p>
          </div>
          <div className="flex gap-4 text-xs font-mono-cyber text-gray-500 dark:text-[#555]">
            <Link to="/terms"      className="hover:text-lime-700 dark:hover:text-lime-400 transition-colors">Terms</Link>
            <Link to="/privacy"    className="hover:text-lime-700 dark:hover:text-lime-400 transition-colors">Privacy</Link>
            <Link to="/disclaimer" className="hover:text-lime-700 dark:hover:text-lime-400 transition-colors">Disclaimer</Link>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500 dark:text-[#444] font-mono-cyber">
          © {new Date().getFullYear()} Crucex · MIT License · Built for the curious.
        </div>
      </div>
    </footer>
  )
}
