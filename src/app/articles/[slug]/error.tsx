'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & {digest?: string}
  reset: () => void
}) {
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-zinc-700">{error.message}</p>
      <button className="mt-4 rounded border px-3 py-2" onClick={() => reset()}>
        Try again
      </button>
    </main>
  )
}
