/**
 * Simple authentication for protected blog categories
 * Uses password from Sanity + cookies for session management
 */

import type { AstroCookies } from "astro";

const AUTH_COOKIE_NAME = "blog_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Hash password using SHA-256 (matches Sanity's storage format)
 */
export async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Verify password against stored hash
 */
export async function verifyPassword(
    password: string,
    storedHash: string
): Promise<boolean> {
    const inputHash = await hashPassword(password);
    return inputHash === storedHash;
}

/**
 * Set authentication cookie for a specific category
 */
export function setAuthCookie(cookies: AstroCookies, categorySlug: string): void {
    const cookieName = `${AUTH_COOKIE_NAME}_${categorySlug}`;
    cookies.set(cookieName, "authenticated", {
        path: "/",
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE,
    });
}

/**
 * Generate Set-Cookie header string for manual Response creation
 * (needed for Vercel compatibility with redirects)
 */
export function getAuthCookieHeader(categorySlug: string): string {
    const cookieName = `${AUTH_COOKIE_NAME}_${categorySlug}`;
    const secure = import.meta.env.PROD ? "; Secure" : "";
    return `${cookieName}=authenticated; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}${secure}`;
}

/**
 * Check if user is authenticated for a specific category
 */
export function isAuthenticated(cookies: AstroCookies, categorySlug: string): boolean {
    const cookieName = `${AUTH_COOKIE_NAME}_${categorySlug}`;
    const authCookie = cookies.get(cookieName);
    return authCookie?.value === "authenticated";
}

/**
 * Clear authentication cookie for a specific category
 */
export function clearAuthCookie(cookies: AstroCookies, categorySlug: string): void {
    const cookieName = `${AUTH_COOKIE_NAME}_${categorySlug}`;
    cookies.delete(cookieName, { path: "/" });
}
