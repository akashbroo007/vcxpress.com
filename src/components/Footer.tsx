export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-5xl px-6 py-6 text-sm text-zinc-600">
        © {new Date().getFullYear()} VCXPRESS
      </div>
    </footer>
  )
}
