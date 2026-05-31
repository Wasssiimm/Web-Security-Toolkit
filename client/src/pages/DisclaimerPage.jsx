import { Link } from 'react-router-dom'

const LAST_UPDATED = 'May 2026'

function Section({ num, title, children }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-baseline gap-3">
        <span className="font-mono-cyber text-xs text-cyan-600 dark:text-cyan-400 shrink-0">{num}</span>
        {title}
      </h2>
      <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-2 pl-7">
        {children}
      </div>
    </section>
  )
}

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-fade-up pb-16">

      {/* Header */}
      <div className="space-y-3">
        <p className="text-xs font-mono-cyber text-cyan-600 dark:text-cyan-400 tracking-widest uppercase">
          &gt; Legal / Disclaimer
        </p>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Disclaimer</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-mono-cyber">
          Last updated: {LAST_UPDATED}
        </p>
        <div className="h-px bg-gradient-to-r from-cyan-400/50 via-fuchsia-500/30 to-transparent" />
      </div>

      {/* Warning banner */}
      <div className="flex items-start gap-3 bg-yellow-50 dark:bg-yellow-400/10 border border-yellow-300 dark:border-yellow-400/50 rounded-md px-4 py-3">
        <span className="text-yellow-600 dark:text-yellow-300 shrink-0 mt-0.5 text-base">⚠</span>
        <p className="text-sm text-yellow-900 dark:text-yellow-100 leading-relaxed">
          <span className="font-mono-cyber font-semibold">Important:</span>{' '}
          Crucex is a security research and educational tool. Scanning systems without
          explicit authorisation is illegal in most jurisdictions. Always obtain written
          permission before testing any system you do not own.
        </p>
      </div>

      <div className="panel p-8 space-y-8">

        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          This Disclaimer outlines the limitations and legal responsibilities associated
          with using Crucex. Please read it carefully before using the Service.
        </p>

        <Section num="01" title="Authorised Use Only">
          <p>
            Crucex is designed exclusively for use on systems and networks that you own, operate,
            or have obtained explicit written authorisation to test. The Web Security Scanner
            performs live HTTP requests and TCP port probes against a target — these are active
            network operations.
          </p>
          <p>
            <strong className="text-slate-700 dark:text-slate-300">Scanning a system without authorisation is a criminal offence</strong>{' '}
            in many jurisdictions, including but not limited to:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>The Computer Fraud and Abuse Act (CFAA) — United States</li>
            <li>The Computer Misuse Act 1990 — United Kingdom</li>
            <li>Directive on Attacks Against Information Systems — European Union</li>
            <li>Article 138ab of the Wetboek van Strafrecht — Netherlands</li>
          </ul>
          <p className="mt-2">
            You are solely responsible for ensuring that your use of this tool complies with
            all applicable laws and regulations in your jurisdiction.
          </p>
        </Section>

        <Section num="02" title="No Warranty on Scan Results">
          <p>
            Scan results provided by Crucex are for informational purposes only and should not
            be interpreted as a complete or certified security audit. Specifically:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>
              A high score (A or B grade) does not mean a website is fully secure. The scanner
              checks a defined subset of security headers and common ports only.
            </li>
            <li>
              A low score does not necessarily mean a website is actively vulnerable. Context,
              server configuration, and network topology affect the interpretation of results.
            </li>
            <li>
              Port scan results reflect the state at the time of the scan. Firewalls, load
              balancers, and CDNs may cause results to differ from the underlying infrastructure.
            </li>
            <li>
              Vulnerability findings are pattern-based heuristics, not confirmed exploits.
              False positives and false negatives are possible.
            </li>
          </ul>
          <p className="mt-2">
            For professional security assessments, engage a qualified penetration testing firm
            or certified security auditor.
          </p>
        </Section>

        <Section num="03" title="No Warranty on Password Analysis">
          <p>
            The Password Strength Analyser provides entropy calculations and pattern detection
            as a guide only. A "Very Strong" result does not guarantee that a password is
            uncrackable or that it has not been compromised through other means (phishing,
            keyloggers, data breaches, etc.).
          </p>
          <p>
            Crucex strongly recommends using a reputable password manager to generate and store
            unique, high-entropy passwords for each service.
          </p>
        </Section>

        <Section num="04" title="Limitation of Liability">
          <p>
            Crucex, its contributors, and maintainers shall not be liable for any damages,
            losses, or legal consequences — including civil penalties or criminal prosecution —
            arising from your use or misuse of the Service. This includes, without limitation:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Damages caused by reliance on scan results or vulnerability findings.</li>
            <li>Legal consequences arising from unauthorised scanning of third-party systems.</li>
            <li>Data loss, system damage, or security incidents related to your use.</li>
            <li>Inaccurate or incomplete analysis results.</li>
          </ul>
        </Section>

        <Section num="05" title="Educational and Research Intent">
          <p>
            Crucex was created as an educational project to help developers, students, and
            security researchers understand HTTP security headers, common port exposure risks,
            and password entropy. It is not a substitute for professional security services.
          </p>
          <p>
            The tool is provided in the spirit of the security community's tradition of open,
            responsible disclosure and education. Use it ethically and responsibly.
          </p>
        </Section>

        <Section num="06" title="Reporting Misuse">
          <p>
            If you become aware of misuse of this tool or have concerns about a scan targeting
            your systems, contact us at{' '}
            <a href="mailto:contact@crucex.dev" className="text-cyan-600 dark:text-cyan-400 hover:underline font-mono-cyber">
              contact@crucex.dev
            </a>. We take responsible use seriously.
          </p>
        </Section>

      </div>

      <div className="flex gap-4 text-xs font-mono-cyber text-slate-400">
        <Link to="/terms"   className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Terms of Service →</Link>
        <Link to="/privacy" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Privacy Policy →</Link>
      </div>
    </div>
  )
}
