export default function CookiesPage() {
  return (
    <main className="bg-background-light dark:bg-background-dark text-text-main dark:text-white">
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <section className="border-b border-[#e7ebf3] dark:border-gray-800 pb-10">
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-primary"></div>
            <span className="text-primary text-xs font-bold tracking-widest uppercase font-mono">Policy</span>
          </div>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl font-black tracking-tight">Cookie Policy</h1>
          <p className="mt-4 text-base sm:text-lg text-text-subtle dark:text-gray-300 leading-relaxed max-w-3xl">
            VCXPRESS uses cookies and similar technologies to operate the site, keep it secure, and improve performance.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a className="text-xs font-mono uppercase tracking-widest text-primary hover:underline" href="/privacy">
              Privacy
            </a>
            <a className="text-xs font-mono uppercase tracking-widest text-primary hover:underline" href="/terms">
              Terms
            </a>
          </div>
        </section>

        <section className="py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <article className="lg:col-span-8 space-y-8">
              <div>
                <h2 className="font-serif text-2xl font-bold tracking-tight">What are cookies?</h2>
                <p className="mt-3 text-sm sm:text-base text-text-subtle dark:text-gray-300 leading-relaxed">
                  Cookies are small text files stored on your device. They help websites remember information about your visit—like your preferences, session state, and whether you’ve already accepted cookie settings.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold tracking-tight">How we use cookies</h2>
                <p className="mt-3 text-sm sm:text-base text-text-subtle dark:text-gray-300 leading-relaxed">
                  We use cookies in the following categories. Some are essential and cannot be disabled because they’re required for the site to function.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-[#e7ebf3] dark:border-gray-800 bg-surface-light dark:bg-surface-dark p-6">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <h3 className="font-bold">Essential cookies</h3>
                      <p className="mt-2 text-sm text-text-subtle dark:text-gray-300 leading-relaxed">
                        Needed to provide core functionality such as page navigation, security, and load balancing.
                      </p>
                    </div>
                    <span className="text-xs font-mono uppercase tracking-widest text-white/70 rounded bg-white/10 px-2 py-1">Always on</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-text-subtle dark:text-gray-300">
                    <li className="flex gap-2"><span className="text-primary">•</span>Remember cookie consent choice</li>
                    <li className="flex gap-2"><span className="text-primary">•</span>Prevent fraudulent or malicious activity</li>
                    <li className="flex gap-2"><span className="text-primary">•</span>Maintain session stability</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-[#e7ebf3] dark:border-gray-800 bg-surface-light dark:bg-surface-dark p-6">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <h3 className="font-bold">Performance &amp; analytics cookies</h3>
                      <p className="mt-2 text-sm text-text-subtle dark:text-gray-300 leading-relaxed">
                        Help us understand how the site is used (e.g. pages visited, errors) so we can improve speed and usability.
                      </p>
                    </div>
                    <span className="text-xs font-mono uppercase tracking-widest text-text-subtle dark:text-gray-300 rounded border border-[#e7ebf3] dark:border-gray-800 px-2 py-1">
                      Optional
                    </span>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-text-subtle dark:text-gray-300">
                    <li className="flex gap-2"><span className="text-primary">•</span>Measure page performance</li>
                    <li className="flex gap-2"><span className="text-primary">•</span>Detect broken experiences</li>
                    <li className="flex gap-2"><span className="text-primary">•</span>Improve navigation and readability</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-[#e7ebf3] dark:border-gray-800 bg-surface-light dark:bg-surface-dark p-6">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <h3 className="font-bold">Preference cookies</h3>
                      <p className="mt-2 text-sm text-text-subtle dark:text-gray-300 leading-relaxed">
                        Remember settings like display preferences, so the site feels consistent between visits.
                      </p>
                    </div>
                    <span className="text-xs font-mono uppercase tracking-widest text-text-subtle dark:text-gray-300 rounded border border-[#e7ebf3] dark:border-gray-800 px-2 py-1">
                      Optional
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold tracking-tight">Managing your preferences</h2>
                <p className="mt-3 text-sm sm:text-base text-text-subtle dark:text-gray-300 leading-relaxed">
                  You can accept or reject optional cookies using the cookie popup. You can also clear cookies through your browser settings at any time.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold tracking-tight">Updates to this policy</h2>
                <p className="mt-3 text-sm sm:text-base text-text-subtle dark:text-gray-300 leading-relaxed">
                  We may update this Cookie Policy to reflect changes to the site or legal requirements. Updates will be posted on this page.
                </p>
              </div>
            </article>

            <aside className="lg:col-span-4">
              <div className="rounded-xl border border-primary/15 bg-primary/5 p-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">shield</span>
                  <h3 className="font-bold text-text-main dark:text-white">Cookie choices</h3>
                </div>
                <p className="mt-3 text-sm text-text-subtle dark:text-gray-300 leading-relaxed">
                  The site will work with essential cookies only. Optional cookies help us improve performance.
                </p>
                <div className="mt-5 rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark text-text-main dark:text-white p-4 transition-colors duration-300 ease-in-out">
                  <p className="text-xs text-text-main/70 dark:text-white/70 leading-relaxed transition-colors duration-300 ease-in-out">
                    To change your choice, open the cookie popup again by clearing your browser storage for this site.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-[#e7ebf3] dark:border-gray-800 bg-surface-light dark:bg-surface-dark p-6">
                <h3 className="font-bold">Questions?</h3>
                <p className="mt-2 text-sm text-text-subtle dark:text-gray-300 leading-relaxed">
                  Contact us for privacy-related questions or requests.
                </p>
                <a className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline" href="/contact">
                  Contact
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
