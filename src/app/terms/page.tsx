import Link from 'next/link'

import LegalShell from '../shared/LegalShell'

export default function TermsPage() {
  const lastUpdated = 'January 14, 2026'

  return (
    <LegalShell
      title="Terms & Conditions"
      description="These Terms govern your access to and use of VCXPRESS. Please read them carefully before using the site."
      lastUpdated={lastUpdated}
      contactEmail="contact@vcxpress.com"
      contactLabel="Email contact@vcxpress.com"
      contents={[
        {id: 'acceptance', label: 'Acceptance of Terms'},
        {id: 'changes', label: 'Changes to Terms'},
        {id: 'content', label: 'Content & IP'},
        {id: 'acceptable-use', label: 'Acceptable Use'},
        {id: 'third-party', label: 'Third-Party Links'},
        {id: 'disclaimers', label: 'Disclaimers'},
        {id: 'liability', label: 'Limitation of Liability'},
        {id: 'termination', label: 'Termination'},
        {id: 'governing-law', label: 'Governing Law'},
        {id: 'contact', label: 'Contact'},
      ]}
    >
      <section className="scroll-mt-28 mb-5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark p-5" id="acceptance">
        <h2 className="text-2xl text-gray-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-7">
          By accessing or using VCXPRESS (the “Service”), you agree to these Terms and to comply with applicable laws and regulations.
        </p>
      </section>

      <section className="scroll-mt-28 mb-5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark p-5" id="changes">
        <h2 className="text-2xl text-gray-900 dark:text-white mb-3">2. Changes to the Service or Terms</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-7">
          We may modify the Service or these Terms from time to time. Continued use after changes become effective constitutes acceptance of the updated Terms.
        </p>
      </section>

      <section className="scroll-mt-28 mb-5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark p-5" id="content">
        <h2 className="text-2xl text-gray-900 dark:text-white mb-3">3. Content &amp; Intellectual Property</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-7 mb-3">
          All content on VCXPRESS is owned by VCXPRESS or its licensors and is protected by intellectual property laws.
        </p>
        <ul className="text-gray-600 dark:text-gray-300">
          <li>You may read and share links to our content for personal, non-commercial use.</li>
          <li>You may not copy, reproduce, republish, scrape at scale, or redistribute content without permission.</li>
          <li>You may not use our name or marks in a way that suggests endorsement.</li>
        </ul>
      </section>

      <section className="scroll-mt-28 mb-5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark p-5" id="acceptable-use">
        <h2 className="text-2xl text-gray-900 dark:text-white mb-3">4. Acceptable Use</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-7 mb-3">You agree not to:</p>
        <ul className="text-gray-600 dark:text-gray-300">
          <li>Interfere with or disrupt the Service or servers/networks connected to it</li>
          <li>Attempt unauthorized access to any part of the Service</li>
          <li>Use automated means to extract content at a harmful rate (scraping)</li>
          <li>Upload or transmit malware, spam, or harmful code</li>
          <li>Violate any law, regulation, or third-party right</li>
        </ul>
      </section>

      <section className="scroll-mt-28 mb-5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark p-5" id="third-party">
        <h2 className="text-2xl text-gray-900 dark:text-white mb-3">5. Third-Party Links</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-7">
          The Service may contain links to third-party websites. VCXPRESS is not responsible for the content, policies, or practices of third parties.
        </p>
      </section>

      <section className="scroll-mt-28 mb-5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark p-5" id="disclaimers">
        <h2 className="text-2xl text-gray-900 dark:text-white mb-3">6. Disclaimers</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-7">
          VCXPRESS content is provided for informational purposes only and does not constitute investment, legal, accounting, or professional advice. The Service is provided “as is” and “as available”.
        </p>
      </section>

      <section className="scroll-mt-28 mb-5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark p-5" id="liability">
        <h2 className="text-2xl text-gray-900 dark:text-white mb-3">7. Limitation of Liability</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-7">
          To the maximum extent permitted by law, VCXPRESS will not be liable for indirect, incidental, special, consequential, or punitive damages, or any loss of profits, revenues, data, or goodwill.
        </p>
      </section>

      <section className="scroll-mt-28 mb-5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark p-5" id="termination">
        <h2 className="text-2xl text-gray-900 dark:text-white mb-3">8. Termination</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-7">
          We may suspend or terminate access to the Service if we reasonably believe you have violated these Terms or are using the Service in a way that could create risk or legal exposure.
        </p>
      </section>

      <section className="scroll-mt-28 mb-5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark p-5" id="governing-law">
        <h2 className="text-2xl text-gray-900 dark:text-white mb-3">9. Governing Law</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-7">
          These Terms are governed by applicable laws in your jurisdiction, without regard to conflict of law principles.
        </p>
      </section>

      <section className="scroll-mt-28 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark p-5" id="contact">
        <h2 className="text-2xl text-gray-900 dark:text-white mb-3">10. Contact</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-7">
          For questions about these Terms, contact <a href="mailto:contact@vcxpress.com">contact@vcxpress.com</a> or use our{' '}
          <Link href="/contact">Contact</Link> page.
        </p>
      </section>
    </LegalShell>
  )
}
