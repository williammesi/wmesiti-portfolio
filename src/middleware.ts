import { defineMiddleware } from "astro:middleware";

const CANONICAL_HOST = "wmesiti-tech.com";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  // Consolidate the optional www host into the canonical apex domain.
  if (url.hostname === `www.${CANONICAL_HOST}`) {
    url.protocol = "https:";
    url.hostname = CANONICAL_HOST;
    url.port = "";
    return context.redirect(url.href, 308);
  }

  const response = await next();
  if (url.pathname === "/admin" || url.pathname.startsWith("/admin/")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  return response;
});
