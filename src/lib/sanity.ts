import { createClient } from "@sanity/client";

// Environment variables with fallbacks
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || "9bdbnjzy";
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || "production";
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION || "2023-01-01";

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

  // ===== Blog Queries =====

  // Get all blog categories (public info only, no password hash)
  blogCategories: `
    *[_type == "blogCategory"] | order(coalesce(order, 999) asc, _createdAt desc) {
      _id,
      title,
      slug,
      description,
      isProtected,
      order,
      "postCount": count(*[_type in ["blogPost", "weeklyLog"] && references(^._id)])
    }
  `,

  // Get single category by slug (includes password hash for auth)
  blogCategoryBySlug: `
    *[_type == "blogCategory" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      description,
      isProtected,
      passwordHash,
      order
    }
  `,

  // Get single category by slug (public, no password hash)
  blogCategoryBySlugPublic: `
    *[_type == "blogCategory" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      description,
      isProtected,
      order
    }
  `,

  // Get all blog posts for a category
  blogPostsByCategory: `
    *[_type == "blogPost" && category->slug.current == $categorySlug] | order(coalesce(order, 999) asc, publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      coverImage,
      publishedAt,
      featured,
      order,
      category->{
        title,
        slug,
        isProtected
      }
    }
  `,

  // Get single blog post by slug
  blogPostBySlug: `
    *[_type == "blogPost" && slug.current == $slug && category->slug.current == $categorySlug][0] {
      _id,
      title,
      slug,
      excerpt,
      content,
      coverImage,
      publishedAt,
      featured,
      order,
      category->{
        _id,
        title,
        slug,
        isProtected
      }
    }
  `,

  // Get all blog post paths for static generation
  blogPostPaths: `
    *[_type == "blogPost"] {
      "slug": slug.current,
      "categorySlug": category->slug.current
    }
  `,

  // Get all category slugs for static paths
  blogCategorySlugs: `
    *[_type == "blogCategory"] {
      "slug": slug.current
    }
  `,

  // ===== Weekly Log Queries =====

  // Get all weekly logs for a category
  weeklyLogsByCategory: `
    *[_type == "weeklyLog" && category->slug.current == $categorySlug] | order(weekNumber desc) {
      _id,
      title,
      slug,
      weekNumber,
      publishedAt,
      category->{
        title,
        slug,
        isProtected
      }
    }
  `,

  // Get single weekly log by slug
  weeklyLogBySlug: `
    *[_type == "weeklyLog" && slug.current == $slug && category->slug.current == $categorySlug][0] {
      _id,
      title,
      slug,
      weekNumber,
      publishedAt,
      part1Tasks,
      part2SupervisorQA,
      part3TeacherQA,
      part4Notes,
      category->{
        _id,
        title,
        slug,
        isProtected
      }
    }
  `,

  // Get all weekly log paths for static generation
  weeklyLogPaths: `
    *[_type == "weeklyLog"] {
      "slug": slug.current,
      "categorySlug": category->slug.current
    }
  `,

  // Get all content for a category (both blog posts and weekly logs)
  allContentByCategory: `
    {
      "posts": *[_type == "blogPost" && category->slug.current == $categorySlug] | order(publishedAt desc) {
        _id,
        _type,
        title,
        slug,
        excerpt,
        coverImage,
        publishedAt,
        featured
      },
      "weeklyLogs": *[_type == "weeklyLog" && category->slug.current == $categorySlug] | order(weekNumber desc) {
        _id,
        _type,
        title,
        slug,
        weekNumber,
        publishedAt
      }
    }
  `,
} as const;