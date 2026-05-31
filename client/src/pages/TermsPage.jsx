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

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-fade-up pb-16">

      {/* Header */}
      <div className="space-y-3">
        <p className="text-xs font-mono-cyber text-lime-700 dark:text-lime-400 tracking-widest uppercase">
          Legal / Terms
        </p>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-[#f2f2f2]">Terms of Service</h1>
        <p className="text-sm text-gray-600 dark:text-[#888] font-mono-cyber">
          Last updated: {LAST_UPDATED}
        </p>
        <div className="h-px bg-gradient-to-r from-cyan-400/50 via-fuchsia-500/30 to-transparent" />
      </div>

      <div className="panel p-8 space-y-8">

        <p className="text-sm text-gray-600 dark:text-[#888] leading-relaxed">
          By accessing or using Crucex ("the Service"), you agree to be bound by these Terms of Service.
          If you do not agree with any part of these terms, you may not use the Service.
          Crucex is provided as an open-source project for educational and security-research purposes.
        </p>

        <Section num="01" title="Description of Service">
          <p>
            Crucex provides two tools: a Web Security Scanner that analyses public websites for HTTP
            security header configuration, open ports, and vulnerability patterns; and a Password
            Strength Analyser that evaluates password entropy and checks against known breach databases
            using a privacy-preserving k-anonymity model.
          </p>
          <p>
            The Service is provided free of charge. The source code is available under the MIT
            License.
          </p>
        </Section>

        <Section num="02" title="Permitted Use">
          <p>You may use the Service only for lawful purposes. Permitted uses include:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Scanning websites and systems that you own or operate.</li>
            <li>Scanning websites for which you have explicit written permission from the owner.</li>
            <li>Evaluating the strength of passwords you intend to use or manage.</li>
            <li>Security research and educational activities on systems you are authorised to test.</li>
            <li>Penetration testing engagements where written authorisation has been obtained.</li>
          </ul>
        </Section>

        <Section num="03" title="Prohibited Use">
          <p>
            You must not use the Service to scan, probe, or test any system without explicit
            authorisation from the system owner. Specifically, you may not:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Scan websites, servers, or IP addresses you do not own or have no authorisation to test.</li>
            <li>Use the Service to facilitate, support, or conduct any illegal activity.</li>
            <li>Attempt to circumvent private-IP blocking protections built into the Service.</li>
            <li>Use scan results to exploit, attack, or compromise third-party systems.</li>
            <li>Resell, redistribute, or misrepresent scan results as professional security audits.</li>
          </ul>
          <p className="mt-2">
            Unauthorised scanning may violate the Computer Fraud and Abuse Act (CFAA), the EU
            Network and Information Security Directive, or equivalent laws in your jurisdiction.
            You bear sole responsibility for ensuring your use complies with all applicable laws.
          </p>
        </Section>

        <Section num="04" title="Disclaimer of Warranties">
          <p>
            The Service is provided <strong className="text-gray-700 dark:text-[#ccc]">"as is"</strong> and{' '}
            <strong className="text-gray-700 dark:text-[#ccc]">"as available"</strong> without any warranty of any kind,
            express or implied, including but not limited to warranties of merchantability, fitness
            for a particular purpose, or non-infringement.
          </p>
          <p>
            Crucex does not warrant that the Service will be uninterrupted, error-free, or that
            scan results are complete, accurate, or current. Security headers, open ports, and
            vulnerability data reflect the state of the target at the time of the scan only.
            A passing score does not guarantee that a website is secure.
          </p>
        </Section>

        <Section num="05" title="Limitation of Liability">
          <p>
            To the maximum extent permitted by applicable law, Crucex and its contributors shall
            not be liable for any direct, indirect, incidental, special, consequential, or punitive
            damages arising out of your access to or use of (or inability to use) the Service,
            including but not limited to:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Damages resulting from reliance on scan results or security assessments.</li>
            <li>Damages resulting from unauthorised use of the Service by you or a third party.</li>
            <li>Any security breach, data loss, or system compromise related to your use.</li>
          </ul>
        </Section>

        <Section num="06" title="Intellectual Property">
          <p>
            Crucex is released under the{' '}
            <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer"
               className="text-lime-700 dark:text-lime-400 hover:underline">MIT License</a>.
            You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
            copies of the software, subject to the conditions in the MIT License.
          </p>
          <p>
            The Crucex name, logo, and brand identity are not covered by the MIT License and may
            not be used to imply endorsement without prior written permission.
          </p>
        </Section>

        <Section num="07" title="Third-Party Services">
          <p>
            The Password Analyser uses the{' '}
            <a href="https://haveibeenpwned.com/API/v3" target="_blank" rel="noopener noreferrer"
               className="text-lime-700 dark:text-lime-400 hover:underline">Have I Been Pwned (HIBP) API</a>{' '}
            for breach checking. Only the first 5 characters of a password's SHA-1 hash are
            transmitted to HIBP. Your use of this feature is also subject to{' '}
            <a href="https://haveibeenpwned.com/API/v3" target="_blank" rel="noopener noreferrer"
               className="text-lime-700 dark:text-lime-400 hover:underline">HIBP's terms</a>.
          </p>
        </Section>

        <Section num="08" title="Changes to These Terms">
          <p>
            We reserve the right to update these Terms at any time. Continued use of the Service
            after changes are posted constitutes acceptance of the updated Terms.
            The "Last updated" date at the top of this page indicates when changes were last made.
          </p>
        </Section>

        <Section num="09" title="Contact">
          <p>
            Questions about these Terms?{' '}
            <a href="mailto:contact@crucex.dev" className="text-lime-700 dark:text-lime-400 hover:underline font-mono-cyber">
              contact@crucex.dev
            </a>
          </p>
        </Section>

      </div>

      <div className="flex gap-4 text-xs font-mono-cyber text-gray-500 dark:text-[#555]">
        <Link to="/privacy"    className="hover:text-lime-700 dark:hover:text-lime-400 transition-colors">Privacy Policy →</Link>
        <Link to="/disclaimer" className="hover:text-lime-700 dark:hover:text-lime-400 transition-colors">Disclaimer →</Link>
      </div>
    </div>
  )
}
