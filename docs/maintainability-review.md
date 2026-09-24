# Maintainability review

## Summary

The highest-impact changes separate the interactive badge's responsibilities, remove repeated routing markup, and make event rules independently testable. Styling, content, URLs, calendar selection rules, and the existing translation behavior are preserved.

## Findings

| Priority | Finding                                                                                                          | Resolution                                                                                                                                                                    |
| -------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| High     | `Logo3DCard` combined canvas artwork, GPU resources, pointer state, animation, and React lifecycle in 838 lines. | Split into a presentation component, lifecycle hook, and focused rendering modules. Artwork is drawn through named functions; resources are disposed by their owning modules. |
| Medium   | The component created a disposable WebGL probe during render before creating its actual renderer.                | Attempt renderer creation inside the lifecycle integration and use the existing photo fallback on failure. Ignore queued failure callbacks after unmount.                     |
| Medium   | Every route repeated the same transition wrapper.                                                                | Added a route table with one wrapper; retained the legacy redirect and missing-page route.                                                                                    |
| Medium   | Event rules were spread across a generic utility module, a state hook, and the featured-event component.         | Moved rules into `lib/events.ts`, made the filter accept an explicit clock, and pass the selected event into `FeaturedNext`.                                                  |
| Low      | UI consumed shared domain types from hooks and a redundant service type import.                                  | Moved shared filter/search contracts into `types/content.ts` and removed the service dependency from the language switcher.                                                   |
| Low      | Unreferenced components and helpers increased the code developers needed to consider.                            | Removed unused card/counter components, class-name/date helpers, and locale-label mapping after checking repository references. Retained JSON content.                        |
| Low      | Comments narrated markup or described older designs; project documentation was stale.                            | Removed redundant comments, retained non-obvious constraints, and replaced the starter README and outdated project guide.                                                     |

## Structured outputs

- `README.md`: commands, module ownership, badge lifecycle, and behavior to preserve.
- `tests/events.spec.ts`: deterministic event rules, calendar filtering/selection/download, and resource search.
- `tests/badge.spec.ts`: renderer mount/unmount/remount and unavailable-WebGL fallback on desktop and mobile.
- `tests/home.spec.ts`: current content, navigation, locale persistence, redirects, and missing-page recovery.
- `playwright.config.ts`: automatic test-server startup and ignored output directory.

## Evidence and confidence

Lint, production build, formatting checks for changed source, and whitespace checks passed. Browser/event checks: 21 passed; one mobile-only test was intentionally skipped in the desktop project. The rendered badge screenshot was also inspected. The production build retains its pre-existing warning for bundles above 500 kB.

## Assumptions

This is a behavior-preserving refactor. Date-only event comparison and the fallback to the latest past event remain unchanged. Member/partner button differences and existing inline layout styles are intentional UI choices, rather than duplication to consolidate automatically.

## Open questions

- Event scheduling needs a separate decision about timezone and whether a meeting happening later today should count as upcoming; the current comparison uses the event date without its time range.
- English-only copy remains outside the existing translation catalogs.
- The unused Supabase dependency and the two package-manager lockfiles warrant a separate dependency cleanup; dependency versions were not changed here.

## Recommended next skill

Use `dependency-simplifier` for a bounded dependency cleanup after deciding which lockfile is authoritative. A performance pass can separately address the existing bundle-size warning.
