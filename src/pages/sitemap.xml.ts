import type { APIRoute } from 'astro';
import { sanityFetch, queries } from '@/lib/sanity';
import { safeAsync } from '@/utils/errorHandling';
import type { ArticleTaxonomy } from '@/types/sanity';

export const GET: APIRoute = async () => {
  const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'https://wmesiti-portfolio.vercel.app';

  // Fetch all project slugs
  const projects = await safeAsync(
    () => sanityFetch<{ slug: string }[]>(queries.projectSlugs),
    []
  );

  const [articles, categories, tags] = await Promise.all([
    safeAsync(() => sanityFetch<Array<{ slug: string; language: 'fr-CA' | 'en'; updatedAt?: string; publishedAt: string }>>(queries.articlePaths), []),
    safeAsync(() => sanityFetch<ArticleTaxonomy[]>(queries.articleCategories), []),
    safeAsync(() => sanityFetch<ArticleTaxonomy[]>(queries.articleTags), []),
  ]);

  // Build URLs
  const staticPages = [
    { url: '', changefreq: 'weekly', priority: 1.0 }, // Homepage
    { url: '/fr/blog', changefreq: 'weekly', priority: 0.9 },
    { url: '/en/blog', changefreq: 'weekly', priority: 0.9 },
  ];

  const projectPages = projects.map((project) => ({
    url: `/projects/${project.slug}`,
    changefreq: 'monthly',
    priority: 0.8,
  }));

  const articlePages = articles.map((article) => ({
    url: `/${article.language === 'fr-CA' ? 'fr' : 'en'}/blog/${article.slug}`,
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: article.updatedAt || article.publishedAt,
  }));

  const taxonomyPages = ['fr', 'en'].flatMap((locale) => [
    ...categories.map((category) => ({ url: `/${locale}/blog/category/${category.slug}`, changefreq: 'weekly', priority: 0.6 })),
    ...tags.map((tag) => ({ url: `/${locale}/blog/tag/${tag.slug}`, changefreq: 'weekly', priority: 0.5 })),
  ]);

  const allPages = [...staticPages, ...projectPages, ...articlePages, ...taxonomyPages];

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map((page) => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${'lastmod' in page && typeof page.lastmod === 'string' ? new Date(page.lastmod).toISOString() : new Date().toISOString()}</lastmod>
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
