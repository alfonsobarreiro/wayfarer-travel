# Figma Code Connect — Wayfarer

This directory holds the [Figma Code Connect](https://www.figma.com/code-connect-docs/) mappings between the Wayfarer Figma file (`glE8OOm7wbnBsEqD0L4YWz`) and this codebase.

## Why this exists

The Figma Components page documents 18 component sections reconciled against the production code. Each section's eyebrow names the source file (`MATCHES src/...`). This directory makes that mapping machine-readable so that:

- Designers viewing a component in Figma can click through to the source file via Code Connect.
- Developers running `npx figma connect publish` can verify the mappings without leaving the terminal.
- Future contributors get a single source of truth that links every Figma node ID to a code path.

## Status

These mapping files are authored locally and committed to the repo. **Publishing them to Figma requires a Developer seat in an Organization or Enterprise plan** (`npx figma connect publish` will fail without it). Per the Figma docs, you can still test mappings locally via `npx figma connect parse` to validate syntax.

## File structure

| File | Figma node | Source pattern |
|---|---|---|
| `button-primary.figma.tsx` | `8277:38` | `src/app/page.tsx:165` — hero Sign Up CTA |
| `button-outline.figma.tsx` | `8277:58` | `src/app/planner/page.tsx:395` — Print button |
| `icon-button.figma.tsx` | `8277:95` | `src/app/page.tsx:208` — carousel arrows |
| `link-nav.figma.tsx` | `8278:25` | `src/components/Navbar.tsx` |
| `link-arrow.figma.tsx` | `8278:42` | `src/app/page.tsx:279` — "View all destinations" |
| `link-footer.figma.tsx` | `8278:53` | `src/components/Footer.tsx` |
| `search-pill-light.figma.tsx` | `8278:94` | `src/components/Navbar.tsx:64` |
| `search-pill-dark.figma.tsx` | `8278:117` | `src/app/destinations/page.tsx:75` |
| `kbd-light.figma.tsx` | `8279:17` | `src/components/Navbar.tsx:71` |
| `kbd-dark.figma.tsx` | `8279:24` | `src/app/destinations/page.tsx:81` |
| `eyebrow-light.figma.tsx` | `8279:44` | `src/app/page.tsx` (Why Wayfarer eyebrow) |
| `eyebrow-dark.figma.tsx` | `8279:50` | `src/app/page.tsx` (Interactive eyebrow) |
| `eyebrow-glass.figma.tsx` | `8279:56` | `src/app/destinations/[slug]/page.tsx` |
| `badge-glass.figma.tsx` | `8283:18` | `src/app/destinations/[slug]/page.tsx` — Curated Experience |
| `badge-coming-soon.figma.tsx` | `8283:28` | `src/app/planner/page.tsx:414` — Send to booking |
| `text-input.figma.tsx` | `8283:64` | `src/components/form/SignUpModal.tsx:160` — `inputClass` |
| `destination-card.figma.tsx` | `8283:102` | `src/app/page.tsx:243` |
| `section-header.figma.tsx` | `8285:27` | section pattern across pages |
| `navbar.figma.tsx` | `8285:53` | `src/components/Navbar.tsx` |
| `footer.figma.tsx` | `8285:82` | `src/components/Footer.tsx` |

## Pattern note

Most components in the Wayfarer codebase ship as **inline Tailwind patterns**, not extracted React components — `<button className="px-8 py-3.5 rounded-lg bg-brand-600 ...">` rather than `<Button variant="primary">`. The `.figma.tsx` files document the className+JSX pattern verbatim so the mapping survives even before any refactor extracts these into UI components.

When/if the codebase migrates inline patterns into `src/components/ui/`, update each `.figma.tsx` file to import the real component and the `example` slot can shrink to `<Button>Sign Up!</Button>`.

## CLI commands

```bash
# Install the CLI (one-time)
npm install --save-dev @figma/code-connect

# Validate mappings locally
npx figma connect parse

# Publish to Figma (requires Org/Enterprise seat)
npx figma connect publish
```

Config lives in `figma.config.json` at the repo root.
