import type { MetadataRoute } from 'next';

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com';
}

export default function robots(): MetadataRoute.Robots {
  const url = siteUrl();

  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin'] }],
    sitemap: `${url.replace(/\/$/, '')}/sitemap.xml`,
  };
}
