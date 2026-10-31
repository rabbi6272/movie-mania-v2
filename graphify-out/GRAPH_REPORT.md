# Graph Report - movie-mania-v2  (2026-10-31)

## Corpus Check
- Corpus is ~21,624 words - fits in a single context window. You may not need a graph.

## Summary
- 465 nodes · 1094 edges · 24 communities (14 shown, 10 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.83)
- Token cost: 334,490 input · 0 output

## Community Hubs (Navigation)
- Root Layout & Detail Routes
- Home & Playlist UI
- Tooling & Dependencies
- TMDB API Client
- Search & Pagination
- OG & Icon Images
- Glass Navbar & Fonts
- Auth & Page Shells
- Playlist Sharing
- Movie Detail Page
- shadcn Config
- TypeScript Config
- Server Firestore Reads
- SEO Docs (README)
- JS Path Aliases
- App Icon Branding
- PostCSS Config
- Starter File Icon
- Starter Globe Icon
- Menu Icon
- Next.js Logo
- Starter Window Icon
- Vercel Logo
- PWA Manifest Note

## God Nodes (most connected - your core abstractions)
1. `next` - 34 edges
2. `react` - 27 edges
3. `SeparateMoviePage()` - 25 edges
4. `useAuth()` - 23 edges
5. `Button()` - 19 edges
6. `fetchFromTMDB()` - 18 edges
7. `PlaylistDetailClient()` - 17 edges
8. `compilerOptions` - 16 edges
9. `absoluteUrl()` - 15 edges
10. `SmallMovieCard` - 14 edges

## Surprising Connections (you probably didn't know these)
- `SeparateMoviePage()` --indirect_call--> `normalizeMovieForCard()`  [INFERRED]
  components/SeparateMoviePage.tsx → api/tmdb.ts
- `useSearchMovies()` --indirect_call--> `normalizeMovieForCard()`  [INFERRED]
  hooks/useSearchMovies.ts → api/tmdb.ts
- `PlaylistDetailPage()` --calls--> `PlaylistDetailClient()`  [EXTRACTED]
  app/playlists/[id]/page.tsx → components/playlists/PlaylistDetailClient.tsx
- `PlaylistCard()` --calls--> `getPosterURL()`  [EXTRACTED]
  components/playlists/PlaylistCard.tsx → api/tmdb.ts
- `PlaylistDetailClient()` --calls--> `getPosterURL()`  [EXTRACTED]
  components/playlists/PlaylistDetailClient.tsx → api/tmdb.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Crawler-facing SEO surface** — app_robots, app_sitemap, readme_app_manifest, readme_per_route_robots [EXTRACTED 1.00]
- **Detail page metadata/OG/JSON-LD flow from TMDB** — readme_detail_pages, readme_lib_detail, readme_api_tmdb, components_seo_detailogimage, readme_structured_data [INFERRED 0.85]

## Communities (24 total, 10 thin omitted)

### Community 0 - "Root Layout & Detail Routes"
Cohesion: 0.08
Nodes (45): metadata, organizationJsonLd, RootLayout(), viewport, websiteJsonLd, manifest(), generateMetadata(), generateStaticParams() (+37 more)

### Community 1 - "Home & Playlist UI"
Cohesion: 0.10
Nodes (40): metadata, NotFound(), EmptyLibrary(), GuestHeroSection(), HomeClient(), AddToPlaylistItem, AddToPlaylistModal(), handleToggle() (+32 more)

### Community 2 - "Tooling & Dependencies"
Cohesion: 0.05
Nodes (47): compat, __dirname, eslintConfig, __filename, dependencies, framer-motion@^12.7.4, @heroui/react@^3.2.7, @heroui/styles@^3.2.7 (+39 more)

### Community 3 - "TMDB API Client"
Cohesion: 0.09
Nodes (33): DETAIL_CACHE, DiscoverFilters, discoverMovies(), fetchFromTMDB(), getAuthHeaders(), getGenres(), getMovieDetails(), getMovieDetailsCached() (+25 more)

### Community 4 - "Search & Pagination"
Cohesion: 0.12
Nodes (24): getPosterURL(), searchMulti(), metadata, SearchPage(), MEDIA_FILTERS, SearchClient(), SUGGESTED_SEARCHES, Pagination() (+16 more)

### Community 5 - "OG & Icon Images"
Cohesion: 0.08
Nodes (29): AppleIcon(), contentType, size, alt, contentType, Image(), revalidate, size (+21 more)

### Community 6 - "Glass Navbar & Fonts"
Cohesion: 0.08
Nodes (30): nunito, ttTrailer, curve(), deriveActive(), IconNav(), Ind, NavItem, overshoot() (+22 more)

### Community 7 - "Auth & Page Shells"
Cohesion: 0.13
Nodes (16): LoginPage(), metadata, PageProps, PlaylistDetailPage(), metadata, SignupPage(), AuthCard(), AuthPasswordField() (+8 more)

### Community 8 - "Playlist Sharing"
Cohesion: 0.20
Nodes (18): SharePlaylistModal(), handleCopy(), handleGenerate(), handleRevoke(), invalidatePlaylistQueries(), createShareLink(), generateToken(), getSharedPlaylist() (+10 more)

### Community 9 - "Movie Detail Page"
Cohesion: 0.23
Nodes (15): getBackdropURL(), normalizeMovieForMinimal(), DetailSkeleton(), SeparateMoviePage(), handleAddToWatched(), handleAddToWatchlist(), handleDelete(), SimilarMovies() (+7 more)

### Community 10 - "shadcn Config"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 11 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 12 - "Server Firestore Reads"
Cohesion: 0.22
Nodes (15): buildUrl(), decodeFields(), decodeValue(), documentPath(), env(), FirestoreDocument, firestoreFetch(), FirestoreValue (+7 more)

### Community 13 - "SEO Docs (README)"
Cohesion: 0.22
Nodes (8): generate-agent-files.js (next dev), node_modules/next/dist/docs guides, Next.js Agent Rules (breaking-changes notice), app/layout.tsx (root layout metadata), buildJsonLd(), getSiteUrl(), lib/seo.ts (site config single source of truth), INDEXABLE_ROBOTS / NOINDEX_ROBOTS

## Knowledge Gaps
- **22 isolated node(s):** `node_modules/next/dist/docs guides`, `generate-agent-files.js (next dev)`, `MovieMania V2`, `app/manifest.ts + app/apple-icon.tsx`, `SeparateMoviePage (client body)` (+17 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 146 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Auth & Page Shells` to `Root Layout & Detail Routes`, `Home & Playlist UI`, `Tooling & Dependencies`, `TMDB API Client`, `Search & Pagination`, `OG & Icon Images`, `Glass Navbar & Fonts`, `Movie Detail Page`, `Server Firestore Reads`?**
  _High betweenness centrality (0.223) - this node is a cross-community bridge._
- **What connects `node_modules/next/dist/docs guides`, `generate-agent-files.js (next dev)`, `MovieMania V2` to the rest of the system?**
  _22 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Root Layout & Detail Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.08145363408521303 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Search & Pagination` to `Root Layout & Detail Routes`, `Home & Playlist UI`, `Tooling & Dependencies`, `TMDB API Client`, `Glass Navbar & Fonts`, `Auth & Page Shells`, `Playlist Sharing`, `Movie Detail Page`, `Server Firestore Reads`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Should `Home & Playlist UI` be split into smaller, more focused modules?**
  _Cohesion score 0.10412299091544375 - nodes in this community are weakly interconnected._
- **Why does `useAuth()` connect `Home & Playlist UI` to `Search & Pagination`, `Glass Navbar & Fonts`, `Auth & Page Shells`, `Playlist Sharing`, `Movie Detail Page`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `Tooling & Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05019607843137255 - nodes in this community are weakly interconnected._