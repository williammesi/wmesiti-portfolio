import type {
  ArticlePreview,
  BlogLanguage,
  BlogLocale,
  PortableTextBlock,
  PortableTextNode,
} from "@/types/sanity";

export const SITE_URL = import.meta.env.PUBLIC_SITE_URL || "https://wmesiti-tech.com";

export const locales: Record<BlogLocale, {
  language: BlogLanguage;
  locale: string;
  title: string;
  intro: string;
  allArticles: string;
  featured: string;
  read: string;
  published: string;
  updated: string;
  back: string;
  contents: string;
  related: string;
  noArticles: string;
  translationUnavailable: string;
  search: string;
  searchPlaceholder: string;
}> = {
  fr: {
    language: "fr-CA",
    locale: "fr-CA",
    title: "Carnet technique",
    intro: "Recherches, expériences et décisions d'ingénierie autour du logiciel, des algorithmes et de l'intelligence artificielle.",
    allArticles: "Tous les articles",
    featured: "En vedette",
    read: "Lire l'article",
    published: "Publié le",
    updated: "Mis à jour le",
    back: "Retour aux articles",
    contents: "Dans cet article",
    related: "À lire ensuite",
    noArticles: "Aucun article publié pour le moment.",
    translationUnavailable: "La traduction anglaise n'est pas encore disponible.",
    search: "Rechercher",
    searchPlaceholder: "Rechercher dans les articles…",
  },
  en: {
    language: "en",
    locale: "en",
    title: "Technical notebook",
    intro: "Research, experiments, and engineering decisions about software, algorithms, and artificial intelligence.",
    allArticles: "All articles",
    featured: "Featured",
    read: "Read article",
    published: "Published",
    updated: "Updated",
    back: "Back to articles",
    contents: "In this article",
    related: "Read next",
    noArticles: "No articles have been published yet.",
    translationUnavailable: "The French translation is not available yet.",
    search: "Search",
    searchPlaceholder: "Search articles…",
  },
};

export function localeFromLanguage(language: BlogLanguage): BlogLocale {
  return language === "fr-CA" ? "fr" : "en";
}

export function languageFromLocale(locale: string | undefined): BlogLanguage | null {
  if (locale === "fr") return "fr-CA";
  if (locale === "en") return "en";
  return null;
}

export function localizedTitle(value: { titleFr: string; titleEn: string }, locale: BlogLocale): string {
  return locale === "fr" ? value.titleFr : value.titleEn;
}

export function localizedDescription(
  value: { descriptionFr?: string; descriptionEn?: string },
  locale: BlogLocale,
): string | undefined {
  return locale === "fr" ? value.descriptionFr : value.descriptionEn;
}

export function formatBlogDate(date: string, locale: BlogLocale): string {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function articleUrl(article: Pick<ArticlePreview, "language" | "slug">): string {
  return `/${localeFromLanguage(article.language)}/blog/${article.slug}`;
}

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).href;
}

export function imageUrl(ref: string | undefined, width = 1200): string | undefined {
  if (!ref) return undefined;
  const [hash, dimensions, format] = ref.replace(/^image-/, "").split("-");
  if (!hash || !dimensions || !format) return undefined;
  const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || "9bdbnjzy";
  const dataset = import.meta.env.PUBLIC_SANITY_DATASET || "production";
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${hash}-${dimensions}.${format}?w=${width}&auto=format&q=85`;
}

export function blockText(block: PortableTextBlock): string {
  const textFromNode = (node: { text?: string; children?: Array<any> }): string =>
    typeof node.text === "string" ? node.text : (node.children || []).map(textFromNode).join("");
  return block.children.map(textFromNode).join("");
}

export function headingId(block: PortableTextBlock): string {
  const slug = blockText(block)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${slug || "section"}-${block._key.slice(0, 6)}`;
}

export function articleHeadings(body: PortableTextNode[]) {
  return body
    .filter((node): node is PortableTextBlock => node._type === "block" && ["h2", "h3", "h4"].includes((node as PortableTextBlock).style || ""))
    .map((block) => ({
      id: headingId(block),
      text: blockText(block),
      level: Number(block.style?.slice(1)) || 2,
    }));
}

export function relatedArticles(current: ArticlePreview, articles: ArticlePreview[], limit = 3): ArticlePreview[] {
  const tagIds = new Set(current.tags.map((tag) => tag._id));
  return articles
    .filter((article) => article._id !== current._id)
    .map((article) => ({
      article,
      score: (article.category?._id === current.category?._id ? 3 : 0)
        + article.tags.filter((tag) => tagIds.has(tag._id)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || Date.parse(b.article.publishedAt) - Date.parse(a.article.publishedAt))
    .slice(0, limit)
    .map(({ article }) => article);
}
