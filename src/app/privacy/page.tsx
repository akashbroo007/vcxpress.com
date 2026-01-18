import Link from 'next/link'

import LegalShell from '../shared/LegalShell'

export default function PrivacyPage() {
  const lastUpdated = 'January 14, 2026'

  return (
    <LegalShell
      title="Privacy Policy"
      description="We are committed to transparency and protecting your data. This Privacy Policy explains how we collect, use, and share information when you use VCXPRESS."
      lastUpdated={lastUpdated}
      contactEmail="contact@vcxpress.com"
      contactLabel="Email contact@vcxpress.com"
      contents={[
        {id: 'intro', label: 'Introduction'},
        {id: 'data-collection', label: 'Data We Collect'},
        {id: 'data-usage', label: 'How We Use Data'},
        {id: 'cookies', label: 'Cookies & Tracking'},
        {id: 'sharing', label: 'Sharing & Disclosures'},
        {id: 'ai-disclosure', label: 'AI Editing Disclosure'},
        {id: 'rights', label: 'Your Rights & Choices'},
        {id: 'contact', label: 'Contact'},
      ]}
    >
      <section className="scroll-mt-28 mb-5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark p-5" id="intro">
        <h2 className="text-2xl text-gray-900 dark:text-white mb-3">1. Introduction</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-7">
          This Privacy Policy describes how VCXPRESS collects, uses, discloses, and safeguards information when you use our website and related services.
        </p>
      </section>

      <section
        className="scroll-mt-28 mb-5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark p-5"
        id="data-collection"
      >
        <h2 className="text-2xl text-gray-900 dark:text-white mb-3">2. Data We Collect</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-7 mb-3">
          We may collect information you provide directly, as well as limited information collected automatically when you browse.
        </p>
        <ul className="text-gray-600 dark:text-gray-300">
          <li>Contact details you submit (e.g. name, email, message content)</li>
          <li>Newsletter/subscription inputs (where applicable)</li>
          <li>Device and log data (e.g. IP address, browser type, pages viewed, approximate location)</li>
          <li>Cookie preferences and consent status</li>
        </ul>
      </section>

      <section className="scroll-mt-28 mb-5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark p-5" id="data-usage">
        <h2 className="text-2xl text-gray-900 dark:text-white mb-3">3. How We Use Data</h2>
        <ul className="text-gray-600 dark:text-gray-300">
          <li>Provide, maintain, and secure the website</li>
          <li>Respond to editorial and support requests</li>
          <li>Analyze usage to improve reliability and user experience</li>
          <li>Enforce policies and prevent abuse</li>
        </ul>
      </section>

      <section className="scroll-mt-28 mb-5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark p-5" id="cookies">
        <h2 className="text-2xl text-gray-900 dark:text-white mb-3">4. Cookies &amp; Tracking</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-7">
          We use essential cookies for core functionality and optional cookies to understand performance. You can review details in our{' '}
          <Link href="/cookies">Cookie Policy</Link>.
        </p>
      </section>

      <section className="scroll-mt-28 mb-5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark p-5" id="sharing">
        <h2 className="text-2xl text-gray-900 dark:text-white mb-3">5. Sharing &amp; Disclosures</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-7 mb-3">
          We do not sell personal information. We may share limited information with trusted service providers who help us operate VCXPRESS, subject to appropriate safeguards.
        </p>
        <ul className="text-gray-600 dark:text-gray-300">
          <li>Service providers (under contractual obligations)</li>
          <li>Compliance with legal obligations</li>
          <li>Security and fraud prevention</li>
        </ul>
      </section>

      <section className="scroll-mt-28 mb-5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark p-5" id="ai-disclosure">
        <h2 className="text-2xl text-gray-900 dark:text-white mb-3">6. AI Editing Disclosure</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-7 mb-3">
          We used AI tools only to check grammar, spelling, and clarity of this content. The ideas and decisions are still made by people.
        </p>
        <p className="text-gray-600 dark:text-gray-300 leading-7">
          AI was not used to collect personal data, make decisions, or influence users. No personal user data was shared with any AI tools.
        </p>
      </section>

      <section className="scroll-mt-28 mb-5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark p-5" id="rights">
        <h2 className="text-2xl text-gray-900 dark:text-white mb-3">7. Your Rights &amp; Choices</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-7 mb-3">
          Depending on your location, you may have rights to access, correct, delete, or restrict processing of your personal information.
        </p>
        <ul className="text-gray-600 dark:text-gray-300">
          <li>Opt out of optional cookies via the cookie banner/settings</li>
          <li>Request access or deletion of personal data you submitted</li>
          <li>Withdraw consent where applicable</li>
        </ul>
      </section>

      <section className="scroll-mt-28 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark p-5" id="contact">
        <h2 className="text-2xl text-gray-900 dark:text-white mb-3">8. Contact</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-7">
          For privacy questions or requests, contact <a href="mailto:contact@vcxpress.com">contact@vcxpress.com</a> or use our{' '}
          <Link href="/contact">Contact</Link> page.
        </p>
      </section>
    </LegalShell>
  )
}
