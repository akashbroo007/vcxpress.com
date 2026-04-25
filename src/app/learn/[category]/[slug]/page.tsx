import type {Metadata} from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {notFound} from 'next/navigation'

import {PortableText, type PortableTextComponents} from '@portabletext/react'
import type {PortableTextBlock} from '@portabletext/types'

import {sanityFetch} from '@/lib/sanity.client'
import {LEARN_ARTICLE_BY_CATEGORY_AND_SLUG_QUERY, LEARN_READ_NEXT_QUERY} from '@/lib/sanity.queries'
import {safeSanityImageUrl} from '@/lib/sanity/image'
import ArticleActionButtons from '@/components/ArticleActionButtons'
import ScrollProgressBar from '@/components/ScrollProgressBar'

const isValidHttpUrl = (value: string | undefined): boolean => {
  if (!value) return false
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

const portableTextComponents: PortableTextComponents = {
  marks: {
    link: ({children, value}) => {
      const href = typeof value?.href === 'string' ? value.href : undefined
      if (!href || !isValidHttpUrl(href)) return <>{children}</>

      return (
        <a className="text-primary underline hover:opacity-80" href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      )
    },
  },
}

type LearnArticleDetail = {
  _id: string
  title: string
  slug: string
  summary: string
  content: PortableTextBlock[]
  coverImage?: unknown
  tags?: string[] | null
  categories?: Array<{
    _id: string
    title: string
    slug: string
  }> | null
  category?: {
    _id: string
    title: string
    slug: string
    description?: string | null
  } | null
  seo?: {
    metaTitle?: string | null
    metaDescription?: string | null
  } | null
}

type LearnReadNextItem = {
  _id: string
  title: string
  slug: string
  summary: string
  coverImage?: unknown
  tags?: string[] | null
  categories?: Array<{
    _id: string
    title: string
    slug: string
  }> | null
  category?: {
    _id: string
    title: string
    slug: string
  } | null
}

type PageProps = {
  params: Promise<{category: string; slug: string}>
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {category, slug} = await params

  const article = await sanityFetch<LearnArticleDetail | null>(
    LEARN_ARTICLE_BY_CATEGORY_AND_SLUG_QUERY,
    {categorySlug: category, slug},
    {revalidate: 300, tags: ['learn', `learn:${category}`, `learn:${category}:${slug}`]},
  )

  if (!article) return {}

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const canonicalUrl = new URL(`/learn/${category}/${article.slug}`, siteUrl)
  const ogImage = safeSanityImageUrl(article.coverImage, {width: 1200, height: 630}) ?? undefined

  return {
    title: article.seo?.metaTitle || article.title,
    description: article.seo?.metaDescription || article.summary,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title: article.seo?.metaTitle || article.title,
      description: article.seo?.metaDescription || article.summary,
      images: ogImage ? [{url: ogImage, width: 1200, height: 630, alt: article.title}] : undefined,
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title: article.seo?.metaTitle || article.title,
      description: article.seo?.metaDescription || article.summary,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

export default async function LearnArticlePage({params}: PageProps) {
  const {category, slug} = await params

  const article = await sanityFetch<LearnArticleDetail | null>(
    LEARN_ARTICLE_BY_CATEGORY_AND_SLUG_QUERY,
    {categorySlug: category, slug},
    {revalidate: 300, tags: ['learn', `learn:${category}`, `learn:${category}:${slug}`]},
  )

  if (!article) notFound()

  const readNext = article.category?._id
    ? await sanityFetch<LearnReadNextItem[]>(
        LEARN_READ_NEXT_QUERY,
        {categoryId: article.category._id, currentId: article._id},
        {revalidate: 300, tags: ['learn', `learn:${category}`]},
      )
    : []

  return (
    <div className="theme-detail bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden">
      <div className="fixed top-0 left-0 right-0 z-[70] h-[2px] bg-gray-200 dark:bg-gray-800">
        <ScrollProgressBar className="h-full bg-gray-600" targetId="learn-article-content" />
      </div>

      <main className="w-full flex justify-center pb-20">
        <article className="max-w-[960px] w-full px-4 sm:px-6 md:px-8 pt-8 md:pt-12 flex flex-col" id="learn-article-content">
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-500 dark:text-gray-400">
            <Link className="hover:text-gray-700 transition-colors" href="/">
              Home
            </Link>
            <span className="material-symbols-outlined text-base">chevron_right</span>
            <Link className="hover:text-gray-700 transition-colors" href="/learn">
              Learn
            </Link>
            <span className="material-symbols-outlined text-base">chevron_right</span>
            <Link className="hover:text-gray-700 transition-colors" href={`/learn/${category}`}>
              {article.category?.title || category.replace('-', ' ')}
            </Link>
          </div>

          <div className="flex gap-2 mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded bg-gray-100 text-gray-700 text-xs font-semibold uppercase tracking-wider">
              Learn
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              {article.category?.title ?? 'Evergreen'}
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
                  <span className="material-symbols-outlined text-lg">auto_stories</span>
                  <span>Evergreen</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">schedule</span>
                  <span>8 min read</span>
                </div>
              </div>
            </div>

            <ArticleActionButtons className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800" title={article.title} />
          </div>

          <div className="mb-12 p-6 md:p-8 bg-gray-50 dark:bg-gray-900 border-l-2 border-gray-300 dark:border-gray-700 rounded-r-lg">
            <h3 className="text-gray-700 dark:text-gray-300 font-semibold uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-gray-500">bolt</span> Executive Summary
            </h3>
            <ul className="space-y-3 text-gray-800 dark:text-gray-200 text-base md:text-lg leading-relaxed font-serif">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0"></span>
                <span>{article.summary}</span>
              </li>
              {article.category?.slug ? (
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0"></span>
                  <span>
                    <Link className="hover:underline" href={`/learn/${article.category.slug}`}>
                      Explore more in {article.category.title}
                    </Link>
                  </span>
                </li>
              ) : null}
            </ul>
          </div>

          {article.coverImage ? (
            <figure className="mb-12">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                {(() => {
                  const imageUrl = safeSanityImageUrl(article.coverImage, {width: 1200, height: 675})

                  return imageUrl ? (
                    <Image alt={article.title} className="object-cover" fill priority sizes="(max-width: 960px) 100vw, 960px" src={imageUrl} />
                  ) : (
                    <div className="absolute inset-0" />
                  )
                })()}
              </div>
              <figcaption className="mt-3 text-sm text-slate-500 dark:text-slate-400 text-center italic">
                {article.category?.title || 'Learn'}
              </figcaption>
            </figure>
          ) : null}

          <div className="w-full max-w-[720px] mx-auto">
            <div className="prose prose-lg md:prose-xl dark:prose-invert prose-slate prose-headings:font-display prose-headings:font-bold prose-a:text-gray-700 hover:prose-a:text-gray-900 prose-img:rounded-lg prose-p:leading-8">
              <p className="drop-cap text-lg md:text-xl leading-8 text-slate-700 dark:text-slate-300 mb-8">{article.summary}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-8">Full Guide</h2>
              <PortableText value={article.content} components={portableTextComponents} />
            </div>

            {(article.categories?.length || article.tags?.length) ? (
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
                      href={`/learn/${c.slug}`}
                    >
                      {c.title}
                    </Link>
                  ))}
                  {(article.tags || []).map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {readNext.length ? (
              <section className="mt-14 pt-10 border-t border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Read next</h2>
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {readNext.map((a) => (
                    <Link
                      key={a._id}
                      href={a.category?.slug ? `/learn/${a.category.slug}/${a.slug}` : '/learn'}
                      className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-white/5 p-5 hover:bg-white dark:hover:bg-white/10 transition-colors"
                    >
                      <div className="flex gap-4">
                        <div className="relative w-24 h-20 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                          {(() => {
                            const imageUrl = safeSanityImageUrl(a.coverImage, {width: 320, height: 240})

                            return imageUrl ? (
                              <Image alt={a.title} className="object-cover" fill sizes="96px" src={imageUrl} />
                            ) : (
                              <div className="absolute inset-0" />
                            )
                          })()}
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                            {a.category?.title ?? ''}
                          </div>
                          <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white leading-snug">{a.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{a.summary}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </article>
      </main>
    </div>
  )
}
