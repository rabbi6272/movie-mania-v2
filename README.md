# MovieMania V2

A Next.js (App Router) app for searching movies and TV shows, checking ratings and trailers, and building shareable playlists.

```bash
npm install
npm run dev   # http://localhost:3000
npm run build && npm start
```

Production: `https://moviemaniav2.vercel.app`

---

## SEO layer

The work in this pass was a full SEO layer: per-route metadata, canonicals, robots/sitemap, structured data, dynamic Open Graph images, crawlable navigation, and explicit index/noindex controls — without moving the detail pages into a server-rendered data fetch.

### Site configuration

- **`lib/seo.ts`** — single source of truth:
  - `getSiteUrl()` resolves the origin from `NEXT_PUBLIC_SITE_URL` → `NEXT_PUBLIC_BASE_URL` → `VERCEL_URL` → `http://localhost:3000` (adds a protocol if missing, strips the trailing slash).
  - Site title/description/OG defaults, `TWITTER_HANDLE`, `absoluteUrl()`, `DEFAULT_OG_IMAGE`.
  - `INDEXABLE_ROBOTS` and `NOINDEX_ROBOTS` used by every route.
  - `buildJsonLd()` for structured-data payloads.
- `.env.local` sets `NEXT_PUBLIC_SITE_URL=https://moviemaniav2.vercel.app`.
- Titles use the template `"%s | MovieMania"`; the home page overrides it with `title: { absolute: … }`.

### `app/layout.tsx` (renamed from `layout.jsx`)

Next 16 rejects `import type` in `.jsx`, so the layout became TypeScript. It now exports full `Metadata` (`metadataBase`, description, OG/Twitter defaults, icons) plus JSON-LD for `WebSite` and `Organization` with a `SearchAction` (`?q={search_term_string}`).

Deliberate omissions:

- **No site-wide `robots`.** Next emits `noindex` on the 404 route itself; a global tag would conflict with it. Robots are set per route instead.
- **No `openGraph.title` / `description`.** Leaving them off lets Next fall back to each page's own metadata, so child routes aren't overwritten by the layout.

### Crawler files

- **`app/robots.ts`** — `Allow: /`, `Host`, `Sitemap`. No `Disallow`, so `noindex` pages stay crawlable and pick up their meta tag. `public/robots.txt` was deleted.
- **`app/sitemap.ts`** — `/`, `/search`, 50 movie detail URLs, 50 TV detail URLs (102 entries), `revalidate = 1800`. `public/sitemap.xml` was deleted.
- **`app/manifest.ts`**, **`app/apple-icon.tsx`** — web manifest and Apple touch icon.

### Route-level metadata and index control

| Route | Robots | Metadata |
| --- | --- | --- |
| `/` | index, follow | absolute title + home description |
| `/search` | index, follow | `?q=` aware title and description |
| `/movie/[id]`, `/tv/[id]` | index, follow | title, description, OG, JSON-LD from TMDB |
| `/share/[token]` | index, follow | playlist title/description/poster from Firestore |
| `/login`, `/signup` | noindex, nofollow | own titles and descriptions |
| `/playlists/[id]` | noindex, nofollow | private playlist shell |
| 404 | noindex | `app/not-found.tsx` |

### Detail pages

`app/movie/[id]/page.tsx` and `app/tv/[id]/page.tsx` are thin server shells:

- `generateMetadata` builds the title, description, canonical and OG image from TMDB.
- `generateStaticParams` pre-renders 50 IDs each (50 SSG paths per type), `revalidate = 3600`.
- `notFound()` is thrown when the TMDB fetch reports `status === 404`.
- `SeparateMoviePage` (the client body) was **not** restructured for SSR — only the shell around it changed.

Shared logic lives in **`lib/detail.ts`**: `parseId`, a cached `getDetail`, `buildDetailMetadata`, and `buildDetailJsonLd` (`Movie`/`TVSeries` + `BreadcrumbList`). `lib/popular.ts` provides `getPopularList(mediaType, limit)` which pulls multiple TMDB pages (20 per page) for the sitemap and static params.

### Dynamic Open Graph images

Rendered with `next/og` at request time:

- `app/opengraph-image.tsx` — default site card.
- `app/movie/[id]/opengraph-image.tsx`, `app/tv/[id]/opengraph-image.tsx` — title, year, rating (`revalidate = 3600`).
- `components/seo/DetailOgImage.tsx` — shared renderer; `components/seo/ogFonts.ts` loads the fonts.
- The share page points `og:image` at the playlist's first TMDB poster (w780) instead of a generated card, falling back to the default site image.

Fonts: `public/fonts/Nunito.ttf` is a **variable** font, which satori cannot parse. Static subsets were generated with fontTools:

- `public/fonts/Nunito-Regular.ttf` (wght 400, latin, ~24.5 KB)
- `public/fonts/Nunito-ExtraBold.ttf` (wght 800, latin, ~24.5 KB)

These subsets omit `★` (U+2605) and `•` (U+2022) — do not use those glyphs in OG images.

### Server/client page split

Pages that need metadata became server components wrapping their existing client bodies:

- `app/search/page.tsx` + `app/search/SearchClient.tsx` (Suspense + `?q=` seeding via `useSearchParams`, sr-only results `h1`)
- `app/login/page.tsx` + `components/auth/LoginForm.tsx`
- `app/signup/page.tsx` + `components/auth/SignupForm.tsx`
- `app/playlists/[id]/page.tsx` + `components/playlists/PlaylistDetailClient.tsx`
- `app/share/[token]/page.tsx` + `components/share/SharedPlaylistClient.tsx`

### Share-page metadata

`lib/share.ts` exposes `getSharedPlaylistServer(token)`, wrapped in React `cache()`:

- Uses the **Firestore REST API** (`/v1/projects/…/documents/…`) instead of the browser-only client SDK, so it runs in a Node server component.
- `getDocument` (`shares/{token}` → `playlists/{id}`) and `getCollection` (`playlists/{id}/items`, `pageSize=300`).
- Each request has a 5 s `AbortSignal.timeout`, one retry, and `next: { revalidate: 60 }`.
- **Any failure returns `null`**, so the page falls back to generic metadata instead of erroring. Non-2xx responses other than 404 are logged with the failing path.

> Note: playlists are readable by ID but the collection has no list permission, so a stale share token pointing at a deleted playlist renders with fallback metadata. That is the intended behaviour.

### Crawlable navigation

- `components/navbar.tsx` — the search entry point is a real `href="/search"` link, and the brand mark is no longer an `h1` (page-level `h1`s are reserved for real headings).
- `components/ui/Button.tsx` — added `href` and `ariaLabel` support.
- `app/page.tsx` + `components/home/HomeClient.tsx` — server home shell with an sr-only `h1` for the logged-in state.
- `hooks/useShareServices.ts` — `shareUrl` now uses `getSiteUrl()` instead of `window.location`.

### Structured data

`components/seo/JsonLd.tsx` renders JSON-LD script tags.

- Site-wide: `WebSite` + `Organization` (+ `SearchAction`, `EntryPoint`).
- Detail pages: `Movie` or `TVSeries` with `AggregateRating` + `BreadcrumbList`.
- Share page: `CollectionPage` + `ItemList`.
- Detail data follows the original decision **not** to fetch the detail body on the server, so JSON-LD uses the same TMDB detail response already available to the shell.

---

## Supporting changes

- **`api/tmdb.js` → `api/tmdb.ts`** — the module was renamed and is now type-checked. Added `TmdbParams`, `TmdbFetchOptions`, a `TmdbError` class carrying the HTTP status (replacing an ad-hoc `error.status` assignment), an `AbortSignal`-compatible `fetchFromTMDB`, an exported `DiscoverFilters` interface, and annotations on the public exports. Runtime behaviour is unchanged.
- Static OG fonts under `public/fonts/` (see above).
- Deleted the placeholder `public/robots.txt` and `public/sitemap.xml`.

## Verification

`npm run lint` cannot be used here: Next 16 removed `next lint`, and invoking ESLint directly fails with `TypeError: Converting circular structure to JSON` (pre-existing, unrelated to these changes). Use:

```bash
npx tsc --noEmit
npm run build
```

Both pass. The build output includes `/` (static), `/search` (static), 50 SSG paths each for `/movie/[id]` and `/tv/[id]` plus their dynamic OG routes, `/robots.txt`, `/sitemap.xml`, `/share/[token]` and `/playlists/[id]` (dynamic), and static `/login` + `/signup`.

Smoke-checked against `next start`:

- Per-route `<title>`, `description`, `robots`, `canonical`, `og:title`, `og:image`, `twitter:card`.
- `/login`, `/signup`, `/playlists/abc` → `noindex, nofollow`; `/nope` → `noindex`.
- `robots.txt` reports `Allow: /` plus `Host` and `Sitemap`; sitemap has 102 URLs.
- `/` emits `WebSite`/`Organization`/`SearchAction`; `/movie/27205` adds `Movie`, `AggregateRating`, `BreadcrumbList`.
- `manifest.webmanifest` resolves with absolute icon URLs.
