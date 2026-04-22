# Deploying `wayfarer-travel`

The app is a Next.js 15 site with one runtime dependency that matters for hosting choice: **Mapbox GL JS**, which needs `NEXT_PUBLIC_MAPBOX_TOKEN` set at build / runtime.

Below: three deploy paths, in order of recommendation. Pick one. All of them assume you've pushed your current uncommitted work first.

---

## Step 0 — Commit your local changes

You currently have uncommitted brand-applied changes in the repo:

```bash
cd ~/Projects/wayfarer-travel
git status --short
```

Expected:

```
 M src/app/globals.css               # Navy/Terra Cotta tokens
 M src/app/layout.tsx                # Space Grotesk font link
 M src/components/Navbar.tsx         # Real Wayfarer logo inline
 M src/components/map/DestinationMap.tsx  # Terra Cotta pins
 ?? public/wayfarer-logo.svg         # Real SVG
 ?? src/components/WayfarerLogo.tsx  # Inline SVG component
```

Commit:

```bash
git add src/app/globals.css \
        src/app/layout.tsx \
        src/components/Navbar.tsx \
        src/components/map/DestinationMap.tsx \
        src/components/WayfarerLogo.tsx \
        public/wayfarer-logo.svg
git commit -m "Apply Wayfarer brand: Navy palette, Space Grotesk + Inter, real wordmark"
git push origin main
```

> **Do NOT commit** `node_modules/`, `.next/`, `tsconfig.tsbuildinfo`, or `.claude/` — they should already be gitignored. Double-check with `git status` after staging.

Optional — if you want `.claude/launch.json` on the repo (useful for collaborators who also use Claude's preview tool):

```bash
git add .claude/launch.json
git commit -m "chore: add claude preview launch config"
```

---

## Option A — Vercel (recommended, zero config)

Vercel is built by the team behind Next.js. `next start` is a first-class citizen. Takes ~3 minutes end-to-end.

### One-time setup

1. Install the CLI (optional — the web UI works too):
   ```bash
   npm install -g vercel
   vercel login
   ```

2. From the repo root:
   ```bash
   cd ~/Projects/wayfarer-travel
   vercel link       # pick the scope, name the project "wayfarer-travel"
   ```

3. Set the Mapbox token (copy from your local `.env.local`):
   ```bash
   vercel env add NEXT_PUBLIC_MAPBOX_TOKEN
   # paste value, then pick: Production, Preview, Development (all three)
   ```

### Deploy

Preview deploy (creates a `wayfarer-travel-git-<branch>.vercel.app` URL):

```bash
vercel
```

Production deploy:

```bash
vercel --prod
```

### After first deploy

- Vercel auto-wires GitHub: every `git push` to `main` triggers a production build; every push to a branch creates a preview URL.
- Default domain: `wayfarer-travel.vercel.app`. You can attach a custom domain in the Vercel dashboard → Project → Domains.

### Notes

- `next.config.ts` has `images: { unoptimized: true }`, so Vercel's Image Optimization is bypassed. If you want it, remove that flag — your current bundle works either way.
- The dev server runs on port 3002 (`next dev -p 3002`); Vercel ignores that and uses its own port. No action needed.

---

## Option B — Netlify

Very similar to Vercel. Good if you already have Netlify infrastructure.

### One-time setup

1. Install and login:
   ```bash
   npm install -g netlify-cli
   netlify login
   ```

2. Link the repo:
   ```bash
   cd ~/Projects/wayfarer-travel
   netlify init
   # pick: Create & configure a new site
   # build command: npm run build
   # publish directory: .next
   ```

3. Set the env var:
   ```bash
   netlify env:set NEXT_PUBLIC_MAPBOX_TOKEN "pk.<your-token>"
   ```

### Deploy

```bash
netlify deploy           # preview URL
netlify deploy --prod    # production
```

Netlify auto-installs `@netlify/plugin-nextjs` — no manual plugin config needed.

---

## Option C — Self-host (VPS, Fly.io, Railway, etc.)

If you need full control (e.g., a container running alongside other services).

### Build locally, then ship

```bash
cd ~/Projects/wayfarer-travel
npm ci
NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx npm run build
npm run start            # serves on localhost:3002
```

### Dockerfile (drop into repo root)

```dockerfile
# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_MAPBOX_TOKEN
ENV NEXT_PUBLIC_MAPBOX_TOKEN=$NEXT_PUBLIC_MAPBOX_TOKEN
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3002
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3002
CMD ["npm", "run", "start"]
```

Build + run:

```bash
docker build --build-arg NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx -t wayfarer-travel .
docker run -p 3002:3002 wayfarer-travel
```

### Fly.io (quickest self-host path)

```bash
# Install Fly CLI, then:
fly launch --name wayfarer-travel --no-deploy
fly secrets set NEXT_PUBLIC_MAPBOX_TOKEN="pk.xxx"
fly deploy
```

Fly auto-detects the Dockerfile above. First deploy takes ~5 minutes.

---

## Environment variables

| Name | Required | Where used |
|---|---|---|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Yes | `src/components/map/DestinationMap.tsx` — the globe / destination map won't render without it. |

The `NEXT_PUBLIC_` prefix is Next.js convention — it exposes the variable to the browser bundle. Don't put secrets here.

---

## Post-deploy checklist

After a successful deploy, smoke-test these routes:

- [ ] `/` — homepage hero loads, real Wayfarer wordmark visible, tropical cover renders
- [ ] `/discover` — 3D globe loads with terra-cotta pins
- [ ] `/destinations` — grid + continent filter pills work
- [ ] `/destinations/tokyo` — detail page loads
- [ ] `/planner` — trip planner loads
- [ ] `/wireframes/form` — multi-step form wireframe renders

If the globe is blank, 99% it's the Mapbox token missing or scoped wrong — check the dashboard env vars.
