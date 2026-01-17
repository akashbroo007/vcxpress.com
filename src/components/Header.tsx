import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-2xl font-black tracking-tight uppercase">
          VCXPRESS
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link className="text-zinc-700 hover:text-zinc-950" href="/articles">
            Articles
          </Link>
          <Link className="text-zinc-700 hover:text-zinc-950" href="/categories">
            Categories
          </Link>
        </nav>
      </div>
    </header>
  )
}
