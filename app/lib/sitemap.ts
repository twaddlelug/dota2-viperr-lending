const XML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
}

const escapeXml = (value: string) =>
  value.replace(/[&<>"']/g, char => XML_ENTITIES[char])

export function sitemapXml(urls: string[]) {
  const entries = urls.map(url => `  <url><loc>${escapeXml(url)}</loc></url>`)
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n')
}

export function robotsTxt(sitemapUrl: string, disallow: string[]) {
  return [
    'User-agent: *',
    ...disallow.map(path => `Disallow: ${path}`),
    '',
    `Sitemap: ${sitemapUrl}`,
    '',
  ].join('\n')
}
