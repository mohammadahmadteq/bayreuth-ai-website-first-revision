# Bayreuth AI Association Website — Claude Guide

## Stack

- **React 19** + **TypeScript 6** (strict mode) + **Vite 8**
- **Mantine 7** (UI component library)
- **React Router 7** (multi-page routing — `BrowserRouter` in `main.tsx`)
- **Framer Motion** (page transitions, scroll reveals, parallax, animated counters)
- **Tabler Icons** (icon set)
- **Lingui v6** (i18n — compile-time macro extraction; used for nav/UI chrome)
- **Bun** (package manager — use `bun add`, not `npm install`)
- **Husky + lint-staged** (pre-commit: ESLint + Prettier auto-fix)

> The site content is driven entirely by local JSON under `src/data/` (no backend
> / CMS). Editing a `.json` file updates the site directly. A previous Supabase
> carousel was removed in the deep-space-academia rebuild.

> ⚠️ **Vite plugin:** `@vitejs/plugin-react@6` is used (matched to Vite 8's Rolldown/oxc engine). v6 still accepts the inline `babel: { plugins: [...] }` option that Lingui's macro plugin uses — it just no longer bundles `@babel/core`, so we declare `@babel/core` as an explicit devDependency (pinned to `^7` to match the Lingui macro plugin). Do **not** downgrade to v4.x on Vite 8: v4 injects an `optimizeDeps.rollupOptions.jsx` key that Rolldown rejects, producing repeated `Invalid input options … For the "jsx"` warnings.

## Architecture: Separation of Concerns

The project enforces a strict three-layer architecture. Do **not** collapse these layers.

```
src/
├── types/          # Shared TypeScript interfaces. No logic, no imports from other layers.
├── data/           # Local JSON content + typed `index.ts` re-exports (the only content source).
├── lib/            # Pure helpers: cn(), date formatting, getNextEvent(), etc.
├── services/       # API / backend calls only (currently i18n catalog loading).
├── hooks/          # Business logic + React state. Returns typed results.
├── pages/          # One component per route; imports `data/`, passes props to components.
├── components/     # Pure UI grouped by feature (layout, ui, home, projects, …). Props only.
```

Pages are the "glue" layer: they import typed data from `src/data/` and pass it
down to presentation components. Components themselves never import JSON or
services — they receive everything via props.

### The rule in one sentence

> **Components never import from `services/`. Hooks never import from `components/`.**

### Why this matters

- To **swap the UI library** (e.g. Mantine → shadcn/ui): rewrite `components/` only.
- To **swap the backend** (e.g. Supabase → Directus): rewrite the relevant `services/` file only.
- Neither change touches the other layer.

### Concrete example — projects showcase

| Layer     | File                                      | Responsibility                                 |
| --------- | ----------------------------------------- | ---------------------------------------------- |
| Types     | `src/types/content.ts`                    | `Project` interface (+ all content interfaces) |
| Data      | `src/data/projects.json`                  | Raw project entries (editable content)         |
| Data      | `src/data/index.ts`                       | Typed re-export: `projects: Project[]`         |
| Component | `src/components/projects/ProjectCard.tsx` | Single card with hover-reveal overlay (props)  |
| Component | `src/components/projects/ProjectGrid.tsx` | Filter state + grid layout (props)             |
| Glue      | `src/pages/ProjectsPage.tsx`              | Imports `projects`, passes to `ProjectGrid`    |

## Content (local JSON)

All content lives in `src/data/*.json`, typed by `src/types/content.ts` and
re-exported from `src/data/index.ts`. Schemas: `events`, `team`, `projects`,
`programs`, `partners`, `stats`. Editing the JSON updates the site — no
component changes needed. There is no backend.

## Design System — "deep space academia"

- CSS tokens + utility classes in `src/styles/globals.css`: `.glow-card`, `.grid-bg`, `.noise-bg`, `.btn-member`, `.btn-partner`, `.gradient-text`
- Background: near-black with a purple undertone (`--color-bg` `#0A0A0F`)
- Primary accent: electric teal `#2DE0C8` (`teal` in the Mantine theme)
- Secondary accent: neon green `#39FF6A` (`neon`) — highlights/CTAs only, used sparingly
- Dark-first; light mode via `[data-mantine-color-scheme='light']`
- Fluid typography with `clamp()` — avoid fixed `px` font sizes in new components
- Headings + mono font: Space Grotesk; body: Inter
- Favor grid lines + subtle noise over gradient blobs; thin 1px borders with low-opacity glow on cards

### The two CTAs are always distinct

`JoinButton` ("Become a Member", solid teal→neon, primary) and `PartnerButton`
("Become a Partner", outline/ghost, secondary) must never be merged. Both appear
in the navbar and hero. On mobile they collapse into the drawer with the member
action prioritized.

### Animations (Framer Motion)

- Reusable wrappers: `ui/FadeInWhenVisible` (scroll reveal), `ui/AnimatedCounter` (count-up on view), `layout/PageTransition` (route transitions via `AnimatePresence` in `App.tsx`).
- Every animation must respect `prefers-reduced-motion` (use Framer's `useReducedMotion`); counters show their final value immediately when reduced.

## Graceful Error Handling

Every section must degrade gracefully — a data failure must never blank the whole page.

**Rules:**

1. Wrap every top-level section in `<ErrorBoundary label="Section Name">`. This catches React render errors and shows an inline card instead of unmounting the app.
2. Hooks that fetch remote data must catch errors and fall back to local placeholder data (never leave `images/items = []` with no UI).
3. Presentation components must render a visible placeholder state when `error` is set or the data array is empty — never a blank box.
4. Backend clients (e.g. Supabase) must be null-guarded at init time. `createClient(undefined, undefined)` throws; export `null` instead and guard at the call site.

**Pattern:**

```tsx
// Section export wraps inner component with ErrorBoundary
export function FooSection() {
  return (
    <ErrorBoundary label="Foo">
      <FooSectionInner />
    </ErrorBoundary>
  )
}

// Inner component uses the hook
function FooSectionInner() {
  const { items, loading, error } = useFooItems()
  return <FooList items={items} loading={loading} error={error} />
}

// Presentation component renders placeholder on error/empty
export function FooList({ items, loading, error }: FooListProps) {
  if (loading) return <Skeleton />
  if (error || items.length === 0) return <EmptyState message="..." />
  // ...
}
```

## Responsiveness

All components must work on mobile (≥320px), tablet (≥768px), and desktop (≥1024px).

- Use `clamp()` for font sizes and section padding — never fixed `px` font sizes.
- Use Mantine's `Grid` / `Container` / `Stack` for layout; avoid fixed widths.
- For JS-driven responsive values (e.g. aspect ratios, icon sizes), use `useMediaQuery` from `@mantine/hooks` with the breakpoints `767px` (mobile) and `1023px` (tablet).
- Touch targets must be ≥32px × 32px on mobile.
- Aspect ratios for media: `4/3` on mobile, `16/9` on tablet, `16/7` on desktop.

## Internationalization (Lingui v6)

The site ships with English (source) and German translations. Catalogs live in `src/locales/{en,de}/messages.po`. The active locale persists in `localStorage` and falls back to `navigator.language`.

### Architecture mapping

| Layer     | File                                  | Responsibility                                                |
| --------- | ------------------------------------- | ------------------------------------------------------------- |
| Service   | `src/services/i18n.ts`                | Loads catalogs, exposes `activateLocale` + `getInitialLocale` |
| Hook      | `src/hooks/useLocale.ts`              | Returns `{ locale, setLocale, locales }` for components       |
| Component | `src/components/LanguageSwitcher.tsx` | UI control (segmented pill); pure presentation                |
| Glue      | `src/main.tsx`                        | Wraps `<App>` in `<I18nProvider>`                             |

The architectural rule still holds — components never touch the i18n service directly; they go through the hook or the macros.

### Authoring strings

Always use the macros — never write raw strings that need translation:

```tsx
import { Trans } from '@lingui/react/macro' // JSX macro
import { t } from '@lingui/core/macro' // function macro
;<Trans>Join Now</Trans> // JSX children
const label = t`Join Now` // values, attributes, arrays
```

**Important — macros and data arrays.** `t\`...\``resolves to the *currently active* locale at evaluation time. Module-level arrays freeze on first import and never re-translate. Always declare translatable arrays *inside* the component, and call`useLingui()` so the component re-renders when the locale changes:

```tsx
function MySection() {
  useLingui() // subscribes to locale changes
  const items = [{ title: t`Hello` }] // re-evaluated on each render
  return <List items={items} />
}
```

### Workflow

```bash
bun run i18n:extract   # rescan src/, update .po catalogs (run after adding strings)
bun run i18n:compile   # optional — Vite plugin compiles .po on the fly during build/dev
```

After `extract`, open `src/locales/de/messages.po` and fill in the empty `msgstr ""` entries. The English catalog auto-fills `msgstr` from `msgid` (source locale).

### Adding a new language

1. Add the code to `locales` in `lingui.config.js` and to `SUPPORTED_LOCALES` in `src/services/i18n.ts`.
2. Add a label to `LOCALE_LABELS`.
3. Import the new catalog in `services/i18n.ts` and pass it to `i18n.load(...)`.
4. Run `bun run i18n:extract` to scaffold the new `.po` file, then translate.

## Animation Guidelines

- All animations live in `src/styles/globals.css` as utility classes. Components reference classes; they do not define keyframes inline.
- Wrap any continuous animation in `@media (prefers-reduced-motion: reduce) { animation: none !important }` for accessibility.
- Prefer `transform` + `opacity` (GPU-composited) over layout properties (`top`/`width`/`margin`) to keep frame rates smooth.
- Hero-style background effects: stack them in an `.aurora-container` with `pointer-events: none` so they never block interaction.
- Button hover effects use `::before` (shine) + `::after` (glow ring) pseudo-elements so the markup stays clean.

## Coding Conventions

- Named exports for all components (`export function Foo`)
- Component files: PascalCase; everything else: camelCase
- No inline data fetching inside components
- Hardcoded content arrays (events, projects, philosophies) live in their component file until moved to a service
- Comments only when the **why** is non-obvious
