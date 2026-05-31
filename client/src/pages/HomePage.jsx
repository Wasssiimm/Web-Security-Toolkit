import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Panel from '../components/shared/Panel'

const STATS = [
  { value: '8',    label: 'Security headers',  sub: 'CSP · HSTS · XFO · XCTO + 4 more' },
  { value: '10',   label: 'Ports scanned',     sub: 'FTP, SSH, SMTP, MySQL, Redis…'     },
  { value: '10B+', label: 'Breach records',    sub: 'via HIBP k-anonymity'               },
  { value: '13',   label: 'Pattern detectors', sub: 'keyboard walks, dates, leet…'      },
]

const FEATURES = [
  {
    title: 'Web Security Scanner',
    description:
      'Analyse any public website for missing or misconfigured HTTP security headers, open network ports, and known vulnerability patterns. Get a scored A-F report with actionable recommendations.',
    bullets: [
      'Content-Security-Policy, HSTS, X-Frame-Options + 5 more',
      'Port scan across FTP, SSH, databases, and common web ports',
      'Vulnerability detection with weighted severity scoring',
      'Export the full report as JSON for diffing and auditing',
    ],
    cta: 'Launch Scanner',
    to: '/scanner',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Password Analyser',
    description:
      'Evaluate any password for entropy, keyboard patterns, common words, and date sequences. Check it against 10 billion known breached passwords without ever transmitting the password itself.',
    bullets: [
      'Entropy calculation with effective-entropy after penalties',
      '13 pattern types: keyboard walks, dates, leetspeak and more',
      'Offline and online crack-time estimates using GPU rates',
      'Breach check via Have I Been Pwned k-anonymity model',
    ],
    cta: 'Analyse Password',
    to: '/password',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <rect x="4" y="11" width="16" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 018 0v4" />
      </svg>
    ),
  },
]

const THREAT_LANDSCAPE = [
  { value: '2.6B',  label: 'Records leaked this year',       delta: '+18%',  up: true  },
  { value: '78%',   label: 'Sites missing CSP headers',      delta: '+4%',   up: true  },
  { value: '14s',   label: 'Average breach detection',       delta: '-9%',   up: false },
  { value: '4 in 5', label: 'Passwords reused across sites', delta: 'stable', up: null },
]

const TICKER = [
  'CVE-2024-3094 - xz-utils backdoor',
  'HIBP +12M records · Jan 2026',
  'CSP misconfig top web finding',
  'OWASP A01: Broken Access Control',
  'Quantum-safe TLS: NIST PQC finalized',
  'SSH brute force +220% YoY',
  'Heartbleed still alive on 0.3% of hosts',
  'CVE-2024-21762 - Fortinet auth bypass CVSS 9.8',
  'Ransomware payments hit $1.1B in 2023',
  '43% of breaches involve web applications',
  'CVE-2024-1709 - ConnectWise ScreenConnect RCE',
  'Log4Shell still exploited on 30% of vulnerable hosts',
  'Default passwords account for 21% of compromised devices',
  'CVE-2023-44487 - HTTP/2 Rapid Reset DDoS',
  '94% of malware delivered via email',
  'Supply chain attacks up 633% since 2021',
  'CVE-2024-27198 - JetBrains TeamCity auth bypass',
  'Average time to detect a breach: 194 days',
  'CVE-2024-6387 - OpenSSH regreSSHion RCE',
  'Phishing accounts for 36% of all data breaches',
]

const HOW_IT_WORKS = [
  {
    tool: 'Web Security Scanner',
    steps: [
      { title: 'Target',  desc: 'Paste any public URL and confirm authorisation.' },
      { title: 'Probe',   desc: 'Headers, 10 ports, and vuln signatures run in parallel.' },
      { title: 'Report',  desc: 'A-F score with per-finding recommendations. JSON export.' },
    ],
  },
  {
    tool: 'Password Analyser',
    steps: [
      { title: 'Input',   desc: 'Your password is hashed in-browser. Never logged.' },
      { title: 'Analyse', desc: 'Entropy and 13 pattern detectors run server-side.' },
      { title: 'Verify',  desc: 'Only 5 hash characters reach HIBP. k-anonymity preserved.' },
    ],
  },
]

const FAQ = [
  {
    q: 'Is this safe to run against my own site?',
    a: 'Yes. The scanner only performs read-only HTTP requests and TCP port probes against the targets you authorise. There are no payloads, no fuzzing, and no exploitation attempts. Private and local IP ranges are blocked.',
  },
  {
    q: 'Where do my passwords go?',
    a: 'Nowhere. The password is hashed with SHA-1 in your browser. Only the first 5 characters of the hash are sent to Have I Been Pwned, which returns all hashes sharing that prefix. The matching is done locally, so your full hash never leaves the device.',
  },
  {
    q: 'Why open-source?',
    a: 'Security tools should be auditable. You can read every line that touches your data, self-host the entire stack, and verify there is no telemetry or back-channel reporting.',
  },
  {
    q: 'Do you store scan results?',
    a: 'No. Reports live in your browser session only. Use the JSON export to keep a copy locally or commit it to your own repository for diffing against future scans.',
  },
  {
    q: 'What is k-anonymity?',
    a: 'A privacy-preserving lookup model: instead of sending a full hash, you send a short prefix and the server returns every hash that shares it. The lookup happens client-side, so the breach database never learns which exact password you queried.',
  },
]

const PRIVACY = [
  'Passwords and URLs are never stored or logged.',
  'Breach checks use k-anonymity. Only 5 hash chars reach HIBP.',
  'Port scanning is blocked for all private and local IP ranges.',
  'All source code is open-source and self-hostable.',
  'Zero analytics, zero trackers, zero third-party scripts.',
  'No accounts, no cookies, no fingerprinting.',
]

function TerminalMock() {
  const [history,  setHistory]  = useState([])
  const [input,    setInput]    = useState('')
  const scrollRef = useRef(null)
  const inputRef  = useRef(null)

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      const cmd = input.trim()
      if (cmd) {
        setHistory(h => [...h, cmd])
        setInput('')
      }
    }
  }

  function reset() {
    setHistory([])
    setInput('')
    inputRef.current?.focus()
  }

  useEffect(() => {
    if (history.length === 0 || !scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [history])

  return (
    <div className="panel font-mono-cyber text-[12px] sm:text-[13px] leading-relaxed overflow-hidden flex flex-col h-96">

      {/* Title bar — red dot acts as reset button */}
      <div className="flex-none flex items-center justify-between px-4 py-2.5 border-b border-gray-100 dark:border-[#1e1e1e] bg-gray-50 dark:bg-[#0d0d0d]">
        <div className="flex items-center gap-1.5">
          <button
            onClick={reset}
            title="Reset terminal"
            className="w-2.5 h-2.5 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
          />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-lime-400/60" />
        </div>
        <span className="text-[11px] text-gray-500 dark:text-[#555]">crucex - scan</span>
        <span className="text-[11px] text-lime-700 dark:text-lime-500 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse" /> live
        </span>
      </div>

      {/* Scrollable output — flex-1 + min-h-0 fills remaining space exactly */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 px-5 pt-5 pb-2 space-y-1 text-gray-600 dark:text-[#aaa] overflow-y-auto overscroll-none relative"
        onClick={() => inputRef.current?.focus()}
        onWheel={e => {
          const el = scrollRef.current
          if (!el) return
          const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1
          const atTop    = el.scrollTop <= 0
          if ((e.deltaY > 0 && atBottom) || (e.deltaY < 0 && atTop)) {
            e.preventDefault()
          }
        }}
      >
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-lime-400/6 to-transparent animate-scan pointer-events-none" />

        {/* Static scan output */}
        <p>
          <span className="text-lime-700 dark:text-lime-400">$</span>{' '}
          <span className="text-gray-900 dark:text-[#f2f2f2]">crucex</span> scan https://target.example
        </p>
        <p className="text-gray-500 dark:text-[#555]">{'  '}resolving DNS ........... <span className="text-lime-700 dark:text-lime-400">93.184.216.34</span></p>
        <p className="text-gray-500 dark:text-[#555]">{'  '}probing headers (8/8) ... <span className="text-lime-700 dark:text-lime-400">OK</span></p>
        <p className="text-gray-500 dark:text-[#555]">{'  '}scanning ports (10/10) .. <span className="text-lime-700 dark:text-lime-400">OK</span></p>
        <p className="text-gray-500 dark:text-[#555]">{'  '}checking vuln sigs ...... <span className="text-yellow-500 dark:text-yellow-400">3 findings</span></p>
        <p className="mt-3">
          <span className="text-gray-500 dark:text-[#555]">grade{'  '}</span>
          <span className="text-yellow-500 font-bold">B</span>
          <span className="text-gray-500 dark:text-[#555]">{'    '}score{'  '}</span>
          <span className="text-gray-900 dark:text-[#f2f2f2]">7.6 / 10</span>
        </p>
        <p>
          <span className="text-red-500 dark:text-red-400">!</span>{' '}
          <span className="text-gray-500 dark:text-[#666]">Missing</span>{' '}
          <span className="text-yellow-500 dark:text-yellow-400">Content-Security-Policy</span>
        </p>
        <p>
          <span className="text-orange-500 dark:text-orange-400">!</span>{' '}
          <span className="text-gray-500 dark:text-[#666]">Weak</span>{' '}
          <span className="text-yellow-500 dark:text-yellow-400">Strict-Transport-Security</span>
        </p>

        {/* User command history */}
        {history.map((cmd, i) => (
          <p key={i} className="mt-1">
            <span className="text-lime-700 dark:text-lime-400">$</span>{' '}
            <span className="text-gray-900 dark:text-[#f2f2f2]">{cmd}</span>
          </p>
        ))}
      </div>

      {/* Interactive input row — flex-none stays pinned at the bottom */}
      <div
        className="flex-none flex items-center gap-2 px-5 py-3 border-t border-gray-100 dark:border-[#1e1e1e] cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        <span className="text-lime-700 dark:text-lime-400 select-none shrink-0">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="type a command..."
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="flex-1 bg-transparent outline-none text-gray-900 dark:text-[#f2f2f2] placeholder-gray-400 dark:placeholder-[#333] caret-lime-500 min-w-0"
        />
      </div>

    </div>
  )
}

function FaqItem({ q, a, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-100 dark:border-[#1e1e1e] last:border-b-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <span className="text-sm font-medium text-gray-800 dark:text-[#e0e0e0] group-hover:text-lime-700 dark:group-hover:text-lime-400 transition-colors">
          {q}
        </span>
        <span className={`flex-shrink-0 w-6 h-6 rounded border border-gray-200 dark:border-[#2a2a2a] flex items-center justify-center text-lime-700 dark:text-lime-400 font-mono-cyber text-xs transition-transform ${open ? 'rotate-45 bg-lime-50 dark:bg-lime-400/10' : ''}`}>
          +
        </span>
      </button>
      {open && (
        <div className="pb-5 pr-8 text-sm text-gray-600 dark:text-[#888] leading-relaxed animate-fade-up">
          {a}
        </div>
      )}
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="space-y-24 pb-12">

      {/* HERO */}
      <section className="pt-8 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-7 animate-fade-up">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.05] text-gray-900 dark:text-[#f2f2f2]">
              Security tools<br />for developers<br />
              <span className="text-lime-500 dark:text-lime-400">who ship.</span>
            </h1>

            <p className="text-base text-gray-600 dark:text-[#888] leading-relaxed max-w-lg">
              Scan any website for missing security headers, open ports, and known vulnerability
              patterns. Check passwords against billions of known breaches without logging a single
              character.
            </p>

            <div className="flex gap-3 flex-wrap">
              <Link
                to="/scanner"
                className="group bg-lime-400 hover:bg-lime-300 text-[#090909] font-semibold px-6 py-2.5 rounded transition-all inline-flex items-center gap-2 active:scale-[0.98]"
              >
                Run a scan
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
              <Link
                to="/password"
                className="group border border-gray-200 dark:border-[#222] hover:border-gray-300 dark:hover:border-[#333] text-gray-700 dark:text-[#ccc] font-semibold px-6 py-2.5 rounded transition-all inline-flex items-center gap-2 active:scale-[0.98]"
              >
                Check a password
                <span className="text-gray-300 dark:text-[#444] transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </div>

            <div className="flex items-center gap-5 text-xs font-mono-cyber text-gray-500 dark:text-[#555]">
              <span className="flex items-center gap-1.5"><span className="text-lime-500">+</span> No signup</span>
              <span className="flex items-center gap-1.5"><span className="text-lime-500">+</span> No tracking</span>
              <span className="flex items-center gap-1.5"><span className="text-lime-500">+</span> MIT licensed</span>
            </div>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
            <TerminalMock />
          </div>
        </div>
      </section>

      {/* CVE FEED */}
      <section className="-mx-6 px-0 py-3 border-y border-gray-100 dark:border-[#1a1a1a] bg-gray-50/90 dark:bg-[#0c0c0c] overflow-hidden">
        <div className="flex items-center gap-6">
          <span className="flex-shrink-0 ml-6 inline-flex items-center gap-2 text-[11px] font-mono-cyber text-lime-700 dark:text-lime-500 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse" />
            CVE Feed
          </span>
          <div className="relative flex overflow-hidden flex-1">
            <div className="flex gap-12 animate-ticker whitespace-nowrap font-mono-cyber text-xs text-gray-500 dark:text-[#555]">
              {[...TICKER, ...TICKER].map((t, i) => (
                <span key={i} className="flex items-center gap-3">
                  <span className="text-lime-500 dark:text-lime-700">+</span>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STATS.map(s => (
            <div key={s.label} className="group relative panel panel-hover p-6">
              {/* corner ticks — a nod to the terminal-bracket panels */}
              <span className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-lime-500/40 group-hover:border-lime-500 transition-colors" />
              <span className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-lime-500/40 group-hover:border-lime-500 transition-colors" />
              <p className="text-4xl font-bold font-mono-cyber text-gray-900 dark:text-[#f2f2f2]">{s.value}</p>
              <p className="text-sm font-medium text-gray-700 dark:text-[#ccc] mt-2">{s.label}</p>
              <p className="text-xs text-gray-500 dark:text-[#555] mt-1 font-mono-cyber">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-[#f2f2f2]">Two tools. Zero excuses.</h2>
          <p className="text-sm text-gray-600 dark:text-[#888] mt-2">Free, open-source, and built for developers who take security seriously.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {FEATURES.map(f => (
            <Panel key={f.title} hover className="p-7 flex flex-col gap-5">
              <div className="w-10 h-10 rounded bg-lime-50 dark:bg-lime-400/10 text-lime-700 dark:text-lime-400 flex items-center justify-center shrink-0">
                {f.icon}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-[#f2f2f2]">{f.title}</h3>
                <p className="text-sm text-gray-600 dark:text-[#888] leading-relaxed">{f.description}</p>
              </div>

              <ul className="space-y-2.5 flex-1">
                {f.bullets.map(b => (
                  <li key={b} className="flex items-start gap-3 text-sm text-gray-600 dark:text-[#aaa]">
                    <span className="mt-1.5 w-1 h-1 rounded-full shrink-0 bg-lime-500" />
                    {b}
                  </li>
                ))}
              </ul>

              <Link
                to={f.to}
                className="inline-flex items-center gap-2 text-sm font-medium text-lime-700 dark:text-lime-400 hover:text-lime-500 dark:hover:text-lime-300 transition-colors group/cta"
              >
                {f.cta}
                <span className="transition-transform group-hover/cta:translate-x-0.5">→</span>
              </Link>
            </Panel>
          ))}
        </div>
      </section>

      {/* THREAT LANDSCAPE */}
      <section className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-[#f2f2f2]">The internet is not getting safer.</h2>
          <p className="text-sm text-gray-600 dark:text-[#888] mt-2 max-w-xl">
            Public threat-intel signals from 2026. The baseline is shifting and most public sites still ship default headers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {THREAT_LANDSCAPE.map(t => (
            <div key={t.label} className="p-6 rounded border border-gray-100 dark:border-[#1e1e1e] bg-white dark:bg-[#111]">
              <p className="text-3xl font-bold font-mono-cyber text-gray-900 dark:text-[#f2f2f2]">{t.value}</p>
              <p className="text-sm text-gray-600 dark:text-[#888] mt-1.5">{t.label}</p>
              {t.delta && (
                <p className={`text-xs font-mono-cyber mt-3 flex items-center gap-1 ${
                  t.up === true  ? 'text-red-500 dark:text-red-400'
                  : t.up === false ? 'text-lime-700 dark:text-lime-400'
                  : 'text-gray-500 dark:text-[#555]'
                }`}>
                  {t.up === true ? '+ ' : t.up === false ? '- ' : '  '}{t.delta} YoY
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-[#f2f2f2]">How it works</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {HOW_IT_WORKS.map(tool => (
            <Panel key={tool.tool} className="p-7">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-[#f2f2f2] mb-6 font-mono-cyber uppercase tracking-wider">{tool.tool}</h3>
              <ol className="space-y-5">
                {tool.steps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="w-6 h-6 rounded bg-lime-50 dark:bg-lime-400/10 text-lime-700 dark:text-lime-400 font-mono-cyber text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-[#e0e0e0]">{s.title}</p>
                      <p className="text-sm text-gray-600 dark:text-[#888] mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Panel>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div>
            <p className="text-xs font-mono-cyber text-lime-700 dark:text-lime-500 uppercase tracking-widest mb-3">
              Questions
            </p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-[#f2f2f2]">
              Common questions.
            </h2>
            <p className="text-sm text-gray-600 dark:text-[#888] mt-3 leading-relaxed">
              If something isn't covered here, the code is the source of truth. Check the repo or reach out.
            </p>
            <a href="#" className="inline-flex items-center gap-2 mt-5 text-sm font-mono-cyber text-lime-700 dark:text-lime-400 hover:text-lime-500 transition-colors">
              View the source →
            </a>
          </div>

          <Panel className="lg:col-span-2 px-7">
            {FAQ.map((item, i) => (
              <FaqItem key={item.q} q={item.q} a={item.a} defaultOpen={i === 0} />
            ))}
          </Panel>
        </div>
      </section>

      {/* PRIVACY */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-[#f2f2f2]">Privacy isn't a footer disclaimer.</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
          {PRIVACY.map(p => (
            <li key={p} className="flex items-start gap-3 text-sm text-gray-600 dark:text-[#aaa]">
              <span className="mt-0.5 text-lime-500 font-mono-cyber shrink-0 font-bold text-xs">+</span>
              {p}
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section>
        <div className="relative overflow-hidden rounded border border-gray-100 dark:border-[#1e1e1e] bg-gray-50 dark:bg-[#0d0d0d] p-12">
          <div className="absolute inset-0 bg-dot-grid bg-dot-fade" />
          <div className="relative text-center space-y-5">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-[#f2f2f2] max-w-xl mx-auto">
              Find out what your stack is leaking.
            </h2>
            <p className="text-sm text-gray-600 dark:text-[#888] max-w-sm mx-auto">
              Takes under a minute. No account, no install, no configuration.
            </p>
            <div className="flex gap-3 justify-center pt-1 flex-wrap">
              <Link
                to="/scanner"
                className="bg-lime-400 hover:bg-lime-300 text-[#090909] font-semibold px-6 py-2.5 rounded transition-all active:scale-[0.98]"
              >
                Start a scan
              </Link>
              <Link
                to="/password"
                className="border border-gray-200 dark:border-[#222] hover:border-gray-300 dark:hover:border-[#333] text-gray-700 dark:text-[#ccc] font-semibold px-6 py-2.5 rounded transition-all"
              >
                Test a password
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
