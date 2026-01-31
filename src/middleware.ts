/**
 * Edge Middleware for blog authentication
 * Runs at the edge before serverless functions, ensuring reliable cookie handling
 */
import { defineMiddleware } from "astro:middleware";
import { validateSessionToken, getAuthCookieName } from "./lib/auth";
import { sanityFetch, queries } from "./lib/sanity";
import type { BlogCategory } from "./types/sanity";

// Helper to parse cookies from header
function parseCookies(cookieHeader: string): Record<string, string> {
    const cookies: Record<string, string> = {};
    const pairs = cookieHeader.split(";");

    for (const pair of pairs) {
        const [name, ...rest] = pair.trim().split("=");
        if (name) {
            cookies[name] = rest.join("=");
        }
    }

    return cookies;
}

// Helper to check if a category is protected
async function isCategoryProtected(categorySlug: string): Promise<boolean> {
    try {
        const categoryData = await sanityFetch<BlogCategory | null>(
            queries.blogCategoryBySlugPublic,
            { slug: categorySlug }
        );
        return categoryData?.isProtected ?? false;
    } catch (error) {
        console.error("[Middleware] Error fetching category:", error);
        return false;
    }
}

export const onRequest = defineMiddleware(async (context, next) => {
    const { url, request, redirect } = context;
    const pathname = url.pathname;

    // Only process /blog/[category] routes (not /blog itself)
    const blogCategoryMatch = pathname.match(/^\/blog\/([^\/]+)(\/.*)?$/);

    if (!blogCategoryMatch) {
        return next();
    }

    const [, categorySlug, subPath] = blogCategoryMatch;
    const isLoginPage = pathname.includes("/login");

    console.log("[Middleware] Processing path:", pathname, "- Category:", categorySlug);

    // Check if this category is protected
    const isProtected = await isCategoryProtected(categorySlug);

    if (!isProtected) {
        console.log("[Middleware] Category is public:", categorySlug);
        return next();
    }

    // Category is protected - check for valid session
    const cookieHeader = request.headers.get("cookie");
    const cookies = cookieHeader ? parseCookies(cookieHeader) : {};
    const cookieName = getAuthCookieName(categorySlug);
    const token = cookies[cookieName];
    const hasValidToken = token ? await validateSessionToken(token, categorySlug) : false;

    // If on login page
    if (isLoginPage) {
        // If already authenticated, redirect to category page
        if (hasValidToken) {
            console.log("[Middleware] Already authenticated, redirecting from login");
            return redirect(`/blog/${categorySlug}`);
        }
        // Otherwise, allow access to login page
        return next();
    }

    // Not on login page - require authentication
    if (!hasValidToken) {
        console.log("[Middleware] Not authenticated, redirecting to login");
        return redirect(`/blog/${categorySlug}/login`);
    }

    console.log("[Middleware] Auth successful for category:", categorySlug);
    return next();
});
