import Link from 'next/link'

type Props = {
  activeTab: 'privacy' | 'terms'
}

export default function PrivacyTermsShell({activeTab}: Props) {
  const isPrivacy = activeTab === 'privacy'
  const lastUpdated = 'January 14, 2026'

  return (
    <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <aside className="lg:col-span-3 hidden lg:block">
              <div className="sticky top-24">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Contents</h3>
                <nav aria-label="Sidebar" className="space-y-1">
                  {isPrivacy ? (
                    <>
                      <a className="group flex items-center border-l-2 border-primary py-2 pl-3 text-sm font-medium text-primary bg-primary/5 rounded-r" href="#intro">
                        1. Introduction
                      </a>
                      <a className="group flex items-center border-l-2 border-transparent py-2 pl-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:white" href="#data-collection">
                        2. Data We Collect
                      </a>
                      <a className="group flex items-center border-l-2 border-transparent py-2 pl-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:white" href="#data-usage">
                        3. How We Use Data
                      </a>
                      <a className="group flex items-center border-l-2 border-transparent py-2 pl-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:white" href="#cookies">
                        4. Cookies &amp; Tracking
                      </a>
                      <a className="group flex items-center border-l-2 border-transparent py-2 pl-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:white" href="#sharing">
                        5. Sharing &amp; Disclosures
                      </a>
                      <a className="group flex items-center border-l-2 border-transparent py-2 pl-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:white" href="#rights">
                        6. Your Rights &amp; Choices
                      </a>
                      <a className="group flex items-center border-l-2 border-transparent py-2 pl-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:white" href="#contact">
                        7. Contact Us
                      </a>
                    </>
                  ) : (
                    <>
                      <a className="group flex items-center border-l-2 border-primary py-2 pl-3 text-sm font-medium text-primary bg-primary/5 rounded-r" href="#terms-intro">
                        1. Overview
                      </a>
                      <a className="group flex items-center border-l-2 border-transparent py-2 pl-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:white" href="#eligibility">
                        2. Eligibility
                      </a>
                      <a className="group flex items-center border-l-2 border-transparent py-2 pl-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:white" href="#accounts">
                        3. Accounts
                      </a>
                      <a className="group flex items-center border-l-2 border-transparent py-2 pl-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:white" href="#content">
                        4. Content &amp; IP
                      </a>
                      <a className="group flex items-center border-l-2 border-transparent py-2 pl-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:white" href="#acceptable-use">
                        5. Acceptable Use
                      </a>
                      <a className="group flex items-center border-l-2 border-transparent py-2 pl-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:white" href="#disclaimers">
                        6. Disclaimers
                      </a>
                      <a className="group flex items-center border-l-2 border-transparent py-2 pl-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:white" href="#limitations">
                        7. Liability
                      </a>
                      <a className="group flex items-center border-l-2 border-transparent py-2 pl-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:white" href="#terms-contact">
                        8. Contact
                      </a>
                    </>
                  )}
                </nav>
                <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Have specific questions?</p>
                  <a
                    className="text-sm font-bold text-primary hover:underline"
                    href="mailto:contact@vcxpress.com"
                  >
                    Email contact@vcxpress.com →
                  </a>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-9">
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 p-6 md:p-10 mb-8 shadow-sm">
                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
                  <Link
                    className={
                      isPrivacy
                        ? 'relative pb-4 px-4 text-sm font-bold text-primary border-b-2 border-primary -mb-px'
                        : 'relative pb-4 px-4 text-sm font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border-b-2 border-transparent hover:border-gray-300 -mb-px transition-colors'
                    }
                    href="/privacy"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    className={
                      !isPrivacy
                        ? 'relative pb-4 px-4 text-sm font-bold text-primary border-b-2 border-primary -mb-px'
                        : 'relative pb-4 px-4 text-sm font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border-b-2 border-transparent hover:border-gray-300 -mb-px transition-colors'
                    }
                    href="/terms"
                  >
                    Terms of Service
                  </Link>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="max-w-2xl">
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
                      {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
                    </h1>
                    <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                      {isPrivacy
                        ? 'We are committed to transparency and protecting your data. This Privacy Policy explains how we collect, use, and share information when you use VCXPRESS.'
                        : 'These Terms of Service govern your use of VCXPRESS. By accessing or using the site, you agree to these Terms.'}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-medium text-gray-500 dark:text-gray-400">
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                      Last updated: {lastUpdated}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button aria-label="Print Policy" className="flex items-center gap-2 px-3 py-2 bg-background-light dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-200 transition-colors" type="button">
                      <span className="material-symbols-outlined text-[20px]">print</span>
                      <span className="text-sm font-medium hidden sm:inline">Print</span>
                    </button>
                    <button aria-label="Download PDF" className="flex items-center gap-2 px-3 py-2 bg-background-light dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-200 transition-colors" type="button">
                      <span className="material-symbols-outlined text-[20px]">download</span>
                      <span className="text-sm font-medium hidden sm:inline">PDF</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 p-6 md:p-10 shadow-sm">
                <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-li:my-1">
                  {isPrivacy ? (
                    <>
                      <section className="scroll-mt-28 mb-12" id="intro">
                        <h2 className="text-2xl text-gray-900 dark:text-white mb-4">1. Introduction</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-7 mb-4">
                          At VCXPRESS, your privacy is a priority. This Privacy Policy describes how we collect, use, disclose, and safeguard information when you visit our website and use our services.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 leading-7">
                          By accessing or using VCXPRESS, you consent to the practices described in this Policy. If you do not agree, please discontinue use of the services.
                        </p>
                      </section>

                      <section className="scroll-mt-28 mb-12" id="data-collection">
                        <h2 className="text-2xl text-gray-900 dark:text-white mb-4">2. Data We Collect</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-7 mb-4">
                          We may collect information you provide directly (for example, when you contact us), as well as limited information collected automatically when you browse.
                        </p>
                        <ul className="text-gray-600 dark:text-gray-300">
                          <li>Contact details you submit (e.g. name, email, message content)</li>
                          <li>Newsletter/subscription inputs (where applicable)</li>
                          <li>Device and log data (e.g. IP address, browser type, pages viewed, approximate location)</li>
                          <li>Cookie preferences and consent status</li>
                        </ul>
                      </section>

                      <section className="scroll-mt-28 mb-12" id="data-usage">
                        <h2 className="text-2xl text-gray-900 dark:text-white mb-4">3. How We Use Data</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-7 mb-4">
                          We use information to operate and improve VCXPRESS, respond to inquiries, maintain security, and measure site performance.
                        </p>
                        <ul className="text-gray-600 dark:text-gray-300">
                          <li>Provide, maintain, and secure the website</li>
                          <li>Respond to editorial and support requests</li>
                          <li>Analyze usage to improve reliability and user experience</li>
                          <li>Enforce policies and prevent abuse</li>
                        </ul>
                      </section>

                      <section className="scroll-mt-28 mb-12" id="cookies">
                        <h2 className="text-2xl text-gray-900 dark:text-white mb-4">4. Cookies &amp; Tracking</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-7 mb-4">
                          We use essential cookies for core functionality and optional cookies to understand performance. You can review details in our Cookie Policy.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 leading-7">
                          <a href="/cookies">Read the Cookie Policy</a>
                        </p>
                      </section>

                      <section className="scroll-mt-28 mb-12" id="sharing">
                        <h2 className="text-2xl text-gray-900 dark:text-white mb-4">5. Sharing &amp; Disclosures</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-7 mb-4">
                          We do not sell personal information. We may share limited information with trusted service providers who help us operate the website (for example, hosting and analytics), subject to appropriate safeguards.
                        </p>
                        <ul className="text-gray-600 dark:text-gray-300">
                          <li>Service providers (under contractual obligations)</li>
                          <li>Compliance with legal obligations</li>
                          <li>Security and fraud prevention</li>
                        </ul>
                      </section>

                      <section className="scroll-mt-28 mb-12" id="rights">
                        <h2 className="text-2xl text-gray-900 dark:text-white mb-4">6. Your Rights &amp; Choices</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-7 mb-4">
                          Depending on your location, you may have rights to access, correct, delete, or restrict processing of your personal information.
                        </p>
                        <ul className="text-gray-600 dark:text-gray-300">
                          <li>Opt out of optional cookies via the cookie banner/settings</li>
                          <li>Request access or deletion of personal data you submitted</li>
                          <li>Withdraw consent where applicable</li>
                        </ul>
                      </section>

                      <section className="scroll-mt-28" id="contact">
                        <h2 className="text-2xl text-gray-900 dark:text-white mb-4">7. Contact Us</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-7">
                          For privacy questions or requests, contact <a href="mailto:contact@vcxpress.com">contact@vcxpress.com</a>.
                        </p>
                      </section>
                    </>
                  ) : (
                    <>
                      <section className="scroll-mt-28 mb-12" id="terms-intro">
                        <h2 className="text-2xl text-gray-900 dark:text-white mb-4">1. Overview</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-7 mb-4">
                          These Terms of Service (&quot;Terms&quot;) govern your access to and use of VCXPRESS (the &quot;Service&quot;). By using the Service, you agree to be bound by these Terms.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 leading-7">
                          If you do not agree to these Terms, you may not use the Service.
                        </p>
                      </section>

                      <section className="scroll-mt-28 mb-12" id="eligibility">
                        <h2 className="text-2xl text-gray-900 dark:text-white mb-4">2. Eligibility</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-7">
                          You must be able to form a legally binding contract in your jurisdiction to use the Service. If you are using the Service on behalf of an organization, you represent you have authority to bind that organization.
                        </p>
                      </section>

                      <section className="scroll-mt-28 mb-12" id="accounts">
                        <h2 className="text-2xl text-gray-900 dark:text-white mb-4">3. Accounts</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-7 mb-4">
                          Some features may require you to provide contact information or subscribe. You are responsible for maintaining the confidentiality of any account access and for activities under your account.
                        </p>
                        <ul className="text-gray-600 dark:text-gray-300">
                          <li>Provide accurate information</li>
                          <li>Do not share credentials in a way that compromises security</li>
                          <li>Notify us of unauthorized use</li>
                        </ul>
                      </section>

                      <section className="scroll-mt-28 mb-12" id="content">
                        <h2 className="text-2xl text-gray-900 dark:text-white mb-4">4. Content &amp; Intellectual Property</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-7 mb-4">
                          All content on VCXPRESS, including articles, design, logos, and trademarks, is owned by VCXPRESS or its licensors and is protected by applicable laws.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 leading-7">
                          You may not copy, reproduce, distribute, create derivative works, or exploit content except as permitted by law or with written permission.
                        </p>
                      </section>

                      <section className="scroll-mt-28 mb-12" id="acceptable-use">
                        <h2 className="text-2xl text-gray-900 dark:text-white mb-4">5. Acceptable Use</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-7 mb-4">
                          You agree not to misuse the Service. This includes:
                        </p>
                        <ul className="text-gray-600 dark:text-gray-300">
                          <li>Attempting unauthorized access or disrupting site operations</li>
                          <li>Scraping content at scale or bypassing access controls</li>
                          <li>Using the Service to distribute malware, spam, or harmful content</li>
                          <li>Violating applicable laws or third-party rights</li>
                        </ul>
                      </section>

                      <section className="scroll-mt-28 mb-12" id="disclaimers">
                        <h2 className="text-2xl text-gray-900 dark:text-white mb-4">6. Disclaimers</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-7">
                          VCXPRESS content is provided for informational purposes only and does not constitute financial, investment, legal, or professional advice. The Service is provided “as is” and “as available”.
                        </p>
                      </section>

                      <section className="scroll-mt-28 mb-12" id="limitations">
                        <h2 className="text-2xl text-gray-900 dark:text-white mb-4">7. Limitation of Liability</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-7">
                          To the fullest extent permitted by law, VCXPRESS will not be liable for indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
                        </p>
                      </section>

                      <section className="scroll-mt-28" id="terms-contact">
                        <h2 className="text-2xl text-gray-900 dark:text-white mb-4">8. Contact</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-7">
                          For questions about these Terms, contact <a href="mailto:contact@vcxpress.com">contact@vcxpress.com</a>.
                        </p>
                      </section>
                    </>
                  )}
                </article>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
