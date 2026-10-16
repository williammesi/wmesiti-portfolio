import { createClient } from "@sanity/client";

// Environment variables with fallbacks
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || "9bdbnjzy";
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || "production";
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION || "2025-09-23";

// Centralized Sanity client configuration
export const sanityClient = createClient({
  projectId,
  dataset,
  useCdn: false, // Disable CDN for immediate content updates
  apiVersion,
  perspective: 'published', // Only fetch published content
});

// Type-safe query function with error handling
export async function sanityFetch<T>(
  query: string,
  params: Record<string, any> = {},
  options: {
    revalidate?: number,
    fallback?: T
  } = {}
): Promise<T> {
  try {
    const result = await sanityClient.fetch<T>(query, params);
    return result;
  } catch (error) {
    console.error('Sanity fetch error:', error);

    // Return fallback data if provided
    if (options.fallback !== undefined) {
      return options.fallback;
    }

    // Re-throw error if no fallback
    throw error;
  }
}

// Localized field projection: English value when `$lang == "en"` and it is
// filled in, otherwise the French source field.
const localized = (field: string, alias = field) =>
  `"${alias}": select($lang == "en" => coalesce(${field}En, ${field}), ${field})`;

const projectProjection = `
  _id,
  title,
  slug,
  ${localized("summary")},
  ${localized("description")},
  status,
  year,
  thumbnail,
  image1,
  image2,
  image3,
  technologies,
  "features": features[]{
    image,
    ${localized("name")},
    ${localized("description")}
  },
  "challenges": challenges[]{
    ${localized("challengeName")},
    ${localized("challengeDescription")},
    ${localized("solutionName")},
    ${localized("solutionDescription")}
  },
  githubUrl,
  liveUrl,
  featured,
  order
`;

const timelineProjection = (title: string, organization: string) => `
  _id,
  "organization": ${organization},
  ${localized(title, "title")},
  "logoUrl": logo.asset->url,
  startDate,
  endDate,
  current,
  ${localized("description")},
  skills
`;

// Every query that uses `localized` expects a `$lang` param ("fr" | "en").
export const queries = {
  // Get all projects with ordering
  projects: `
    *[_type == "project"] | order(coalesce(order, 999) asc, _createdAt desc) {
      ${projectProjection}
    }
  `,

  // Get single project by slug
  projectBySlug: `
    *[_type == "project" && slug.current == $slug][0] {
      ${projectProjection}
    }
  `,

  skillCategories: `
    *[_type == "skillCategory"] | order(coalesce(order, 999) asc) {
      _id,
      ${localized("name")},
      slug,
      ${localized("description")},
      skills[] {
        name,
        colorScheme,
        iconUrl,
        "icon": icon.asset->url
      },
      order
    }
  `,

  aboutContent: `
    *[_type == "aboutContent" && _id == "aboutContent"][0] {
      ${localized("presentation")},
      ${localized("hobbies")},
      ${localized("goals")}
    }
  `,

  experiences: `
    *[_type == "experience"] | order(coalesce(order, 999) asc, startDate desc) {
      ${timelineProjection("position", "company")}
    }
  `,

  educations: `
    *[_type == "education"] | order(coalesce(order, 999) asc, startDate desc) {
      ${timelineProjection("program", "institution")}
    }
  `,

  // Get all project slugs for static paths
  projectSlugs: `
    *[_type == "project"] {
      "slug": slug.current,
      _updatedAt
    }
  `,

  // ===== Public technical blog queries =====
  articlesByLanguage: `
    *[_type == "article" && language == $language && defined(publishedAt) && publishedAt <= now()]
      | order(featured desc, publishedAt desc) {
        _id, title, "slug": slug.current, language, excerpt, coverImage,
        publishedAt, updatedAt, featured,
        category->{_id, "slug": slug.current, titleFr, titleEn, descriptionFr, descriptionEn},
        "tags": coalesce(tags[]->{_id, "slug": slug.current, titleFr, titleEn}, [])
      }
  `,

  articleBySlug: `
    *[_type == "article" && language == $language && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0] {
      _id, title, "slug": slug.current, language, excerpt,
      "body": body[]{..., markDefs[]{..., reference->{title, "slug": slug.current, language}}},
      coverImage,
      publishedAt, updatedAt, author, featured, seoTitle, seoDescription,
      socialImage, externalCanonicalUrl,
      category->{_id, "slug": slug.current, titleFr, titleEn, descriptionFr, descriptionEn},
      "tags": coalesce(tags[]->{_id, "slug": slug.current, titleFr, titleEn}, []),
      translation->{_id, title, "slug": slug.current, language, publishedAt}
    }
  `,

  articlePaths: `
    *[_type == "article" && defined(publishedAt) && publishedAt <= now()] {
      "slug": slug.current,
      language,
      updatedAt,
      publishedAt,
      externalCanonicalUrl,
      coverImage,
      "categorySlug": category->slug.current,
      "tagSlugs": coalesce(tags[]->slug.current, [])
    }
  `,

  articleCategories: `
    *[_type == "articleCategory"] | order(titleFr asc) {
      _id, "slug": slug.current, titleFr, titleEn, descriptionFr, descriptionEn
    }
  `,

  articleTags: `
    *[_type == "articleTag"] | order(titleFr asc) {
      _id, "slug": slug.current, titleFr, titleEn
    }
  `,
} as const;
