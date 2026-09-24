# Project guide

See [README.md](README.md) for commands, module ownership, and the interactive badge lifecycle.

## Conventions

- Use Bun for dependency changes and keep its lockfile synchronized.
- Keep TypeScript strict and prefer named component exports.
- Pages compose content from `src/data/index.ts` and pass it to feature components.
- Components must not import services. Hooks must not import components.
- Put shared content and filter types in `src/types/content.ts`, rather than exporting them from hooks for UI consumers.
- Keep event rules in `src/lib/events.ts`; supply an explicit clock in tests.
- Keep browser and graphics lifecycle work out of component markup. Every listener, observer, animation loop, texture, geometry, and material needs an owner and cleanup path.
- Comments should explain non-obvious reasons, constraints, or units.

## UI and content

- Use the current tokens in `src/styles/globals.css` and `src/theme/theme.ts`: Source Sans 3, a green accent, light page content, and dark navigation/hero/footer surfaces.
- Keep `JoinButton` and `PartnerButton` distinct.
- Preserve mobile, tablet, and desktop layouts. Prefer fluid spacing and typography.
- Respect reduced-motion preferences. Preserve existing section error boundaries and empty states.
- Resolve public asset paths with `asset()` to support the production subpath.
- Keep the badge lazy-loaded in `Hero`. Its renderer is split across `src/lib/badge/`; React lifecycle integration lives in `src/hooks/useBadgeScene.ts`.

## Internationalization

Use `Trans` from `@lingui/react/macro` for JSX and `t` from `@lingui/core/macro` for translated values. Evaluate translated arrays inside a component subscribed through `useLingui()` so they update when the locale changes. Catalogs are under `src/locales/`.

After changing translated strings, run `bun run i18n:extract` and update the German catalog. To add a locale, update `lingui.config.js`, the catalogs and supported locales in `src/services/i18n.ts`, and the language switcher's label.

## Validation

Run lint, the production build, and relevant tests after structural changes. `bun run test` starts or reuses the test server automatically and runs Chromium desktop/mobile checks. Do not weaken tests to hide behavior regressions; update stale selectors to match the actual UI.
