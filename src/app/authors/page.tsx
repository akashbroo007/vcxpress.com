import Link from 'next/link'

import {sanityFetch} from '@/lib/sanity.client'
import {AUTHORS_LIST_QUERY} from '@/lib/sanity.queries'

type AuthorListItem = {
  _id: string
  name: string
  slug: string
}

export default async function AuthorsPage() {
  const authors = await sanityFetch<AuthorListItem[]>(AUTHORS_LIST_QUERY, {}, {revalidate: 300})

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Authors</h1>

      {authors.length === 0 ? (
        <p className="mt-4">No authors yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {authors.map((a) => (
            <li key={a._id} className="border rounded p-4">
              <Link className="underline" href={`/authors/${a.slug}`}>
                {a.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
