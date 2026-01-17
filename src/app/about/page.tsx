import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-[#0d121b] dark:text-white font-display antialiased overflow-x-hidden transition-colors duration-200">
      <div className="relative flex flex-col min-h-screen w-full group/design-root">
        <main className="flex flex-col items-center w-full grow">
          <section className="w-full max-w-[960px] px-6 sm:px-10 py-16 sm:py-24">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2">
                <div className="h-px w-8 bg-primary"></div>
                <span className="text-primary text-sm font-bold tracking-widest uppercase">Established 2026</span>
              </div>
              <h1 className="text-slate-900 dark:text-white text-5xl sm:text-6xl md:text-7xl font-black leading-[0.95] tracking-tighter">
                About <br /> VCXpress
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg sm:text-xl md:text-2xl font-normal leading-relaxed max-w-[720px] mt-2">
                The definitive source for modern business intelligence. VCXpress provides unbiased, deep-dive analysis for decision-makers in finance, technology, and global markets.
              </p>
            </div>
          </section>

          <section className="w-full bg-surface-light dark:bg-surface-dark border-y border-slate-200 dark:border-slate-800">
            <div className="max-w-[960px] mx-auto px-6 sm:px-10 py-16 sm:py-20">
              <div className="flex flex-col md:flex-row gap-10 md:gap-20 items-start">
                <div className="flex-1">
                  <h2 className="text-slate-900 dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-tight mb-6">
                    Our Mission
                  </h2>
                  <div className="w-12 h-1.5 bg-primary rounded mb-6"></div>
                </div>
                <div className="flex-[2]">
                  <p className="text-slate-800 dark:text-slate-200 text-lg sm:text-xl font-normal leading-relaxed mb-6">
                    In an age of noise, VCXpress is committed to clarity. To empower professionals with the truth, untainted by corporate influence or algorithmic bias.
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-relaxed">
                    We believe that accurate information is the lifeblood of a functioning economy. Our journalists follow the data wherever it leads, prioritizing depth over clicks and substance over sensation.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full max-w-[960px] px-6 sm:px-10 py-16 sm:py-20">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-2">
                <h2 className="text-slate-900 dark:text-white text-2xl sm:text-3xl font-bold leading-tight tracking-tight">
                  Trust &amp; Editorial Standards
                </h2>
                <p className="text-slate-500 dark:text-slate-400">The VCXpress code of ethics is the foundation of our reporting.</p>
              </div>
              <div className="flex flex-col gap-4">
                <details
                  className="group flex flex-col rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark overflow-hidden transition-all duration-300"
                  open
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-6 p-5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors select-none">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-[20px]">verified_user</span>
                      </div>
                      <p className="text-slate-900 dark:text-white text-base font-bold leading-normal">Independence &amp; Ownership</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 transition-transform duration-300 group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <div className="px-5 pb-5 pl-[4.5rem] pr-10">
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      VCXpress is fully reader-supported and retains full editorial control, free from corporate influence, sponsorships, or pay-for-play arrangements. Our loyalty is to the truth and to our subscribers alone.
                    </p>
                  </div>
                </details>

                <details className="group flex flex-col rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark overflow-hidden transition-all duration-300">
                  <summary className="flex cursor-pointer items-center justify-between gap-6 p-5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors select-none">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-[20px]">fact_check</span>
                      </div>
                      <p className="text-slate-900 dark:text-white text-base font-bold leading-normal">Verification &amp; Fact-Checking</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 transition-transform duration-300 group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <div className="px-5 pb-5 pl-[4.5rem] pr-10">
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      Every VCXpress story undergoes a rigorous multi-stage review process. We verify sources, cross-reference data, and challenge assumptions before publication.
                    </p>
                  </div>
                </details>

                <details className="group flex flex-col rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark overflow-hidden transition-all duration-300">
                  <summary className="flex cursor-pointer items-center justify-between gap-6 p-5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors select-none">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-[20px]">history_edu</span>
                      </div>
                      <p className="text-slate-900 dark:text-white text-base font-bold leading-normal">Corrections Policy</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 transition-transform duration-300 group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <div className="px-5 pb-5 pl-[4.5rem] pr-10">
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      We acknowledge errors quickly and transparently. Corrections are clearly noted at the top of VCXpress articles, and significant updates are communicated to readers directly.
                    </p>
                  </div>
                </details>
              </div>
            </div>
          </section>

          <section className="w-full max-w-[960px] px-6 sm:px-10 py-16 mb-10">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-2">
                <h2 className="text-slate-900 dark:text-white text-2xl sm:text-3xl font-bold leading-tight tracking-tight">
                  VCXpress Editorial Team
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                  Our newsroom is led by a collective team of editors and analysts.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary shrink-0">
                      <span className="material-symbols-outlined text-[24px]">newspaper</span>
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white font-bold text-lg">VCXpress Editorial Team</p>
                      <p className="text-primary text-sm font-medium">Editors • Analysts • Fact-checkers</p>
                      <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-[44rem]">
                        We report with independence, verify rigorously, and correct transparently. For press releases, corrections, and news tips, reach the team directly.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:items-end">
                    <Link className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline" href="/contact">
                      Contact Editorial
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                    <Link className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-500 hover:text-primary transition-colors" href="/privacy">
                      Policies
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
