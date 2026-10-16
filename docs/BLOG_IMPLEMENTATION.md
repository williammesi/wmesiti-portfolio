# Technical blog implementation

## Repository assessment

- **Runtime:** Astro 5 in server mode with the standalone Node adapter on Railway. Public blog routes are prerendered.
- **CMS:** Sanity 5 is embedded at `/admin` through `@sanity/astro`. The public client uses the published perspective and no write token.
- **UI:** Tailwind CSS 4 and a Catppuccin Mocha-inspired dark palette. The shared `Layout` and `Navbar` are retained.
- **Existing blog:** The former category/password/weekly-log implementation was an SSR-only internship journal. It is replaced rather than migrated. Its remote Sanity records are not deleted.
- **SEO:** A shared SEO component and a custom dynamic sitemap already exist. Both are extended for localized article metadata.
- **Deployment:** Pushes trigger the existing host build. Publishing in Sanity therefore requires a new deployment unless a Sanity deploy hook is configured.
- **Quality tooling:** The repository has a production build command but no test runner or lint command.

## Implementation decisions

1. Public URLs are `/fr/blog/...` and `/en/blog/...`; `/blog` redirects permanently to `/fr/blog`.
2. Articles are independent Sanity documents linked by an optional reciprocal translation reference. The official internationalization plugin was evaluated, but its current release requires React 19.2 while this repository uses React 19.1. A small native-reference model avoids an unrelated framework upgrade and remains migratable to the plugin later.
3. Categories and tags are shared taxonomy documents with localized labels. Article slugs remain language-specific.
4. Public blog pages are prerendered from published Sanity documents. Pagefind indexes the resulting HTML after the Astro build and runs entirely in the browser.
5. Portable Text is rendered through dedicated Astro components. Shiki highlights code at build time and KaTeX renders equations without client-side processing.
6. The legacy Sanity document types are unregistered, not deleted from the dataset. No destructive content migration is performed.

## Build and publication workflow

1. Create and publish an article in Sanity Studio.
2. Trigger a Railway deployment manually, by pushing, or with a Sanity publication webhook.
3. `npm run build` generates public pages and then builds the Pagefind index in `dist/client/pagefind`.

Only published documents with a publication date at or before build time are queried, so drafts cannot be generated, indexed, or added to the sitemap.

## Authoring and translation

- Create a **Technical article**, choose `fr-CA` or `en`, and fill all required editorial fields.
- Add code, equation, image, table, and divider blocks directly in Portable Text.
- Create the translated article as a separate document, then set each document's **Translation** reference to its counterpart.
- Translation links are shown only when the referenced document is published.
- Categories and tags are managed independently and expose French and English labels.

## Environment and deployment

Supported public variables:

```env
PUBLIC_SANITY_PROJECT_ID=9bdbnjzy
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2025-09-23
PUBLIC_SITE_URL=https://wmesiti-tech.com
```

No privileged Sanity token is needed or exposed. If content must appear immediately after publication, configure a Sanity webhook to call the hosting provider's deploy hook.

## Known limitations

- Search is available after a production build; development mode does not generate a Pagefind index.
- Translation references are editorially linked rather than enforced as reciprocal by Sanity.
- Pagefind indexes prerendered blog content only. A build that cannot reach Sanity will contain the localized empty states but no article pages.

## Verification

- `npx sanity schema validate`: passed with no schema errors or warnings.
- `npm run build`: passed, including French/English route prerendering and Pagefind generation for Railway's `dist/client` static directory.
- Local production-page audit: Accessibility 96, Best Practices 100, SEO 100. The remaining audit finding is a low-contrast secondary-text instance inherited from the site's visual palette.
- `astro check` was evaluated but currently fails on pre-existing errors in unrelated files such as `ProjectDetail.astro`, `404.astro`, and the Vite dependency types. No diagnostic was reported in the new blog files.
- No new `article` documents currently exist in the production dataset, so the built indexes correctly show their localized empty state. A representative rich-content article must be published before the content-specific acceptance scenarios can be exercised end to end.
- `npm audit` reports existing transitive dependency findings. No automatic force upgrade was applied because that would introduce unrelated breaking changes.
