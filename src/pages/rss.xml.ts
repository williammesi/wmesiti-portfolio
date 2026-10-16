import type { APIRoute } from "astro";
import { articleUrl, SITE_URL } from "@/lib/blog";
import { queries, sanityFetch } from "@/lib/sanity";
import type { ArticlePreview } from "@/types/sanity";
import { safeAsync } from "@/utils/errorHandling";

export const prerender = true;

const xml = (value: string): string => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

export const GET: APIRoute = async () => {
  const [french, english] = await Promise.all([
    safeAsync(() => sanityFetch<ArticlePreview[]>(queries.articlesByLanguage, { language: "fr-CA" }), []),
    safeAsync(() => sanityFetch<ArticlePreview[]>(queries.articlesByLanguage, { language: "en" }), []),
  ]);
  const articles = [...french, ...english]
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  const newest = articles[0]?.updatedAt || articles[0]?.publishedAt;
  const feedUrl = `${SITE_URL}/rss.xml`;

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>William Mesiti — Technical Blog</title>
    <link>${xml(`${SITE_URL}/fr/blog`)}</link>
    <description>Technical research, software projects, experiments, algorithms, and engineering decisions.</description>
    <atom:link href="${xml(feedUrl)}" rel="self" type="application/rss+xml" />${newest ? `
    <lastBuildDate>${new Date(newest).toUTCString()}</lastBuildDate>` : ""}
${articles.map((article) => {
  const url = new URL(articleUrl(article), SITE_URL).href;
  return `    <item>
      <title>${xml(article.title)}</title>
      <link>${xml(url)}</link>
      <guid isPermaLink="true">${xml(url)}</guid>
      <description>${xml(article.excerpt)}</description>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <dc:creator>William Mesiti</dc:creator>
      <dc:language>${article.language}</dc:language>
    </item>`;
}).join("\n")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
