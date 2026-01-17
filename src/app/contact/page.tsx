import Link from 'next/link'

import ContactForm from './ContactForm'

export default function ContactPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-[#0d121b] dark:text-gray-100 font-display transition-colors duration-200">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 lg:px-20 py-8 lg:py-12">
          <nav className="flex flex-wrap gap-2 pb-6 text-sm">
            <Link className="text-[#4c669a] dark:text-gray-400 font-medium hover:text-primary transition-colors" href="/">
              Home
            </Link>
            <span className="text-[#4c669a] dark:text-gray-500 font-medium">/</span>
            <span className="text-[#0d121b] dark:text-gray-200 font-medium">Contact</span>
          </nav>
          <div className="flex flex-wrap justify-between gap-6 pb-10 border-b border-[#e7ebf3] dark:border-gray-800 mb-10">
            <div className="flex max-w-3xl flex-col gap-3">
              <h1 className="text-[#0d121b] dark:text-white text-4xl lg:text-5xl font-black leading-tight tracking-[-0.033em]">Contact Editorial Team</h1>
              <p className="text-[#4c669a] dark:text-gray-400 text-lg font-normal leading-relaxed">
                Have a news tip, correction, or press release? Get in touch directly with our editors. We read every message.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <ContactForm />
            </div>
            <aside className="lg:col-span-4 flex flex-col gap-8">
              <div className="bg-white dark:bg-[#1a202c] p-6 rounded-lg border border-[#e7ebf3] dark:border-gray-800 shadow-sm">
                <h3 className="text-lg font-bold text-[#0d121b] dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">mail</span>
                  General Inquiries
                </h3>
                <p className="text-[#4c669a] dark:text-gray-400 text-sm mb-4 leading-relaxed">
                  For immediate assistance or general questions about our coverage, email us directly.
                </p>
                <a
                  className="text-primary hover:text-blue-700 font-medium text-base break-all flex items-center gap-1 group"
                  href="mailto:contact@vcxpress.com"
                >
                  contact@vcxpress.com
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </a>
              </div>
              <div className="pt-4 border-t border-[#e7ebf3] dark:border-gray-800">
                <p className="text-sm font-medium text-[#0d121b] dark:text-white mb-4">Follow us for updates</p>
                <div className="flex items-center gap-3">
                  <a
                    aria-label="LinkedIn"
                    className="flex items-center justify-center size-10 rounded bg-[#e7ebf3] dark:bg-gray-800 text-[#4c669a] dark:text-gray-400 hover:bg-primary hover:text-white transition-all"
                    href="#"
                  >
                    <span className="text-sm font-bold">in</span>
                  </a>
                  <a
                    aria-label="X"
                    className="flex items-center justify-center size-10 rounded bg-[#e7ebf3] dark:bg-gray-800 text-[#4c669a] dark:text-gray-400 hover:bg-primary hover:text-white transition-all"
                    href="#"
                  >
                    <span className="text-sm font-bold">X</span>
                  </a>
                  <a
                    aria-label="Instagram"
                    className="flex items-center justify-center size-10 rounded bg-[#e7ebf3] dark:bg-gray-800 text-[#4c669a] dark:text-gray-400 hover:bg-primary hover:text-white transition-all"
                    href="#"
                  >
                    <span className="text-sm font-bold">ig</span>
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}
