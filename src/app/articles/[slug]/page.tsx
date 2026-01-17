import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import Image from 'next/image'
import {PortableText, type PortableTextComponents} from '@portabletext/react'
import type {PortableTextBlock} from '@portabletext/types'

import {sanityFetch} from '@/lib/sanity.client'
import {ARTICLE_BY_SLUG_QUERY} from '@/lib/sanity.queries'
import {urlFor} from '@/lib/sanity/image'

const portableTextComponents: PortableTextComponents = {
  marks: {
    link: ({children, value}) => {
      const href = typeof value?.href === 'string' ? value.href : undefined
      if (!href) return <>{children}</>

      return (
        <a
          className="text-primary underline hover:opacity-80"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      )
    },
  },
}

type ArticleDetail = {
  _id: string
  title: string
  slug: string
  summary: string
  body: PortableTextBlock[]
  companyName: string
  fundingAmount: string
  fundingRound: string
  publishedDate: string
  sourceURL: string
  featuredImage?: unknown
  seoTitle?: string | null
  seoDescription?: string | null
  categories?: Array<{
    _id: string
    name: string
    slug: string
  }>
  category?: {
    _id: string
    name: string
    slug: string
  } | null
}

type PageProps = {
  params: Promise<{slug: string}>
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {slug} = await params

  const article = await sanityFetch<ArticleDetail | null>(
    ARTICLE_BY_SLUG_QUERY,
    {slug},
    {revalidate: 60, useCdn: false, tags: ['articles', `article:${slug}`]},
  )

  if (!article) return {}

  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.summary,
  }
}

export default async function ArticleDetailPage({params}: PageProps) {
  const {slug} = await params

  const article = await sanityFetch<ArticleDetail | null>(
    ARTICLE_BY_SLUG_QUERY,
    {slug},
    {revalidate: 60, useCdn: false, tags: ['articles', `article:${slug}`]},
  )

  if (!article) notFound()

  return (
    <div className="theme-detail bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden">
      <div className="w-full h-1 bg-slate-200 dark:bg-slate-800">
        <div className="h-full bg-primary w-[35%] transition-all duration-300"></div>
      </div>
      <main className="w-full flex justify-center pb-20">
        <article className="max-w-[960px] w-full px-4 sm:px-6 md:px-8 pt-8 md:pt-12 flex flex-col">
          <div className="flex items-center gap-2 mb-6 text-sm text-slate-500 dark:text-slate-400">
            <Link className="hover:text-primary transition-colors" href="/">
              Home
            </Link>
            <span className="material-symbols-outlined text-base">chevron_right</span>
            {article.category?.slug ? (
              <Link className="hover:text-primary transition-colors" href={`/categories/${article.category.slug}`}>
                {article.category.name}
              </Link>
            ) : (
              <span className="hover:text-primary transition-colors">Funding</span>
            )}
            <span className="material-symbols-outlined text-base">chevron_right</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">{article.companyName}</span>
          </div>

          <div className="flex gap-2 mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              {article.fundingRound || 'Analysis'}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              {article.category?.name ?? 'Venture Capital'}
            </span>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-8">
            {article.title}
          </h1>

          <div className="w-full max-w-[720px] mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-t border-slate-200 dark:border-slate-800 py-6">
              <div className="text-sm font-bold text-slate-900 dark:text-white">VCXpress Editorial Team</div>
              <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">calendar_today</span>
                  <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">schedule</span>
                  <span>8 min read</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
              <button className="text-slate-400 hover:text-primary transition-colors" type="button">
                <span className="material-symbols-outlined">share</span>
              </button>
              <button className="text-slate-400 hover:text-primary transition-colors" type="button">
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
            </div>
          </div>

          <div className="mb-12 p-6 md:p-8 bg-blue-50 dark:bg-slate-900 border-l-4 border-primary rounded-r-lg shadow-sm">
            <h3 className="text-primary font-bold uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">bolt</span> Executive Summary
            </h3>
            <ul className="space-y-3 text-slate-800 dark:text-slate-200 text-base md:text-lg leading-relaxed font-serif">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
                <span>{article.summary}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
                <span>
                  <a className="hover:underline" href={article.sourceURL} target="_blank" rel="noreferrer">
                    View source
                  </a>
                </span>
              </li>
            </ul>
          </div>

          <figure className="mb-12">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
              {article.featuredImage ? (
                <Image
                  alt={article.title}
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 960px) 100vw, 960px"
                  src={urlFor(article.featuredImage).width(1200).height(675).fit('crop').auto('format').url()}
                />
              ) : null}
            </div>
            <figcaption className="mt-3 text-sm text-slate-500 dark:text-slate-400 text-center italic">
              {article.companyName}
            </figcaption>
          </figure>

          <div className="w-full max-w-[720px] mx-auto">
            <div className="prose prose-lg md:prose-xl dark:prose-invert prose-slate prose-headings:font-display prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-lg prose-p:leading-8">
              <p className="drop-cap text-lg md:text-xl leading-8 text-slate-700 dark:text-slate-300 mb-8">
                {article.summary}
              </p>
              <p className="text-lg md:text-xl leading-8 text-slate-700 dark:text-slate-300 mb-10">
                Funding details: {article.fundingAmount} ({article.fundingRound})
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-8">Full Story</h2>
              <PortableText value={article.body} components={portableTextComponents} />
            </div>

            <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Filed Under</h3>
              <div className="flex flex-wrap gap-2">
                {(article.categories && article.categories.length > 0
                  ? article.categories
                  : article.category
                    ? [article.category]
                    : []
                ).map((c) => (
                  <Link
                    key={c._id}
                    className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors"
                    href={`/categories/${c.slug}`}
                  >
                    {c.name}
                  </Link>
                ))}
                <span className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors">
                  {article.companyName}
                </span>
              </div>
            </div>

            <div className="mt-20 p-8 md:p-12 bg-surface-light dark:bg-slate-800 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="md:w-1/2">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-300 ease-in-out">Stay ahead of the curve</h3>
                  <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300 ease-in-out">Get the latest business and tech insights delivered to your inbox daily.</p>
                </div>
                <form className="flex flex-col sm:flex-row sm:items-stretch gap-3 w-full md:w-1/2">
                  <input
                    className="flex-1 w-full bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300 ease-in-out"
                    placeholder="Enter your email address"
                    type="email"
                  />
                  <button
                    className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded transition-colors whitespace-nowrap sm:shrink-0"
                    type="button"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}
