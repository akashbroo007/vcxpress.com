import Link from 'next/link'

export default function HelpCenterPage() {
  return (
    <main className="bg-background-light dark:bg-background-dark text-text-main dark:text-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <section className="border-b border-[#e7ebf3] dark:border-gray-800 pb-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <div className="h-px w-8 bg-primary"></div>
                <span className="text-primary text-xs font-bold tracking-widest uppercase font-mono">Support</span>
              </div>
              <h1 className="mt-4 font-serif text-4xl sm:text-5xl font-black tracking-tight">Help Center</h1>
              <p className="mt-4 text-base sm:text-lg text-text-subtle dark:text-gray-300 leading-relaxed">
                Find answers fast—subscriptions, account access, editorial standards, and how to contact the VCXPRESS newsroom.
              </p>
            </div>

            <div className="w-full lg:w-[420px]">
              <div className="flex items-center h-11 w-full bg-surface-light dark:bg-surface-dark rounded border border-[#e7ebf3] dark:border-gray-800 focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/30 transition-all">
                <span className="material-symbols-outlined text-text-subtle dark:text-gray-400 pl-3">search</span>
                <input
                  className="bg-transparent border-none text-sm w-full focus:ring-0 text-text-main dark:text-white placeholder:text-text-subtle/80 dark:placeholder:text-gray-500 px-3"
                  placeholder="Search the Help Center"
                  type="text"
                />
              </div>
              <p className="mt-2 text-xs text-text-subtle dark:text-gray-500 font-mono">
                Tip: try “billing”, “newsletter”, or “contact”.
              </p>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <h2 className="font-serif text-2xl font-bold tracking-tight">Frequently asked questions</h2>
              <p className="mt-2 text-sm text-text-subtle dark:text-gray-400 leading-relaxed">
                These are the most common questions we receive. If you still need help, use the contact options below.
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-lg border border-[#e7ebf3] dark:border-gray-800 bg-surface-light dark:bg-surface-dark p-5">
                  <h3 className="font-bold text-text-main dark:text-white">How do I subscribe?</h3>
                  <p className="mt-2 text-sm text-text-subtle dark:text-gray-300 leading-relaxed">
                    Tap the <span className="font-bold text-text-main dark:text-white">Subscribe</span> button in the navigation bar. We’ll guide you through plan selection and email confirmation.
                  </p>
                </div>

                <div className="rounded-lg border border-[#e7ebf3] dark:border-gray-800 bg-surface-light dark:bg-surface-dark p-5">
                  <h3 className="font-bold text-text-main dark:text-white">I’m not receiving the Daily Briefing email—what should I do?</h3>
                  <p className="mt-2 text-sm text-text-subtle dark:text-gray-300 leading-relaxed">
                    Check spam and promotions folders. Then add <span className="font-mono">contact@vcxpress.com</span> to your allowlist. If the problem persists, contact us with your email address and we’ll verify delivery.
                  </p>
                </div>

                <div className="rounded-lg border border-[#e7ebf3] dark:border-gray-800 bg-surface-light dark:bg-surface-dark p-5">
                  <h3 className="font-bold text-text-main dark:text-white">How do I report an error or request a correction?</h3>
                  <p className="mt-2 text-sm text-text-subtle dark:text-gray-300 leading-relaxed">
                    Use the Contact page and choose “Correction”. Include the article link, the issue, and supporting sources if available.
                  </p>
                </div>

                <div className="rounded-lg border border-[#e7ebf3] dark:border-gray-800 bg-surface-light dark:bg-surface-dark p-5">
                  <h3 className="font-bold text-text-main dark:text-white">Can I submit a news tip?</h3>
                  <p className="mt-2 text-sm text-text-subtle dark:text-gray-300 leading-relaxed">
                    Yes. Share details via the Contact page. If you need anonymity, avoid including identifying information and use a personal email.
                  </p>
                </div>

                <div className="rounded-lg border border-[#e7ebf3] dark:border-gray-800 bg-surface-light dark:bg-surface-dark p-5">
                  <h3 className="font-bold text-text-main dark:text-white">How do cookies and privacy work?</h3>
                  <p className="mt-2 text-sm text-text-subtle dark:text-gray-300 leading-relaxed">
                    Review our policies for details on tracking and data use.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <Link className="text-xs font-mono uppercase tracking-wider text-primary hover:underline" href="/privacy">
                      Privacy
                    </Link>
                    <Link className="text-xs font-mono uppercase tracking-wider text-primary hover:underline" href="/cookies">
                      Cookies
                    </Link>
                    <Link className="text-xs font-mono uppercase tracking-wider text-primary hover:underline" href="/terms">
                      Terms
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <aside className="lg:col-span-4">
              <div className="rounded-xl border border-[#e7ebf3] dark:border-gray-800 bg-surface-light dark:bg-surface-dark p-6">
                <h3 className="font-bold text-text-main dark:text-white">Quick actions</h3>
                <div className="mt-4 flex flex-col gap-3">
                  <Link className="flex items-center justify-between rounded-lg border border-[#e7ebf3] dark:border-gray-800 px-4 py-3 hover:border-primary/50 transition-colors" href="/contact">
                    <span className="text-sm font-semibold">Contact Editorial Team</span>
                    <span className="material-symbols-outlined text-[18px] text-text-subtle">arrow_forward</span>
                  </Link>
                  <Link className="flex items-center justify-between rounded-lg border border-[#e7ebf3] dark:border-gray-800 px-4 py-3 hover:border-primary/50 transition-colors" href="/news">
                    <span className="text-sm font-semibold">Browse latest news</span>
                    <span className="material-symbols-outlined text-[18px] text-text-subtle">arrow_forward</span>
                  </Link>
                  <Link className="flex items-center justify-between rounded-lg border border-[#e7ebf3] dark:border-gray-800 px-4 py-3 hover:border-primary/50 transition-colors" href="/sitemap">
                    <span className="text-sm font-semibold">View sitemap</span>
                    <span className="material-symbols-outlined text-[18px] text-text-subtle">arrow_forward</span>
                  </Link>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-primary/15 bg-primary/5 p-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">mail</span>
                  <h3 className="font-bold text-text-main dark:text-white">Need help now?</h3>
                </div>
                <p className="mt-3 text-sm text-text-subtle dark:text-gray-300 leading-relaxed">
                  For support requests, include a clear subject and the page URL.
                </p>
                <a
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                  href="mailto:contact@vcxpress.com"
                >
                  Email contact@vcxpress.com
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </a>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  )
}
