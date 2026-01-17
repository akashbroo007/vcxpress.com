import Link from 'next/link'
import {notFound} from 'next/navigation'

import {sanityFetch} from '@/lib/sanity.client'
import {AUTHOR_BY_SLUG_QUERY} from '@/lib/sanity.queries'

type AuthorDetail = {
  _id: string
  name: string
  slug: string
}

type PageProps = {
  params: Promise<{slug: string}>
}

export default async function AuthorDetailPage({params}: PageProps) {
  const {slug} = await params

  const author = await sanityFetch<AuthorDetail | null>(AUTHOR_BY_SLUG_QUERY, {slug}, {revalidate: 300})

  if (!author) notFound()

  return (
    <main className="p-6">
      <nav className="text-sm text-zinc-600">
        <Link className="underline" href="/authors">
          Authors
        </Link>
        <span> / </span>
        <span className="text-zinc-900">{author.name}</span>
      </nav>

      <h1 className="mt-4 text-3xl font-semibold">{author.name}</h1>
    </main>
  )
}
