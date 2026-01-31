/**
 * Simplified authentication using Astro's cookies API
 * Based on official Astro documentation
 */

import type { AstroCookies } from "astro";

// Hash a password using SHA-256
export async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Verify a password against a stored hash
export async function verifyPassword(
    password: string,
    storedHash: string
): Promise<boolean> {
    const inputHash = await hashPassword(password);
    return inputHash === storedHash;
}

// Cookie name for category authentication
export function getAuthCookieName(categorySlug: string): string {
    return `blog_auth_${categorySlug}`;
}

// Create a simple session token
export function createSessionToken(categorySlug: string): string {
    const timestamp = Date.now().toString();
    // Simple token: just category and timestamp encoded
    const token = btoa(`${categorySlug}:${timestamp}`);
    return token;
}

// Validate a session token
export function validateSessionToken(
    token: string,
    categorySlug: string
): boolean {
    try {
        const decoded = atob(token);
        const [slug, timestamp] = decoded.split(":");

        // Check if the category matches
        if (slug !== categorySlug) {
            return false;
        }

        // Check if token has expired (7 days)
        const tokenAge = Date.now() - parseInt(timestamp);
        const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

        if (tokenAge > MAX_AGE || tokenAge < 0) {
            return false;
        }

        return true;
    } catch {
        return false;
    }
}

// Set authentication cookie using Astro's cookies API
export function setAuthCookie(cookies: AstroCookies, categorySlug: string) {
    const token = createSessionToken(categorySlug);
    const cookieName = getAuthCookieName(categorySlug);
    const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds

    cookies.set(cookieName, token, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: import.meta.env.PROD,
        maxAge: maxAge,
    });
}

// Check if user has valid authentication cookie
export function hasValidAuth(cookies: AstroCookies, categorySlug: string): boolean {
    const cookieName = getAuthCookieName(categorySlug);
    const cookie = cookies.get(cookieName);

    if (!cookie || !cookie.value) {
        return false;
    }

    return validateSessionToken(cookie.value, categorySlug);
}

// Clear authentication cookie
export function clearAuthCookie(cookies: AstroCookies, categorySlug: string) {
    const cookieName = getAuthCookieName(categorySlug);
    cookies.delete(cookieName, {
        path: "/",
    });
}
