import type {ReactNode} from 'react'

import Link from 'next/link'
import Image from 'next/image'

import {sanityFetch} from '@/lib/sanity.client'
import {LEARN_CATEGORIES_LIST_QUERY} from '@/lib/sanity.queries'

type LearnCategory = {
  _id: string
  title: string
  slug: string
  tags?: string[] | null
}

function getLearnFooterLabel(category: LearnCategory): string {
  const tag = Array.isArray(category.tags) ? category.tags.find((t) => typeof t === 'string' && t.trim().length > 0) : undefined
  if (tag) return tag.trim()

  const slug = category.slug
  if (slug === 'funding-and-investments') return 'Funding'
  if (slug === 'venture-capital') return 'VC'

  const title = category.title.trim()
  if (!title) return 'Learn'

  const normalized = title
    .replace(/\b(Basics|Guide|Guides|Explained|101)\b/gi, '')
    .replace(/\band\b/gi, '&')
    .replace(/\bof\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()

  const words = normalized.split(' ')
  if (words.length <= 2) return normalized
  return words.slice(0, 2).join(' ')
}

function SocialIconLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: ReactNode
}) {
  return (
    <a
      aria-label={label}
      className="text-text-main/60 dark:text-white/60 hover:text-primary transition-colors"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  )
}

export default async function GlobalFooter() {
  const learnCategories = await sanityFetch<LearnCategory[]>(
    LEARN_CATEGORIES_LIST_QUERY,
    {},
    {revalidate: 300, useCdn: false, tags: ['learn']},
  )

  const learnFooterItems = learnCategories.slice(0, 3)

  return (
    <footer className="bg-background-light dark:bg-background-dark border-t border-black/10 dark:border-white/10 pt-16 pb-10 text-text-main dark:text-white transition-colors duration-300 ease-in-out">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:hidden mb-12">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Image alt="" aria-hidden="true" className="h-8 w-8" height={32} src="/brand/icons/vcx-icon-32.png" width={32} />
              <span className="font-serif text-xl font-medium tracking-wide text-text-main dark:text-white transition-colors duration-300 ease-in-out">VCXPRESS</span>
            </div>
            <p className="text-sm text-text-main/60 dark:text-white/60 mb-6 leading-relaxed transition-colors duration-300 ease-in-out">
              The premier source for global business, finance, and technology news. We provide the intelligence professionals need to make smarter decisions.
            </p>
            <div className="flex gap-4">
              <SocialIconLink href="https://www.linkedin.com" label="LinkedIn">
                <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452H17.21v-5.569c0-1.328-.027-3.036-1.852-3.036-1.853 0-2.136 1.445-2.136 2.939v5.666H9.002V9h3.107v1.561h.044c.433-.82 1.494-1.684 3.073-1.684 3.286 0 3.893 2.164 3.893 4.977v6.598zM5.337 7.433a1.812 1.812 0 110-3.623 1.812 1.812 0 010 3.623zM6.956 20.452H3.716V9h3.24v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.727v20.545C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.273V1.727C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </SocialIconLink>
              <SocialIconLink href="https://x.com" label="X">
                <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.64 7.584H.47l8.6-9.83L0 1.153h7.594l5.243 6.932 6.064-6.932zm-1.29 19.494h2.04L6.48 3.248H4.296l13.315 17.399z" />
                </svg>
              </SocialIconLink>
              <SocialIconLink href="https://www.instagram.com" label="Instagram">
                <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.5 2h9A5.5 5.5 0 0122 7.5v9A5.5 5.5 0 0116.5 22h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2zm0 2A3.5 3.5 0 004 7.5v9A3.5 3.5 0 007.5 20h9a3.5 3.5 0 003.5-3.5v-9A3.5 3.5 0 0016.5 4h-9z" />
                  <path d="M12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z" />
                  <path d="M17.75 6.25a.75.75 0 110 1.5.75.75 0 010-1.5z" />
                </svg>
              </SocialIconLink>
            </div>
          </div>

          <div className="border-t border-black/10 dark:border-white/10 pt-6">
            <div className="grid grid-cols-2 gap-x-6 gap-y-8">
              <div className="min-w-0 flex flex-col gap-8">
                <div className="min-w-0">
                  <div className="text-xs font-mono uppercase tracking-wider text-text-main/70 dark:text-white/70 font-semibold mb-3">
                    News
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/category/tech">
                      Tech
                    </Link>
                    <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/category/finance">
                      Finance
                    </Link>
                    <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/category/business">
                      Business
                    </Link>
                    <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/categories">
                      View all
                    </Link>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-mono uppercase tracking-wider text-text-main/70 dark:text-white/70 font-semibold mb-3">
                    Learn
                  </div>
                  <div className="flex flex-col gap-2">
                    {learnFooterItems.map((c) => (
                      <Link
                        key={c._id}
                        className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
                        href={`/learn/${c.slug}`}
                        title={c.title}
                      >
                        {getLearnFooterLabel(c)}
                      </Link>
                    ))}
                    <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/learn">
                      View all
                    </Link>
                  </div>
                </div>
              </div>

              <div className="min-w-0 flex flex-col gap-8">
                <div className="min-w-0">
                  <div className="text-xs font-mono uppercase tracking-wider text-text-main/70 dark:text-white/70 font-semibold mb-3">
                    Company
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/about">
                      About Us
                    </Link>
                    <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/contact">
                      Contact US
                    </Link>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-mono uppercase tracking-wider text-text-main/70 dark:text-white/70 font-semibold mb-3">
                    Support
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/help-center">
                      Help Center
                    </Link>
                    <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/terms">
                      Terms of Service
                    </Link>
                    <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/privacy">
                      Privacy Policy
                    </Link>
                    <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/sitemap">
                      Sitemap
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:block lg:hidden mb-12">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Image alt="" aria-hidden="true" className="h-8 w-8" height={32} src="/brand/icons/vcx-icon-32.png" width={32} />
              <span className="font-serif text-xl font-medium tracking-wide text-text-main dark:text-white transition-colors duration-300 ease-in-out">VCXPRESS</span>
            </div>
            <p className="text-sm text-text-main/60 dark:text-white/60 mb-6 leading-relaxed transition-colors duration-300 ease-in-out">
              The premier source for global business, finance, and technology news. We provide the intelligence professionals need to make smarter decisions.
            </p>
            <div className="flex gap-4">
              <SocialIconLink href="https://www.linkedin.com" label="LinkedIn">
                <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452H17.21v-5.569c0-1.328-.027-3.036-1.852-3.036-1.853 0-2.136 1.445-2.136 2.939v5.666H9.002V9h3.107v1.561h.044c.433-.82 1.494-1.684 3.073-1.684 3.286 0 3.893 2.164 3.893 4.977v6.598zM5.337 7.433a1.812 1.812 0 110-3.623 1.812 1.812 0 010 3.623zM6.956 20.452H3.716V9h3.24v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.727v20.545C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.273V1.727C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </SocialIconLink>
              <SocialIconLink href="https://x.com" label="X">
                <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.64 7.584H.47l8.6-9.83L0 1.153h7.594l5.243 6.932 6.064-6.932zm-1.29 19.494h2.04L6.48 3.248H4.296l13.315 17.399z" />
                </svg>
              </SocialIconLink>
              <SocialIconLink href="https://www.instagram.com" label="Instagram">
                <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.5 2h9A5.5 5.5 0 0122 7.5v9A5.5 5.5 0 0116.5 22h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2zm0 2A3.5 3.5 0 004 7.5v9A3.5 3.5 0 007.5 20h9a3.5 3.5 0 003.5-3.5v-9A3.5 3.5 0 0016.5 4h-9z" />
                  <path d="M12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z" />
                  <path d="M17.75 6.25a.75.75 0 110 1.5.75.75 0 010-1.5z" />
                </svg>
              </SocialIconLink>
            </div>
          </div>

          <div className="border-t border-black/10 dark:border-white/10 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
              <div className="min-w-0">
                <div className="text-xs font-mono uppercase tracking-wider text-text-main/70 dark:text-white/70 font-semibold mb-3">
                  News
                </div>
                <div className="flex flex-col gap-2">
                  <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/category/tech">
                    Tech
                  </Link>
                  <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/category/finance">
                    Finance
                  </Link>
                  <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/category/business">
                    Business
                  </Link>
                  <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/categories">
                    View all
                  </Link>
                </div>
              </div>

              <div className="min-w-0">
                <div className="text-xs font-mono uppercase tracking-wider text-text-main/70 dark:text-white/70 font-semibold mb-3">
                  Learn
                </div>
                <div className="flex flex-col gap-2">
                  {learnFooterItems.map((c) => (
                    <Link
                      key={c._id}
                      className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
                      href={`/learn/${c.slug}`}
                      title={c.title}
                    >
                      {getLearnFooterLabel(c)}
                    </Link>
                  ))}
                  <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/learn">
                    View all
                  </Link>
                </div>
              </div>

              <div className="min-w-0">
                <div className="text-xs font-mono uppercase tracking-wider text-text-main/70 dark:text-white/70 font-semibold mb-3">
                  Company
                </div>
                <div className="flex flex-col gap-2">
                  <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/about">
                    About Us
                  </Link>
                  <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/contact">
                    Contact US
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="text-xs font-mono uppercase tracking-wider text-text-main/70 dark:text-white/70 font-semibold mb-3">
                Support
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2">
                <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/help-center">
                  Help Center
                </Link>
                <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/terms">
                  Terms of Service
                </Link>
                <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/privacy">
                  Privacy Policy
                </Link>
                <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/sitemap">
                  Sitemap
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:grid grid-cols-12 gap-8 mb-12">
          <div className="col-span-4">
            <div className="flex items-center gap-2 mb-4">
              <Image alt="" aria-hidden="true" className="h-8 w-8" height={32} src="/brand/icons/vcx-icon-32.png" width={32} />
              <span className="font-serif text-xl font-medium tracking-wide text-text-main dark:text-white transition-colors duration-300 ease-in-out">VCXPRESS</span>
            </div>
            <p className="text-sm text-text-main/60 dark:text-white/60 mb-6 leading-relaxed transition-colors duration-300 ease-in-out">
              The premier source for global business, finance, and technology news. We provide the intelligence professionals need to make smarter decisions.
            </p>
            <div className="flex gap-4">
              <SocialIconLink href="https://www.linkedin.com" label="LinkedIn">
                <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452H17.21v-5.569c0-1.328-.027-3.036-1.852-3.036-1.853 0-2.136 1.445-2.136 2.939v5.666H9.002V9h3.107v1.561h.044c.433-.82 1.494-1.684 3.073-1.684 3.286 0 3.893 2.164 3.893 4.977v6.598zM5.337 7.433a1.812 1.812 0 110-3.623 1.812 1.812 0 010 3.623zM6.956 20.452H3.716V9h3.24v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.727v20.545C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.273V1.727C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </SocialIconLink>
              <SocialIconLink href="https://x.com" label="X">
                <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.64 7.584H.47l8.6-9.83L0 1.153h7.594l5.243 6.932 6.064-6.932zm-1.29 19.494h2.04L6.48 3.248H4.296l13.315 17.399z" />
                </svg>
              </SocialIconLink>
              <SocialIconLink href="https://www.instagram.com" label="Instagram">
                <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.5 2h9A5.5 5.5 0 0122 7.5v9A5.5 5.5 0 0116.5 22h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2zm0 2A3.5 3.5 0 004 7.5v9A3.5 3.5 0 007.5 20h9a3.5 3.5 0 003.5-3.5v-9A3.5 3.5 0 0016.5 4h-9z" />
                  <path d="M12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z" />
                  <path d="M17.75 6.25a.75.75 0 110 1.5.75.75 0 010-1.5z" />
                </svg>
              </SocialIconLink>
            </div>
          </div>

          <div className="col-span-2 min-w-0">
            <div className="text-sm text-text-main/80 dark:text-white/80 font-semibold transition-colors duration-300 ease-in-out">
              <div className="flex flex-wrap items-center gap-2">
                <span>News</span>
                <span className="whitespace-nowrap rounded-full bg-gray-100 dark:bg-white/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-gray-500 dark:text-white/70">
                  Categories
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2 pl-3 border-l border-gray-200 dark:border-white/10 transition-colors duration-300 ease-in-out">
              <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/category/tech">
                Tech
              </Link>
              <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/category/finance">
                Finance
              </Link>
              <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/category/business">
                Business
              </Link>
              <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors whitespace-nowrap" href="/categories">
                View all
              </Link>
            </div>
          </div>

          <div className="col-span-2 min-w-0">
            <div className="text-sm text-text-main/80 dark:text-white/80 font-semibold transition-colors duration-300 ease-in-out">
              <div className="flex flex-wrap items-center gap-2">
                <span>Learn</span>
                <span className="whitespace-nowrap rounded-full bg-gray-100 dark:bg-white/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-gray-500 dark:text-white/70">
                  Topics
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2 pl-3 border-l border-gray-200 dark:border-white/10 transition-colors duration-300 ease-in-out">
              {learnFooterItems.map((c) => (
                <Link
                  key={c._id}
                  className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
                  href={`/learn/${c.slug}`}
                  title={c.title}
                >
                  {getLearnFooterLabel(c)}
                </Link>
              ))}
              <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors whitespace-nowrap" href="/learn">
                View all
              </Link>
            </div>
          </div>

          <div className="col-span-2 flex flex-col gap-3">
            <h5 className="font-bold text-text-main dark:text-white mb-2 uppercase font-mono text-xs tracking-wider transition-colors duration-300 ease-in-out">Company</h5>
            <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/about">
              About Us
            </Link>
            <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/contact">
              Contact US
            </Link>
          </div>

          <div className="col-span-2 flex flex-col gap-3">
            <h5 className="font-bold text-text-main dark:text-white mb-2 uppercase font-mono text-xs tracking-wider transition-colors duration-300 ease-in-out">Support</h5>
            <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/help-center">
              Help Center
            </Link>
            <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/terms">
              Terms of Service
            </Link>
            <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/privacy">
              Privacy Policy
            </Link>
            <Link className="text-sm text-text-main/60 dark:text-white/60 hover:text-primary transition-colors" href="/sitemap">
              Sitemap
            </Link>
          </div>
        </div>

        <div className="border-t border-black/10 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 transition-colors duration-300 ease-in-out">
          <p className="text-xs text-text-main/50 dark:text-white/50 font-mono transition-colors duration-300 ease-in-out"> 2026 VCXPRESS. All rights reserved.</p>
          <div className="flex gap-6">
            <Link className="text-xs text-text-main/50 dark:text-white/50 hover:text-primary font-mono uppercase transition-colors" href="/privacy">
              Privacy
            </Link>
            <Link className="text-xs text-text-main/50 dark:text-white/50 hover:text-primary font-mono uppercase transition-colors" href="/terms">
              Terms
            </Link>
            <Link className="text-xs text-text-main/50 dark:text-white/50 hover:text-primary font-mono uppercase transition-colors" href="/cookies">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
