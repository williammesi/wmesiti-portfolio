import type { APIRoute } from "astro";
import { imageUrl, SITE_URL } from "@/lib/blog";
import { queries, sanityFetch } from "@/lib/sanity";
import { safeAsync } from "@/utils/errorHandling";

export const prerender = true;

interface SitemapArticle {
  slug: string;
  language: "fr-CA" | "en";
  publishedAt: string;
  updatedAt?: string;
  externalCanonicalUrl?: string;
  categorySlug?: string;
  tagSlugs: string[];
  coverImage?: { asset?: { _ref?: string }; alt?: string };
}

interface SitemapEntry {
  path: string;
  lastmod?: string;
  image?: { url: string; caption?: string };
}

const xml = (value: string): string => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

const newestDate = (articles: SitemapArticle[]): string | undefined => articles
  .map((article) => article.updatedAt || article.publishedAt)
  .filter(Boolean)
  .sort((a, b) => Date.parse(b) - Date.parse(a))[0];

export const GET: APIRoute = async () => {
  const [projects, allArticles] = await Promise.all([
    safeAsync(() => sanityFetch<Array<{ slug: string; _updatedAt: string }>>(queries.projectSlugs), []),
    safeAsync(() => sanityFetch<SitemapArticle[]>(queries.articlePaths), []),
  ]);

  // A page with an external canonical is intentionally omitted: sitemap URLs
  // must be canonical, indexable URLs from this host.
  const articles = allArticles.filter((article) => !article.externalCanonicalUrl);
  const frenchArticles = articles.filter((article) => article.language === "fr-CA");
  const englishArticles = articles.filter((article) => article.language === "en");

  const entries: SitemapEntry[] = [
    { path: "/" },
    { path: "/fr/blog", lastmod: newestDate(frenchArticles) },
    { path: "/en/blog", lastmod: newestDate(englishArticles) },
    ...projects.map((project) => ({
      path: `/projects/${project.slug}`,
      lastmod: project._updatedAt,
    })),
    ...articles.map((article) => ({
      path: `/${article.language === "fr-CA" ? "fr" : "en"}/blog/${article.slug}`,
      lastmod: article.updatedAt || article.publishedAt,
      image: article.coverImage?.asset?._ref ? {
        url: imageUrl(article.coverImage.asset._ref, 1600)!,
        caption: article.coverImage.alt,
      } : undefined,
    })),
  ];

  for (const locale of ["fr", "en"] as const) {
    const localizedArticles = locale === "fr" ? frenchArticles : englishArticles;
    const categories = new Set(localizedArticles.flatMap((article) => article.categorySlug ? [article.categorySlug] : []));
    const tags = new Set(localizedArticles.flatMap((article) => article.tagSlugs));

    for (const slug of categories) {
      const matching = localizedArticles.filter((article) => article.categorySlug === slug);
      entries.push({ path: `/${locale}/blog/category/${slug}`, lastmod: newestDate(matching) });
    }
    for (const slug of tags) {
      const matching = localizedArticles.filter((article) => article.tagSlugs.includes(slug));
      entries.push({ path: `/${locale}/blog/tag/${slug}`, lastmod: newestDate(matching) });
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.map((entry) => `  <url>
    <loc>${xml(new URL(entry.path, SITE_URL).href)}</loc>${entry.lastmod ? `
    <lastmod>${xml(new Date(entry.lastmod).toISOString())}</lastmod>` : ""}${entry.image ? `
    <image:image>
      <image:loc>${xml(entry.image.url)}</image:loc>${entry.image.caption ? `
      <image:caption>${xml(entry.image.caption)}</image:caption>` : ""}
    </image:image>` : ""}
  </url>`).join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
