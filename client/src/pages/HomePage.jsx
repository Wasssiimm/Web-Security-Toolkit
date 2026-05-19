import { Link } from 'react-router-dom'

const STATS = [
  { value: '8',   label: 'Security headers checked' },
  { value: '10',  label: 'Ports scanned per target'  },
  { value: '10B+', label: 'Known breached passwords'  },
]

const FEATURES = [
  {
    title: 'Web Security Scanner',
    description:
      'Analyse any public website for missing or misconfigured HTTP security headers, open network ports, and known vulnerability patterns. Get a scored A–F report with recommendations.',
    bullets: [
      'Content-Security-Policy, HSTS, X-Frame-Options and 5 more headers',
      'Port scan across FTP, SSH, databases and common web ports',
      'Vulnerability detection with severity weighting',
      'Exportable JSON report',
    ],
    cta: 'Scan a Website',
    to: '/scanner',
  },
  {
    title: 'Password Strength Analyser',
    description:
      'Evaluate any password for entropy, keyboard patterns, common words, and date sequences. Check it against 10 billion known breached passwords without ever transmitting it.',
    bullets: [
      'Entropy calculation with effective entropy after pattern penalties',
      '13 pattern types detected (keyboard walks, dates, leetspeak and more)',
      'Online and offline crack time estimates',
      'Breach check via Have I Been Pwned k-anonymity model',
    ],
    cta: 'Analyse a Password',
    to: '/password',
  },
]

const HOW_IT_WORKS = [
  {
    tool: 'Web Security Scanner',
    steps: [
      { n: '1', title: 'Enter a URL', desc: 'Paste any public website address and tick the permission box.' },
      { n: '2', title: 'We do the work', desc: 'Headers are fetched, 10 ports are scanned, and vulnerabilities are detected in parallel.' },
      { n: '3', title: 'Get your report', desc: 'A scored A–F report with per-finding recommendations is shown instantly. Export it as JSON.' },
    ],
  },
  {
    tool: 'Password Analyser',
    steps: [
      { n: '1', title: 'Type your password', desc: 'Your password is never stored or logged — it goes nowhere beyond your own server.' },
      { n: '2', title: 'Local hash + analysis', desc: 'SHA-1 is computed in your browser. Entropy and patterns are analysed server-side.' },
      { n: '3', title: 'Private breach check', desc: 'Only the first 5 characters of the hash go to Have I Been Pwned — the rest never leaves.' },
    ],
  },
]

const PRIVACY = [
  'No passwords or URLs are ever stored or logged.',
  'Breach checks use k-anonymity — only 5 hash characters reach HIBP.',
  'Port scanning is blocked for all private and local IP ranges.',
  'All source code is open-source and self-hostable.',
]

export default function HomePage() {
  return (
    <div className="space-y-16 py-8">

      {/* Hero */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
          Security analysis,{' '}
          <span className="text-cyan-500 dark:text-cyan-400">open to everyone.</span>
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Scan websites for vulnerabilities. Check passwords against billions of known
          breaches. Free, open-source, and built with privacy in mind.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="/scanner"
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium px-7 py-3 rounded-lg transition-colors"
          >
            Scan a Website →
          </Link>
          <Link
            to="/password"
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium px-7 py-3 rounded-lg transition-colors"
          >
            Analyse a Password →
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5 text-center">
            <p className="text-3xl font-bold text-cyan-500 dark:text-cyan-400">{s.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Feature cards */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">What you can do</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FEATURES.map(f => (
            <div key={f.title} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 space-y-4 flex flex-col">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.description}</p>
              </div>
              <ul className="space-y-1.5 flex-1">
                {f.bullets.map(b => (
                  <li key={b} className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="text-cyan-500 dark:text-cyan-400 shrink-0 mt-0.5">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                to={f.to}
                className="inline-flex items-center text-sm text-cyan-500 dark:text-cyan-400 hover:text-cyan-400 dark:hover:text-cyan-300 font-medium transition-colors mt-2"
              >
                {f.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">How it works</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {HOW_IT_WORKS.map(tool => (
            <div key={tool.tool} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-gray-500 dark:text-gray-300 text-sm uppercase tracking-wide">
                {tool.tool}
              </h3>
              <ol className="space-y-4">
                {tool.steps.map(s => (
                  <li key={s.n} className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-cyan-50 dark:bg-cyan-900/50 border border-cyan-200 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {s.n}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{s.title}</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy & ethics */}
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">Privacy &amp; ethics</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRIVACY.map(p => (
            <li key={p} className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="text-cyan-500 dark:text-cyan-400 shrink-0 mt-0.5">✓</span>
              {p}
            </li>
          ))}
        </ul>
      </section>

    </div>
  )
}
