import { createClient } from "@sanity/client";

// Environment variables with fallbacks
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || "9bdbnjzy";
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || "production";
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION || "2023-01-01";

// Centralized Sanity client configuration
export const sanityClient = createClient({
  projectId,
  dataset,
  useCdn: import.meta.env.PROD, // Use CDN in production for better performance
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

// Project-specific queries
export const queries = {
  // Get all projects with ordering
  projects: `
    *[_type == "project"] | order(coalesce(order, 999) asc, _createdAt desc) {
      _id,
      title,
      slug,
      summary,
      description,
      status,
      year,
      thumbnail,
      image1,
      image2,
      image3,
      technologies,
      features,
      challenges,
      githubUrl,
      liveUrl,
      featured,
      order
    }
  `,

  // Get single project by slug
  projectBySlug: `
    *[_type == "project" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      summary,
      description,
      status,
      year,
      thumbnail,
      image1,
      image2,
      image3,
      technologies,
      features,
      challenges,
      githubUrl,
      liveUrl,
      featured,
      order
    }
  `,

  // Get all project slugs for static paths
  projectSlugs: `
    *[_type == "project"] {
      "slug": slug.current
    }
  `,
} as const;