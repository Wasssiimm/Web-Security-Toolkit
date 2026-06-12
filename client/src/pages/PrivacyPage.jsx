import { Link } from 'react-router-dom'

const LAST_UPDATED = 'May 2026'

function Section({ num, title, children }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-[#f2f2f2] flex items-baseline gap-3">
        <span className="font-mono-cyber text-xs text-lime-700 dark:text-lime-400 shrink-0">{num}</span>
        {title}
      </h2>
      <div className="text-sm text-gray-600 dark:text-[#888] leading-relaxed space-y-2 pl-7">
        {children}
      </div>
    </section>
  )
}

function PrivacyBadge({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono-cyber bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20">
      <span>✓</span> {children}
    </span>
  )
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-fade-up pb-16">

      {/* Header */}
      <div className="space-y-3">
        <p className="text-xs font-mono-cyber text-lime-700 dark:text-lime-400 tracking-widest uppercase">
          Legal / Privacy
        </p>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-[#f2f2f2]">Privacy Policy</h1>
        <p className="text-sm text-gray-600 dark:text-[#888] font-mono-cyber">
          Last updated: {LAST_UPDATED}
        </p>
        <div className="h-px bg-gradient-to-r from-cyan-400/50 via-fuchsia-500/30 to-transparent" />
      </div>

      {/* TL;DR strip */}
      <div className="panel p-5 flex flex-wrap gap-2 items-center">
        <span className="text-xs font-mono-cyber text-gray-600 dark:text-[#888] mr-2">TL;DR -</span>
        <PrivacyBadge>No personal data collected</PrivacyBadge>
        <PrivacyBadge>No cookies</PrivacyBadge>
        <PrivacyBadge>No analytics</PrivacyBadge>
        <PrivacyBadge>Passwords never transmitted</PrivacyBadge>
        <PrivacyBadge>Scans not stored</PrivacyBadge>
      </div>

      <div className="panel p-8 space-y-8">

        <p className="text-sm text-gray-600 dark:text-[#888] leading-relaxed">
          Crucex is designed from the ground up with privacy as a non-negotiable. This policy
          explains exactly what data is (and is not) collected when you use the Service.
        </p>

        <Section num="01" title="What We Do Not Collect">
          <p>Crucex collects no personal data. Specifically, we do not collect or store:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Your name, email address, or any identifying information.</li>
            <li>IP addresses or device identifiers.</li>
            <li>Browsing history or usage patterns.</li>
            <li>The passwords you enter into the Password Analyser.</li>
            <li>The URLs you submit for scanning.</li>
            <li>Scan results or generated reports.</li>
          </ul>
          <p className="mt-2">
            There are no user accounts, no sign-up flows, and no session tracking of any kind.
          </p>
        </Section>

        <Section num="02" title="Password Analysis - How Your Password Stays Private">
          <p>
            When you submit a password to the Password Analyser, the following happens entirely
            on your device or your local server instance - never on any third-party server:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 mt-2">
            <li>Your password is hashed using SHA-1 directly in your browser using the Web Crypto API.</li>
            <li>Only the first 5 characters of the resulting hash are sent to Have I Been Pwned (HIBP).</li>
            <li>HIBP returns all hashes in its database that share that 5-character prefix (typically ~500 results).</li>
            <li>Your browser checks locally whether your full hash appears in that list.</li>
            <li>The result is displayed to you. Your full hash and your original password never leave your device.</li>
          </ol>
          <p className="mt-2">
            This technique is called{' '}
            <strong className="text-gray-700 dark:text-[#ccc]">k-anonymity</strong>.
            It means the breach database learns only a 5-character hash prefix, which matches
            thousands of other hashes - it cannot determine which specific password you checked.
          </p>
          <p>
            Entropy analysis and pattern detection run entirely server-side on your own instance
            of the application. No password data is logged or persisted at any stage.
          </p>
        </Section>

        <Section num="03" title="Web Security Scanner - What Happens to Your Scan">
          <p>
            When you submit a URL for scanning, the service performs live HTTP requests and TCP
            port probes against that target. The results - headers, open ports, vulnerability
            findings, and scores - are returned to your browser session only.
          </p>
          <p>
            Scan results are <strong className="text-gray-700 dark:text-[#ccc]">not stored</strong> on any
            server. They exist only in your active browser session. When you close the tab or
            navigate away, the results are gone. Use the JSON export button if you wish to keep
            a copy.
          </p>
          <p>
            The service blocks scans against private IP ranges (10.x.x.x, 172.16-31.x.x,
            192.168.x.x, localhost) to prevent misuse against internal infrastructure.
          </p>
        </Section>

        <Section num="04" title="Cookies and Local Storage">
          <p>
            Crucex uses no tracking cookies and no analytics cookies. The only item stored
            in your browser's <code className="font-mono-cyber text-xs bg-slate-100 dark:bg-slate-800 px-1 rounded">localStorage</code> is your
            theme preference (dark or light mode). This value never leaves your device.
          </p>
        </Section>

        <Section num="05" title="No Analytics or Third-Party Trackers">
          <p>
            Crucex includes no analytics scripts, no advertising trackers, no session recording
            tools, and no third-party pixels of any kind. No data is shared with Google Analytics,
            Mixpanel, Hotjar, Meta, or any similar service.
          </p>
        </Section>

        <Section num="06" title="Third-Party Services">
          <p>
            The only external service Crucex communicates with is the{' '}
            <a href="https://haveibeenpwned.com" target="_blank" rel="noopener noreferrer"
               className="text-lime-700 dark:text-lime-400 hover:underline">Have I Been Pwned API</a>{' '}
            (via your local server instance), and only for the k-anonymity breach prefix lookup
            described in Section 02. HIBP's own{' '}
            <a href="https://haveibeenpwned.com/Privacy" target="_blank" rel="noopener noreferrer"
               className="text-lime-700 dark:text-lime-400 hover:underline">privacy policy</a>{' '}
            applies to that interaction.
          </p>
          <p>
            Google Fonts is used to load the interface typeface. This causes a DNS lookup to
            Google's servers. If you prefer to avoid this, you can self-host the fonts after
            cloning the repository.
          </p>
        </Section>

        <Section num="07" title="Self-Hosting">
          <p>
            Crucex is fully open-source and can be self-hosted. If you run your own instance,
            you control the server logs and infrastructure entirely. Review your web server
            configuration to ensure logs are handled in accordance with your own privacy requirements.
          </p>
        </Section>

        <Section num="08" title="Changes to This Policy">
          <p>
            If this policy is updated, the "Last updated" date above will change. We will not
            send notifications since we hold no contact information for users.
          </p>
        </Section>

        <Section num="09" title="Contact">
          <p>
            Questions or concerns about privacy?{' '}
            <a href="mailto:contact@crucex.dev" className="text-lime-700 dark:text-lime-400 hover:underline font-mono-cyber">
              contact@crucex.dev
            </a>
          </p>
        </Section>

      </div>

      <div className="flex gap-4 text-xs font-mono-cyber text-gray-500 dark:text-[#555]">
        <Link to="/terms"      className="hover:text-lime-700 dark:hover:text-lime-400 transition-colors">Terms of Service →</Link>
        <Link to="/disclaimer" className="hover:text-lime-700 dark:hover:text-lime-400 transition-colors">Disclaimer →</Link>
      </div>
    </div>
  )
}

