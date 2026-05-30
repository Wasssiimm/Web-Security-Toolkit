import { Link } from 'react-router-dom'
import CorvexLogo from './CorvexLogo'

const COLS = [
  {
    title: 'Tools',
    links: [
      { label: 'Web Security Scanner', to: '/scanner' },
      { label: 'Password Analyser', to: '/password' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'FAQ', href: '#faq' },
    ],
  },
]

const SOCIALS = [
  { label: 'GitHub', icon: 'M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z' },
  { label: 'X', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  { label: 'Discord', icon: 'M20.317 4.37a19.79 19.79 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z' },
]

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-slate-200 dark:border-white/5 bg-white/30 dark:bg-slate-950/40 backdrop-blur-md">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 pt-14 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-md bg-slate-900 dark:bg-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-white/5">
                <CorvexLogo size={26} />
              </div>
              <div>
                <p className="font-orbitron font-bold tracking-wider text-slate-900 dark:text-white">CRUCEX</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              An open-source suite for security analysis. No tracking, no accounts, no data
              retention — your passwords and scans never leave your stack.
            </p>

            <div className="flex items-center gap-3 mt-6">
              {SOCIALS.map(s => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-md border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 hover:border-cyan-400/50 transition-all hover:-translate-y-0.5"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {COLS.map(col => (
            <div key={col.title}>
              <p className="text-xs font-mono-cyber uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-4">
                &gt; {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l.label}>
                    {l.to ? (
                      <Link
                        to={l.to}
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors inline-flex items-center gap-1.5 group"
                      >
                        <span className="opacity-0 group-hover:opacity-100 text-cyan-500 dark:text-cyan-400 transition-opacity">→</span>
                        <span className="-ml-3 group-hover:ml-0 transition-all">{l.label}</span>
                      </Link>
                    ) : (
                      <a
                        href={l.href}
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors inline-flex items-center gap-1.5 group"
                      >
                        <span className="opacity-0 group-hover:opacity-100 text-cyan-500 dark:text-cyan-400 transition-opacity">→</span>
                        <span className="-ml-3 group-hover:ml-0 transition-all">{l.label}</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact strip */}
        <div className="mt-12 p-4 rounded-md border border-slate-200 dark:border-white/5 bg-slate-50/60 dark:bg-slate-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono-cyber text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-glow" />
              SYSTEM ONLINE
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Questions or feedback? Reach out at{' '}
              <a href="mailto:contact@crucex.dev" className="text-cyan-600 dark:text-cyan-400 hover:underline font-mono-cyber">
                contact@crucex.dev
              </a>
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/5 flex items-center justify-center text-xs text-slate-500 dark:text-slate-500">
          <p className="font-mono-cyber">
            © {new Date().getFullYear()} Scrutex &nbsp;·&nbsp; Built for the curious.
          </p>
        </div>
      </div>
    </footer>
  )
}
