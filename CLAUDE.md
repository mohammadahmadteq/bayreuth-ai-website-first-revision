# Project guide

See [README.md](README.md) for commands and module ownership.

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

## Internationalization

The site is English-only and has no language switcher. Write copy as plain English strings. Lingui is still installed with an English catalog in `src/locales/en/`, so text can be marked for translation later with `Trans` from `@lingui/react/macro` and `t` from `@lingui/core/macro`.

To add a language: add it to `lingui.config.js`, run `bun run i18n:extract` and translate its catalog, activate it in `src/services/i18n.ts`, and add a switcher.

## Validation

Run lint, the production build, and relevant tests after structural changes. `bun run test` starts or reuses the test server automatically and runs Chromium desktop/mobile checks. Do not weaken tests to hide behavior regressions; update stale selectors to match the actual UI.
