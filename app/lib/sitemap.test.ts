import { describe, expect, it } from 'vitest'
import { robotsTxt, sitemapXml } from './sitemap'

describe('sitemapXml', () => {
  it('lists every address in a urlset', () => {
    expect(
      sitemapXml(['https://viperr.gg/', 'https://viperr.gg/teams/venom'])
    ).toBe(
      [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <url><loc>https://viperr.gg/</loc></url>',
        '  <url><loc>https://viperr.gg/teams/venom</loc></url>',
        '</urlset>',
        '',
      ].join('\n')
    )
  })

  it('escapes characters that would break the XML', () => {
    expect(sitemapXml([`https://viperr.gg/?a=1&b='2'`])).toContain(
      '<loc>https://viperr.gg/?a=1&amp;b=&apos;2&apos;</loc>'
    )
  })
})

describe('robotsTxt', () => {
  it('closes private areas and points to the sitemap', () => {
    expect(robotsTxt('https://viperr.gg/sitemap.xml', ['/admin'])).toBe(
      'User-agent: *\nDisallow: /admin\n\nSitemap: https://viperr.gg/sitemap.xml\n'
    )
  })
})
