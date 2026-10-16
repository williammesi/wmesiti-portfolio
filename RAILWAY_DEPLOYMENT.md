# Railway deployment

## Production configuration

- Canonical origin: `https://wmesiti-tech.com`
- Runtime: Astro standalone Node adapter
- Build command: `npm run build`
- Start command: `npm start`
- Health/runtime port: Railway supplies `PORT` automatically

Configure these Railway variables:

```env
PUBLIC_SITE_URL=https://wmesiti-tech.com
PUBLIC_SANITY_PROJECT_ID=9bdbnjzy
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2025-09-23
```

`PUBLIC_SITE_URL` is also hard-coded as a safe production fallback. It controls canonical links, structured data, sitemap URLs, RSS links, and social metadata.

## Domain configuration

1. Add `wmesiti-tech.com` as the Railway custom domain and configure the DNS records Railway provides.
2. Enable Railway's HTTPS certificate.
3. If `www.wmesiti-tech.com` is configured, point it to the same service. Application middleware permanently redirects it to the apex domain.
4. Redirect any previous public domain to `https://wmesiti-tech.com` with a permanent 301 or 308 redirect if you still control that domain.

## Publishing

Blog pages, `sitemap.xml`, `rss.xml`, and the Pagefind index are generated during the build. Publishing or updating a Sanity article therefore requires a Railway redeploy. Configure a Sanity webhook to trigger Railway after publication so all generated assets remain synchronized.

## Search launch checklist

After the domain is live:

1. Confirm successful `200` responses for `/robots.txt`, `/sitemap.xml`, and `/rss.xml`.
2. Add the domain property in Google Search Console and submit `https://wmesiti-tech.com/sitemap.xml`.
3. Add the site in Bing Webmaster Tools and submit the same sitemap.
4. Inspect one French and one English article URL in Search Console.
5. Validate an article with Google's Rich Results Test.
6. Ensure HTTP and `www` requests permanently redirect to the HTTPS apex domain without a redirect chain.
