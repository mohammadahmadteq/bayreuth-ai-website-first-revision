# Bayreuth AI Association website

The association's website uses React, TypeScript, Mantine, React Router, Lingui, Vite, and Supabase. Partners, team members, events, and association photos come from Supabase. The existing local content is the initial fallback when the project is not configured or cannot be reached.

## Development

Use Bun to install dependencies and keep `bun.lock` current:

```sh
bun install
bun run dev
```

With dependencies already installed, the scripts also work with `npm run`.

| Command                   | Purpose                                                       |
| ------------------------- | ------------------------------------------------------------- |
| `bun run dev`             | Start the development server                                  |
| `bun run build`           | Type-check and create the production build                    |
| `bun run dev:admin`       | Start the separate admin app on its own development server    |
| `bun run verify:supabase` | Check public content counts with the server-side environment  |
| `bun run lint`            | Check code quality and React hook rules                       |
| `bun run format:check`    | Check formatting                                              |
| `bun run test`            | Run desktop and mobile browser tests and event-logic checks   |
| `bun run i18n:extract`    | Update translation catalogs after changing translated strings |

Browser tests start a local server on port 5173, or reuse one already running outside CI. Chromium must be installed for Playwright. Failure screenshots and traces go into `.playwright-results/`.

## Supabase and admin portal

For GitHub Pages, add repository Actions variables named `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` under **Settings → Secrets and variables → Actions → Variables**. The deployment workflow supplies them when building both apps. Local `.env.local` files are ignored by Git and are not available to GitHub Actions. After changing a variable, run the deployment workflow again to rebuild the site.

Copy `.env.example` to `.env.local` and set the project URL and publishable key. The supplied project values are already in the local, ignored `.env.local`. `VITE_` variables are used by the browser apps; the `SUPABASE_` variables are used by the Node verification script. Both use the same **publishable** key. Access is enforced by Supabase row level security, so a secret or service role key must never be placed in either browser app.

The public site and the admin portal are separate Vite apps. Run `bun run dev` for the public site and `bun run dev:admin` for the portal. Production builds place the portal in `dist/admin/`, at `/bayreuth-ai-website-first-revision/admin/` under the current GitHub Pages path. The portal does not add a route or navigation item to the public React app.

To activate the first admin, open the portal and create an account with `bayreuth.ai@gmail.com`, then confirm the email and sign in. The database grants admin membership automatically only after that address is confirmed. If an account for that email already exists, sign in with its password. Other signed-in accounts cannot edit content or upload images. Supabase Auth must have email/password signups and confirmation email delivery enabled for new accounts. If the confirmation link redirects somewhere else, return to the admin URL and sign in after confirming.

The portal can add, edit, and delete partners, team members, events, and association photos. Image fields accept a URL or an upload of a JPEG, PNG, WebP, or GIF under 5 MB. New uploads go to the public `site-images` bucket. The initial database rows refer to the existing `/official/` assets, so those assets remain available in the public site build. New content appears on the public site after refresh.

SQL migrations live in `supabase/migrations/`. The project has been seeded with the records from `src/data/` and the existing photo rail. The older event dated 9 July 2026 is retained as a past event; the future entry remains upcoming.

## Where changes belong

| Location                                       | Responsibility                                        |
| ---------------------------------------------- | ----------------------------------------------------- |
| `src/App.tsx`                                  | Route table, page transitions, and shared page layout |
| `src/pages/`                                   | Compose each page and connect content to UI           |
| `src/components/`                              | Feature-specific presentation and interaction         |
| `src/hooks/`                                   | React state and browser lifecycle integration         |
| `src/types/content.ts`                         | Content and filter contracts shared across layers     |
| `src/data/`                                    | JSON content and typed exports                        |
| `src/lib/events.ts`                            | Event ordering, selection, and filtering              |
| `src/lib/dates.ts`                             | Display formatting for dates                          |
| `src/lib/ics.ts`                               | Calendar export and download                          |
| `src/lib/badge/`                               | Interactive badge rendering, independent of React     |
| `src/services/i18n.ts`                         | Translation catalog activation and locale persistence |
| `src/styles/globals.css`, `src/theme/theme.ts` | Shared design tokens, styles, and theme               |

Edit dynamic content in the separate admin portal. `src/data/*.json` supplies fallback content for unconfigured or unavailable Supabase projects. Do not put service calls in presentation components or import UI into hooks and helpers.

Add a page to `PAGE_ROUTES` in `src/App.tsx`; every entry receives the same transition wrapper. Navigation menus are curated separately. `/dates` remains an alias for `/meetings`.

## Interactive badge

`Logo3DCard` owns the markup and photo fallback. `useBadgeScene` connects it to the renderer and cleans up when its inputs change or the component unmounts.

- `mountBadge.ts` owns the renderer, resize/visibility observers, animation loop, and teardown.
- `scene.ts` creates card geometry, materials, lighting, and asynchronously loaded textures.
- `lanyard.ts` owns the strap and its geometry.
- `motion.ts` owns pointer listeners and drag, tilt, and flip state.
- `textures.ts` draws the badge artwork in named steps.
- `constants.ts` contains shared dimensions and interaction thresholds, with units in names where needed.

Keep disposal next to resource creation. Texture loads that finish after disposal must release their textures. The component remains lazy-loaded by `Hero` so Three.js stays in its own bundle.

## Behavior to preserve

Event helpers return sorted copies and accept an explicit clock for deterministic tests. `getNextEvent` falls back to the most recent event when every date is past. Filtering retains the existing date-only comparison rules; event time strings are used separately for calendar export.

Use `asset()` for public files so URLs work with the production subpath configured in `vite.config.ts`. Keep the member and partner calls to action visually distinct. Respect reduced-motion preferences and preserve photo fallback when WebGL is unavailable.

Translation catalogs live in `src/locales/{en,de}/messages.po`. Translatable expressions must be evaluated within components that subscribe to locale changes. Some existing copy and JSON content are English-only.

Comments should explain constraints or reasons that the code cannot express, such as browser compatibility and resource ownership. Avoid narrating markup or duplicating values from the theme.
