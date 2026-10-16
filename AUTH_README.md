# Protected Blog Categories Authentication

## Overview

This portfolio uses a simple authentication system for protected blog categories. Passwords are stored in Sanity CMS (hashed with SHA-256), and users authenticate through a login page.

## How It Works

1. **Password in Sanity**: Each protected category has a `passwordHash` field in Sanity
2. **Login Page**: Users visit `/blog/[category]/login` to enter the password
3. **Cookie Session**: Once authenticated, a cookie is set for 7 days
4. **Per-Category Auth**: Each category has its own authentication (separate cookies)

## Setup

### 1. Configure Category in Sanity CMS

For any blog category you want to protect:

1. Set `isProtected` to `true`
2. Set `passwordHash` to the SHA-256 hash of your desired password

**Generate SHA-256 hash:**
```javascript
// In browser console or Node.js
const password = "your-password-here";
const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
const hashArray = Array.from(new Uint8Array(hash));
const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
console.log(hashHex);
```

Or use an online SHA-256 generator.

### 2. No Environment Variables Needed

Unlike the previous implementation, this doesn't require any environment variables. Everything is managed through Sanity CMS.

## Usage

### Accessing Protected Content

1. User visits a protected category: `https://yourdomain.com/blog/protected-category`
2. They're redirected to: `https://yourdomain.com/blog/protected-category/login`
3. User enters the password in the login form
4. If correct:
   - Cookie is set for 7 days
   - User is redirected back to the category
   - Can now access all posts and logs in that category

5. If incorrect:
   - Error message is displayed
   - User can try again

### Protected Pages

The following pages check authentication:
- `/blog/[category]/` - Category listing page (redirects to login)
- `/blog/[category]/[slug]` - Individual blog posts (redirects to login)
- `/blog/[category]/log/[slug]` - Weekly logs (redirects to login)

### Login Page

Each protected category has its own login page:
- `/blog/[category]/login`

## Security Features

- **SHA-256 Password Hashing**: Passwords are hashed before storage in Sanity
- **HttpOnly Cookies**: Cookies are HttpOnly to prevent XSS attacks
- **Secure in Production**: Cookies use Secure flag in production (HTTPS only)
- **SameSite Protection**: Cookies use SameSite=Lax to prevent CSRF
- **No Database Required**: Stateless authentication perfect for Vercel
- **Per-Category Isolation**: Each category has separate authentication

## Benefits

✅ **Simple**: No environment variables or complex configuration
✅ **Vercel-Friendly**: Works perfectly with Vercel's serverless functions
✅ **Secure**: Uses modern cookie security practices and password hashing
✅ **User-Friendly**: Login once, stay authenticated for 7 days
✅ **Manageable**: Change passwords directly in Sanity CMS
✅ **Per-Category**: Different passwords for different categories

## Changing Passwords

To change a category's password:
1. Generate new SHA-256 hash of the new password
2. Update the `passwordHash` field in Sanity for that category
3. Existing sessions remain valid until cookies expire

## Removing Protection

To make a category public:
1. Go to Sanity CMS
2. Set `isProtected` to `false` for the category
3. Content becomes immediately accessible to everyone

## Cookie Duration

- **Current**: 7 days
- **Configurable**: Edit `COOKIE_MAX_AGE` in `src/lib/auth.ts`

## Notes

- This is basic protection suitable for sharing content with specific people
- SHA-256 is used for compatibility with Sanity's existing data
- For high-security requirements, consider a full authentication system with user accounts
- Passwords are stored hashed in Sanity, which is already behind authentication
