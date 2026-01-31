/**
 * Authentication utilities for password-protected blog categories
 * Uses SHA-256 hashing for secure password storage and session cookies for browser auth
 */

// Hash a password using SHA-256 (Web Crypto API - works in both browser and Node.js/Vercel Edge)
export async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
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

// Create a signed session token for a category
// Using a simple HMAC-like signature with the category slug and a timestamp
export async function createSessionToken(categorySlug: string): Promise<string> {
    const timestamp = Date.now().toString();
    const payload = `${categorySlug}:${timestamp}`;

    // Create a signature using the category slug as part of the key
    // This is a simple approach - for production, use a proper secret key from env
    const secret = import.meta.env.BLOG_AUTH_SECRET || "portfolio-blog-auth-2024";
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(payload)
    );

    const signatureHex = Array.from(new Uint8Array(signature))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    // Token format: payload.signature (base64 encoded for safety)
    const token = btoa(`${payload}:${signatureHex}`);
    return token;
}

// Validate a session token
export async function validateSessionToken(
    token: string,
    categorySlug: string
): Promise<boolean> {
    try {
        const decoded = atob(token);
        const [slug, timestamp, signature] = decoded.split(":");

        // Check if the category matches
        if (slug !== categorySlug) {
            return false;
        }

        // Recreate the signature to verify
        const payload = `${slug}:${timestamp}`;
        const secret = import.meta.env.BLOG_AUTH_SECRET || "portfolio-blog-auth-2024";
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            "raw",
            encoder.encode(secret),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
        );

        const expectedSignature = await crypto.subtle.sign(
            "HMAC",
            key,
            encoder.encode(payload)
        );

        const expectedHex = Array.from(new Uint8Array(expectedSignature))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");

        return signature === expectedHex;
    } catch {
        return false;
    }
}

// Check if the current request has a valid session for a category
export async function hasValidSession(
    request: Request,
    categorySlug: string
): Promise<boolean> {
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) {
        console.log("[Auth] No cookie header found for category:", categorySlug);
        return false;
    }

    const cookieName = getAuthCookieName(categorySlug);
    const cookies = parseCookies(cookieHeader);
    const token = cookies[cookieName];

    if (!token) {
        console.log("[Auth] No token found for category:", categorySlug, "- Available cookies:", Object.keys(cookies));
        return false;
    }

    const isValid = await validateSessionToken(token, categorySlug);
    console.log("[Auth] Token validation result for category:", categorySlug, "- Valid:", isValid);
    return isValid;
}

// Parse cookies from a cookie header string
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

// Create a Set-Cookie header value for authentication
// Session cookie (no Max-Age = expires when browser closes)
export async function createAuthCookieHeader(
    categorySlug: string
): Promise<string> {
    const token = await createSessionToken(categorySlug);
    const cookieName = getAuthCookieName(categorySlug);

    // Session cookie settings:
    // - No Max-Age or Expires = session cookie (deleted when browser closes)
    // - HttpOnly = not accessible via JavaScript
    // - SameSite=Lax = CSRF protection while allowing navigation
    // - Secure in production
    // - Path=/ for broader availability (fixes Vercel serverless issues)
    const secure = import.meta.env.PROD ? "; Secure" : "";

    return `${cookieName}=${token}; Path=/; HttpOnly; SameSite=Lax${secure}`;
}

// Create a cookie header to clear authentication
export function createLogoutCookieHeader(categorySlug: string): string {
    const cookieName = getAuthCookieName(categorySlug);
    const secure = import.meta.env.PROD ? "; Secure" : "";

    return `${cookieName}=; Path=/; HttpOnly; SameSite=Lax${secure}; Max-Age=0`;
}
