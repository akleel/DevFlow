import type { MetadataRoute } from 'next';

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com';
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl().replace(/\/$/, '');
  const now = new Date();

  return [
    { url: `${base}/`, lastModified: now },
    { url: `${base}/engineering`, lastModified: now },
  ];
}