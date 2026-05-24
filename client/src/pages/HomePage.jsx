import { useState } from 'react'
import { Link } from 'react-router-dom'
import Panel from '../components/shared/Panel'

const STATS = [
  { value: '8',    label: 'Security headers',  sub: 'CSP · HSTS · XFO · …',     accent: 'cyan' },
  { value: '10',   label: 'Ports scanned',     sub: 'FTP · SSH · MySQL · …',    accent: 'fuchsia' },
  { value: '10B+', label: 'Breached passwords', sub: 'via HIBP k-anonymity',     accent: 'emerald' },
  { value: '13',   label: 'Pattern detectors',  sub: 'keyboard walks · dates · …', accent: 'cyan' },
]

const FEATURES = [
  {
    title: 'Web Security Scanner',
    tag: 'SCAN.v2',
    description:
      'Analyse any public website for missing or misconfigured HTTP security headers, open network ports, and known vulnerability patterns. Get a scored A–F report with actionable recommendations.',
    bullets: [
      'Content-Security-Policy, HSTS, X-Frame-Options + 5 more',
      'Port scan across FTP, SSH, databases and common web ports',
      'Vulnerability detection with severity weighting',
      'Exportable JSON report — diff against previous scans',
    ],
    cta: 'Launch Scanner',
    to: '/scanner',
    accent: 'cyan',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
        <path d="M11 8v6M8 11h6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Password Analyser',
    tag: 'PWD.x86',
    description:
      'Evaluate any password for entropy, keyboard patterns, common words, and date sequences. Check it against 10 billion known breached passwords without ever transmitting the password itself.',
    bullets: [
      'Entropy calculation + effective entropy after penalties',
      '13 pattern types: keyboard walks, dates, leetspeak …',
      'Online and offline crack-time estimates (GPU rates)',
      'Breach check via Have I Been Pwned k-anonymity model',
    ],
    cta: 'Analyse Password',
    to: '/password',
    accent: 'fuchsia',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <rect x="4" y="11" width="16" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 018 0v4" />
        <circle cx="12" cy="16" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
]

const THREAT_LANDSCAPE = [
  { value: '2.6B', label: 'Records leaked this year', delta: '+18%', up: true },
  { value: '78%',  label: 'Sites missing CSP headers', delta: '+4%',  up: true },
  { value: '14s',  label: 'Average breach detection',  delta: '-9%',  up: false },
  { value: '4 in 5', label: 'Passwords reused across sites', delta: 'stable', up: null },
]

const TICKER = [
  'CVE-2024-3094 ▸ xz-utils backdoor',
  'HIBP +12M records · Jan 2026',
  'CSP misconfig top web finding',
  'OWASP A01: Broken Access Control',
  'Quantum-safe TLS: NIST PQC finalized',
  'SSH brute force +220% YoY',
  'Heartbleed still alive on 0.3% of hosts',
]

const HOW_IT_WORKS = [
  {
    tool: 'Web Security Scanner',
    accent: 'cyan',
    steps: [
      { title: 'Target',  desc: 'Paste any public URL and confirm authorisation.' },
      { title: 'Probe',   desc: 'Headers, 10 ports, and vuln signatures run in parallel.' },
      { title: 'Report',  desc: 'A–F score with per-finding recommendations. JSON export.' },
    ],
  },
  {
    tool: 'Password Analyser',
    accent: 'fuchsia',
    steps: [
      { title: 'Input',     desc: 'Your password is hashed in-browser. Never logged.' },
      { title: 'Analyse',   desc: 'Entropy + 13 pattern detectors run server-side.' },
      { title: 'Verify',    desc: 'Only 5 hash characters reach HIBP. k-anonymity preserved.' },
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
    a: 'Nowhere. The password is hashed with SHA-1 in your browser. Only the first 5 characters of the hash are sent to Have I Been Pwned, which returns all hashes sharing that prefix. The matching is done locally — your full hash never leaves the device.',
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
  'Breach checks use k-anonymity — only 5 hash chars reach HIBP.',
  'Port scanning is blocked for all private and local IP ranges.',
  'All source code is open-source and self-hostable.',
  'Zero analytics, zero trackers, zero third-party scripts.',
  'No accounts, no cookies, no fingerprinting.',
]

function TerminalMock() {
  return (
    <div className="panel font-mono-cyber text-[12px] sm:text-[13px] leading-relaxed overflow-hidden">
      {/* fake window controls */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-white/5 bg-slate-50/60 dark:bg-slate-900/60">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
        </div>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 tracking-widest">
          websec://scan/--live
        </span>
        <span className="text-[10px] text-emerald-500 dark:text-emerald-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-glow" /> LIVE
        </span>
      </div>

      <div className="p-5 space-y-1 text-slate-700 dark:text-slate-300 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-cyan-400/10 to-transparent animate-scan pointer-events-none" />

        <p><span className="text-emerald-500 dark:text-emerald-400">$</span> <span className="text-cyan-600 dark:text-cyan-300">websec</span> scan https://target.example</p>
        <p className="text-slate-500 dark:text-slate-500">→ resolving DNS ............ <span className="text-emerald-500 dark:text-emerald-400">93.184.216.34</span></p>
        <p className="text-slate-500 dark:text-slate-500">→ probing headers (8/8) ..... <span className="text-emerald-500 dark:text-emerald-400">OK</span></p>
        <p className="text-slate-500 dark:text-slate-500">→ scanning ports (10/10) .... <span className="text-emerald-500 dark:text-emerald-400">OK</span></p>
        <p className="text-slate-500 dark:text-slate-500">→ checking vuln signatures .. <span className="text-yellow-500 dark:text-yellow-400">3 findings</span></p>
        <p className="mt-2">
          <span className="text-slate-400 dark:text-slate-500">grade: </span>
          <span className="text-yellow-500 dark:text-yellow-400 font-bold">B+</span>
          <span className="text-slate-400 dark:text-slate-500"> · score: </span>
          <span className="text-cyan-600 dark:text-cyan-300">7.6 / 10</span>
        </p>
        <p>
          <span className="text-fuchsia-500 dark:text-fuchsia-400">!</span>{' '}
          <span className="text-slate-600 dark:text-slate-400">Missing</span>{' '}
          <span className="text-yellow-500 dark:text-yellow-400">Content-Security-Policy</span>
        </p>
        <p>
          <span className="text-fuchsia-500 dark:text-fuchsia-400">!</span>{' '}
          <span className="text-slate-600 dark:text-slate-400">Weak</span>{' '}
          <span className="text-yellow-500 dark:text-yellow-400">Strict-Transport-Security</span>
        </p>
        <p className="pt-1">
          <span className="text-emerald-500 dark:text-emerald-400">$</span>{' '}
          <span className="inline-block w-2 h-4 bg-cyan-500 dark:bg-cyan-300 align-middle animate-blink" />
        </p>
      </div>
    </div>
  )
}

function FaqItem({ q, a, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-slate-200 dark:border-white/5 last:border-b-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <span className="font-medium text-slate-800 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
          {q}
        </span>
        <span className={`flex-shrink-0 w-7 h-7 rounded-md border border-slate-200 dark:border-white/10 flex items-center justify-center text-cyan-500 dark:text-cyan-400 transition-transform ${open ? 'rotate-45 bg-cyan-50 dark:bg-cyan-500/10' : ''}`}>
          +
        </span>
      </button>
      {open && (
        <div className="pb-5 pr-10 text-sm text-slate-600 dark:text-slate-400 leading-relaxed animate-fade-up">
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
      <section className="relative pt-8 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-7 animate-fade-up">
            {/* status badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-300/50 dark:border-emerald-400/30 bg-emerald-50/60 dark:bg-emerald-500/10 backdrop-blur">
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                <span className="relative w-2 h-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-mono-cyber text-emerald-700 dark:text-emerald-300 tracking-wide">
                ALL SYSTEMS OPERATIONAL · 99.97% UPTIME
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.05]">
              <span className="text-slate-900 dark:text-white">Security</span><br />
              <span className="gradient-text">isn't a feature.</span><br />
              <span className="text-slate-900 dark:text-white">It's the </span>
              <span className="relative inline-block">
                <span className="text-cyan-500 dark:text-cyan-300 text-glow-cyan">baseline</span>
                <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-gradient-to-r from-cyan-400 to-fuchsia-500" />
              </span>
              <span className="text-slate-900 dark:text-white">.</span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              Scan websites for vulnerabilities. Check passwords against billions of known
              breaches. Free, open-source, and built with privacy as a non-negotiable.
            </p>

            <div className="flex gap-4 flex-wrap">
              <Link
                to="/scanner"
                className="group relative bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-semibold px-7 py-3.5 rounded-md transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/60 hover:-translate-y-0.5 inline-flex items-center gap-2"
              >
                <span>Launch Scanner</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link
                to="/password"
                className="group relative border border-slate-300 dark:border-white/10 hover:border-fuchsia-400/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm text-slate-700 dark:text-slate-200 font-semibold px-7 py-3.5 rounded-md transition-all hover:-translate-y-0.5 inline-flex items-center gap-2"
              >
                <span>Analyse Password</span>
                <span className="text-fuchsia-500 dark:text-fuchsia-400 transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-2 text-xs font-mono-cyber text-slate-500 dark:text-slate-500">
              <span className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> No signup</span>
              <span className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> No tracking</span>
              <span className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> MIT licensed</span>
            </div>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '120ms' }}>
            <TerminalMock />
          </div>
        </div>
      </section>

      {/* THREAT TICKER */}
      <section className="relative -mx-6 px-0 py-3 border-y border-slate-200 dark:border-white/5 bg-slate-50/60 dark:bg-slate-950/60 backdrop-blur-md overflow-hidden">
        <div className="flex items-center gap-6">
          <span className="flex-shrink-0 ml-6 inline-flex items-center gap-2 text-xs font-mono-cyber text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-pulse-glow" />
            Live Threat Feed
          </span>
          <div className="relative flex overflow-hidden flex-1">
            <div className="flex gap-12 animate-ticker whitespace-nowrap font-mono-cyber text-xs text-slate-600 dark:text-slate-400">
              {[...TICKER, ...TICKER].map((t, i) => (
                <span key={i} className="flex items-center gap-3">
                  <span className="text-cyan-500 dark:text-cyan-400">▸</span>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <Panel key={s.label} accent={s.accent} hover className="p-6 animate-fade-up" >
            <div className="flex items-baseline gap-2">
              <p className={`text-4xl font-bold font-mono-cyber ${
                s.accent === 'fuchsia' ? 'text-fuchsia-500 dark:text-fuchsia-400 text-glow-fuchsia'
                : s.accent === 'emerald' ? 'text-emerald-500 dark:text-emerald-400'
                : 'text-cyan-500 dark:text-cyan-300 text-glow-cyan'
              }`}>
                {s.value}
              </p>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 mt-2 font-medium">{s.label}</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 font-mono-cyber">{s.sub}</p>
          </Panel>
        ))}
      </section>

      {/* FEATURES */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-mono-cyber text-cyan-600 dark:text-cyan-400 tracking-widest uppercase mb-2">
              &gt; What you can do
            </p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Two tools. Zero excuses.</h2>
          </div>
          <p className="hidden sm:block text-sm text-slate-500 dark:text-slate-500 font-mono-cyber">[ 02 / 04 ]</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {FEATURES.map((f, i) => (
            <Panel
              key={f.title}
              accent={f.accent}
              hover
              className="p-8 flex flex-col gap-5 animate-fade-up"
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-md flex items-center justify-center ${
                  f.accent === 'fuchsia'
                    ? 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/15 dark:text-fuchsia-300'
                    : 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-300'
                }`}>
                  {f.icon}
                </div>
                <span className="text-[10px] font-mono-cyber tracking-widest text-slate-400 dark:text-slate-500 px-2 py-1 border border-slate-200 dark:border-white/10 rounded">
                  {f.tag}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.description}</p>
              </div>

              <ul className="space-y-2 flex-1 pt-2">
                {f.bullets.map(b => (
                  <li key={b} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${
                      f.accent === 'fuchsia' ? 'bg-fuchsia-500' : 'bg-cyan-500'
                    }`} />
                    {b}
                  </li>
                ))}
              </ul>

              <Link
                to={f.to}
                className={`inline-flex items-center gap-2 text-sm font-mono-cyber font-semibold transition-all group/cta ${
                  f.accent === 'fuchsia'
                    ? 'text-fuchsia-600 dark:text-fuchsia-300 hover:text-fuchsia-500'
                    : 'text-cyan-600 dark:text-cyan-300 hover:text-cyan-500'
                }`}
              >
                {f.cta}
                <span className="transition-transform group-hover/cta:translate-x-1">→</span>
              </Link>
            </Panel>
          ))}
        </div>
      </section>

      {/* THREAT LANDSCAPE */}
      <section className="space-y-6">
        <div>
          <p className="text-xs font-mono-cyber text-fuchsia-600 dark:text-fuchsia-400 tracking-widest uppercase mb-2">
            &gt; Threat landscape
          </p>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">The internet is not getting safer.</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3 max-w-2xl">
            Public threat-intel signals from 2026. The baseline is shifting — and most public
            sites still ship default headers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {THREAT_LANDSCAPE.map((t, i) => (
            <div key={t.label} className="relative p-6 rounded-md border border-slate-200 dark:border-white/5 bg-gradient-to-br from-white/60 to-slate-50/40 dark:from-slate-900/40 dark:to-slate-950/40 backdrop-blur-sm overflow-hidden group hover:border-fuchsia-400/40 transition-colors">
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-fuchsia-500/5 group-hover:bg-fuchsia-500/15 transition-colors blur-2xl" />
              <div className="relative">
                <p className="text-3xl font-bold font-mono-cyber text-slate-900 dark:text-white">{t.value}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{t.label}</p>
                {t.delta && (
                  <p className={`text-xs font-mono-cyber mt-3 inline-flex items-center gap-1 ${
                    t.up === true ? 'text-red-500 dark:text-red-400'
                    : t.up === false ? 'text-emerald-500 dark:text-emerald-400'
                    : 'text-slate-500'
                  }`}>
                    {t.up === true ? '▲' : t.up === false ? '▼' : '◆'} {t.delta} YoY
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="space-y-6">
        <div>
          <p className="text-xs font-mono-cyber text-cyan-600 dark:text-cyan-400 tracking-widest uppercase mb-2">
            &gt; Workflow
          </p>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">How it works</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {HOW_IT_WORKS.map(tool => (
            <Panel key={tool.tool} accent={tool.accent} className="p-7">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-mono-cyber text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                  {tool.tool}
                </h3>
                <span className="text-[10px] font-mono-cyber text-slate-400 dark:text-slate-500">
                  03 STEPS
                </span>
              </div>

              <div className="relative">
                {/* vertical line */}
                <span className={`absolute left-[15px] top-3 bottom-3 w-px ${
                  tool.accent === 'fuchsia'
                    ? 'bg-gradient-to-b from-fuchsia-400/60 via-fuchsia-400/30 to-transparent'
                    : 'bg-gradient-to-b from-cyan-400/60 via-cyan-400/30 to-transparent'
                }`} />

                <ol className="space-y-6">
                  {tool.steps.map((s, i) => (
                    <li key={s.title} className="flex gap-5 relative">
                      <span className={`relative z-10 w-8 h-8 rounded-md flex items-center justify-center font-mono-cyber text-xs font-bold shrink-0 ${
                        tool.accent === 'fuchsia'
                          ? 'bg-fuchsia-500/10 border border-fuchsia-400/40 text-fuchsia-600 dark:text-fuchsia-300'
                          : 'bg-cyan-500/10 border border-cyan-400/40 text-cyan-600 dark:text-cyan-300'
                      }`}>
                        0{i + 1}
                      </span>
                      <div className="pt-0.5">
                        <p className="font-semibold text-slate-900 dark:text-white">{s.title}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{s.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Panel>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div>
            <p className="text-xs font-mono-cyber text-cyan-600 dark:text-cyan-400 tracking-widest uppercase mb-2">
              &gt; FAQ
            </p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Questions <br />we get a lot.
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
              If something isn't covered here, the code is the source of truth. Check the
              repo or reach out — we answer.
            </p>
            <a href="#" className="inline-flex items-center gap-2 mt-6 text-sm font-mono-cyber text-cyan-600 dark:text-cyan-300 hover:text-cyan-500">
              Read the docs →
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
        <div>
          <p className="text-xs font-mono-cyber text-emerald-600 dark:text-emerald-400 tracking-widest uppercase mb-2">
            &gt; Principles
          </p>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Privacy isn't a footer disclaimer.</h2>
        </div>

        <Panel accent="emerald" className="p-8">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            {PRIVACY.map(p => (
              <li key={p} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                <span className="mt-0.5 w-5 h-5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs shrink-0">
                  ✓
                </span>
                {p}
              </li>
            ))}
          </ul>
        </Panel>
      </section>

      {/* CTA */}
      <section className="relative">
        <div className="relative overflow-hidden rounded-lg border border-slate-200 dark:border-white/5 bg-gradient-to-br from-cyan-500/10 via-fuchsia-500/5 to-transparent dark:from-cyan-500/15 dark:via-fuchsia-500/10 p-12 text-center">
          <div className="absolute inset-0 bg-grid opacity-40" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-cyan-500/20 rounded-full blur-3xl" />

          <div className="relative space-y-5">
            <p className="font-mono-cyber text-xs text-cyan-600 dark:text-cyan-400 tracking-widest uppercase">
              &gt; Ready when you are
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white max-w-2xl mx-auto">
              Find out what your stack is leaking. <span className="gradient-text">In under a minute.</span>
            </h2>
            <div className="flex gap-4 justify-center pt-3 flex-wrap">
              <Link
                to="/scanner"
                className="bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-semibold px-7 py-3.5 rounded-md transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/60"
              >
                Start a scan →
              </Link>
              <Link
                to="/password"
                className="border border-slate-300 dark:border-white/10 hover:border-fuchsia-400/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm text-slate-700 dark:text-slate-200 font-semibold px-7 py-3.5 rounded-md transition-all"
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
