import type { APIRoute } from 'astro';
import { sanityFetch, queries } from '@/lib/sanity';
import { safeAsync } from '@/utils/errorHandling';

export const GET: APIRoute = async () => {
  const siteUrl = 'https://wmesiti-portfolio.vercel.app';

  // Fetch all project slugs
  const projects = await safeAsync(
    () => sanityFetch<{ slug: string }[]>(queries.projectSlugs),
    []
  );

  // Build URLs
  const staticPages = [
    { url: '', changefreq: 'weekly', priority: 1.0 }, // Homepage
  ];

  const projectPages = projects.map((project) => ({
    url: `/projects/${project.slug}`,
    changefreq: 'monthly',
    priority: 0.8,
  }));

  const allPages = [...staticPages, ...projectPages];

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map((page) => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
};
