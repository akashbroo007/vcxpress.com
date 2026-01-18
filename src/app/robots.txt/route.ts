export async function GET(): Promise<Response> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /studio',
    `Sitemap: ${new URL('/sitemap.xml', siteUrl).toString()}`,
    '',
  ].join('\n')

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  })
}
