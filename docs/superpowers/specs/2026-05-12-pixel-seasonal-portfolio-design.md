# Pixel Art Seasonal Portfolio — Design Spec

**Date:** 2026-05-12
**Owner:** maxime.caron@hop3team.com
**Status:** Draft (awaiting user review)

## 1. Purpose

Build a personal portfolio for a software architect / developer with a distinctive pixel art aesthetic. The site adopts one of four seasonal themes (spring, summer, autumn, winter), each with its own palette, decorative sprites, and ambient particle effects. The user switches seasons manually via an on-screen toggle; the choice persists across reloads.

The MVP scope is intentionally narrow: only the Hero and Projects sections are built initially, so the artistic direction can be validated before expanding to About, Skills, Experience, and Contact.

## 2. Goals & Non-Goals

**Goals**
- Memorable, on-brand visual identity (cozy / Stardew-Valley-inspired pixel art).
- Four fully themed seasons with smooth visual transitions.
- Hero + Projects sections rendered, responsive, accessible.
- Production-grade performance (LCP < 2s, CLS < 0.1, no jank on theme switch).
- Easily extensible: adding sections, projects, or assets should not require touching theme plumbing.

**Non-Goals (MVP)**
- About / Skills / Experience / Contact sections (deferred until DA validated).
- Animated character sprite or interactive scene.
- Auto-detected season; manual toggle only for now.
- CMS or markdown-driven content; data is TypeScript modules.
- Multi-language i18n.

## 3. Stack

- Next.js 16.2.6 (App Router, React 19.2.4, TypeScript strict).
- Tailwind CSS 4 with PostCSS.
- ESLint via `eslint-config-next`.
- Tests: Vitest + React Testing Library (unit/component), Playwright (E2E + visual diffs).

> **Note:** Next.js 16 ships breaking changes versus prior major versions. Before implementation, read the relevant guides in `node_modules/next/dist/docs/` (after `npm install`) — particularly anything covering App Router server/client boundaries, font loading, and `<Image>` API.

## 4. Architecture Overview

### 4.1 File layout

```
app/
  layout.tsx                  # Root layout; mounts <SeasonProvider>; inlines no-FOUC season script
  page.tsx                    # Home: <Hero/> + <Projects/>
  globals.css                 # CSS variables per [data-season]; pixel rendering rules; reset
components/
  season/
    SeasonProvider.tsx        # Client: React Context + localStorage persist
    SeasonToggle.tsx          # Client: 4 buttons (spring/summer/autumn/winter)
    useSeason.ts              # Client hook re-exporting context
    season.ts                 # Pure helpers: currentRealSeason(date), Season type
  hero/
    Hero.tsx                  # Server: composes scene layers + headline + toggle slot
    HeroCopy.tsx              # Server: renders name/title/tagline from config/site.ts
    SkyLayer.tsx              # Server: gradient sky + sun/moon SVG (CSS-vars driven)
    ParallaxLayer.tsx         # Client: scroll-listen parallax; sprite swap per season
    GroundLayer.tsx           # Server: tileable ground sprite + foreground decor
    Particles.tsx             # Client: <canvas> with seasonal particle config
  projects/
    Projects.tsx              # Server: <section> + grid + heading
    ProjectCard.tsx           # Server: pixel-frame card; renders Project
  shared/
    PixelFrame.tsx            # Server: chunky pixel-art border wrapper (4 corners + 4 edges)
    Sprite.tsx                # Server: CSS box-shadow placeholder sprite (scaffold-time only)
config/
  site.ts                     # NAME, TITLE, TAGLINE, socials (configurable strings)
  projects.ts                 # Project[] placeholder x3
  seasons.ts                  # SeasonMeta record: label, particleConfig, sprite paths
public/
  sprites/
    spring/ summer/ autumn/ winter/   # Parallax + ground sprite per season
    projects/                          # Per-project screenshots (placeholders OK)
docs/superpowers/specs/
  2026-05-12-pixel-seasonal-portfolio-design.md   # This document
```

### 4.2 Component tree

```
<html data-season={season}>
  <body>
    <SeasonProvider>          (client)
      <Hero>                  (server shell)
        <SkyLayer/>           (server)
        <ParallaxLayer/>      (client, reads useSeason)
        <GroundLayer/>        (server)
        <Particles/>          (client, reads useSeason)
        <SeasonToggle/>       (client, reads useSeason)
        <HeroCopy/>           (server, reads config/site.ts)
      </Hero>
      <Projects>              (server)
        <ProjectCard/> x N    (server)
      </Projects>
    </SeasonProvider>
  </body>
</html>
```

Client boundary kept minimal: only `SeasonProvider`, `SeasonToggle`, `ParallaxLayer`, `Particles`. Hero shell, copy, projects = server components.

## 5. Theme System

### 5.1 Source of truth

`data-season` attribute on the `<html>` element. CSS reads it; React writes it via `SeasonProvider`.

### 5.2 Provider

```ts
type Season = 'spring' | 'summer' | 'autumn' | 'winter';

interface SeasonContext {
  season: Season;
  setSeason: (s: Season) => void;
}
```

- Initial value: `localStorage.getItem('season')` if valid, else `currentRealSeason(new Date())` (Northern Hemisphere mapping).
- Effects:
  - On mount + on change: `document.documentElement.dataset.season = season`.
  - On change: `localStorage.setItem('season', season)`.
- Exposes context via `useSeason()` hook.

### 5.3 FOUC prevention

In `app/layout.tsx`, inject an inline `<script>` in `<head>` (before React hydration) that reads `localStorage` and sets `data-season` on `<html>` immediately. This avoids a flash of default-season styling on first paint.

### 5.4 CSS variables

Defined in `app/globals.css`:

```css
:root, [data-season="spring"] {
  --sky-top: #cfe9f1;  --sky-bot: #ffd5b8;
  --ground: #6ab04c;   --ground-shadow: #3d8b40;
  --accent: #e76f51;   --foliage: #2a9d8f;
  --ink: #264653;      --paper: #fff8ec;
  --particle-color: #ffb7d5;     /* cherry blossom petals */
}
[data-season="summer"] {
  --sky-top: #7ec8e3;  --sky-bot: #ffe6a0;
  --ground: #3aa64a;   --ground-shadow: #1f7a2e;
  --accent: #f4a261;   --foliage: #1d8348;
  --ink: #264653;      --paper: #fff8ec;
  --particle-color: #fff5a8;     /* pollen / fireflies */
}
[data-season="autumn"] {
  --sky-top: #e8a87c;  --sky-bot: #c38d5e;
  --ground: #a0522d;   --ground-shadow: #6e3b1f;
  --accent: #d62828;   --foliage: #b85c2b;
  --ink: #3b2a1d;      --paper: #fdf3e3;
  --particle-color: #e76f51;     /* falling leaves */
}
[data-season="winter"] {
  --sky-top: #b8d4e3;  --sky-bot: #e8eef2;
  --ground: #dde6ed;   --ground-shadow: #b3c4d1;
  --accent: #5a7d9a;   --foliage: #6f8ba0;
  --ink: #1a2b3a;      --paper: #f5f8fb;
  --particle-color: #ffffff;     /* snow */
}

html, body {
  background: var(--paper);
  color: var(--ink);
  transition: background-color 600ms ease, color 600ms ease;
}

img.pixel, .pixel { image-rendering: pixelated; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
  }
}
```

Components reference these variables exclusively for theme-driven colors. Layout/spacing remains Tailwind.

### 5.5 Toggle UI

- Fixed bottom-right (top-right on mobile if it interferes with content), `z-50`.
- Four icon buttons (pixel sprites): flower / sun / leaf / snowflake.
- Active button has `aria-pressed="true"` and a 2px outline in `--accent`.
- Keyboard: tab focuses the group; arrow keys cycle; space/enter activates.

## 6. Hero Scene

### 6.1 Composition

Full-viewport (`100svh`) container with absolutely-positioned layers:

| z | Layer            | Render | Notes                                                        |
|---|------------------|--------|--------------------------------------------------------------|
| 0 | SkyLayer         | server | Gradient between `--sky-top` and `--sky-bot`; sun/moon SVG.  |
| 10| Particles canvas | client | Full-viewport, `pointer-events: none`, `aria-hidden`.        |
| 20| ParallaxLayer    | client | Sprite hills/trees; horizontal scroll-tied translate.        |
| 30| GroundLayer      | server | Tileable ground sprite, ~30% viewport, foreground decor.     |
| 50| UI overlay       | mixed  | Headline (server) + SeasonToggle (client).                   |

### 6.2 Parallax

`ParallaxLayer` registers a `scroll` listener (passive). Translates the sprite via `transform: translateX(scrollY * factor)` where `factor` is e.g. `0.3` for mid, `0.6` for ground. Sprite paths come from `seasons.ts` and change on season switch.

### 6.3 Particles

`Particles.tsx` is a single `<canvas>`-driven client component. Behavior per season:

| Season | Particle      | Motion                            | Count |
|--------|---------------|-----------------------------------|-------|
| spring | petal         | slow fall + horizontal drift sine | ~50   |
| summer | firefly/pollen| upward drift + gentle fade in/out | ~40   |
| autumn | leaf          | fall + rotate + drift             | ~50   |
| winter | snowflake     | fall + horizontal sway            | ~60   |

Implementation rules:
- Single `requestAnimationFrame` loop; particles stored in a plain array.
- Resize observer recalculates canvas size; cap DPR at 2 for retina but keep CSS size 1:1.
- Pause loop on `document.visibilityState === 'hidden'`.
- Skip loop entirely if `prefers-reduced-motion: reduce`.
- Color = `--particle-color` (read via `getComputedStyle` on season change).

### 6.4 Hero copy

```ts
// config/site.ts
export const site = {
  name: 'YOUR_NAME',
  title: 'Software Architect',
  tagline: 'Crafting systems that scale and stories that ship.',
  socials: { github: '', linkedin: '', email: '' },
} as const;
```

Typography:
- Display (name, section headings): pixel font via `next/font/google` (e.g. `VT323` or `Press Start 2P`, Latin subset only).
- Body: `Inter` or system sans, anti-aliased, normal weight — keeps reading comfortable.

### 6.5 Sprite sources

MVP scaffolding uses placeholder CSS `box-shadow` art (a `Sprite` helper that renders a small grid) so the page works before real PNGs land. Real sprites will come from a CC0/CC-BY pack on Itch.io (e.g. Cup Nooble's *Sunny Land* or *Cozy Farm*) — attribution recorded in `public/sprites/ATTRIBUTION.md`. Sprite paths are wired through `config/seasons.ts` so swapping packs is a one-file change.

## 7. Projects Section

### 7.1 Layout

- `<section id="projects">` directly under Hero, background `--paper`, vertical padding `py-24`.
- Heading "Featured Projects" in pixel display font + a small decorative pixel star/key.
- Grid: 1 col mobile / 2 cols md / 3 cols lg, `gap-8`.

### 7.2 Card anatomy

```
┌───────────── pixel frame ─────────────┐
│  ┌─────────────── image ────────────┐ │   16:9, Next/Image with priority=false
│  │                                  │ │   Fallback: gradient (sky-top → ground)
│  └──────────────────────────────────┘ │   + small pixel icon center
│  Title                                │   pixel font, --ink
│  Description (2-3 lines, line-clamp)  │   body sans, --ink
│  ────────────────────────────────     │
│  [Tag] [Tag] [Tag]                    │   pixel pills, --foliage bg, --paper text
│  → View case study                    │   --accent link, hover underline
└───────────────────────────────────────┘
```

Frame: implemented via `border-image` referencing a 9-slice PNG, or — to avoid asset dependency early — via four absolutely-positioned corner divs + four edge divs styled as 4px solid `--ink` with insets giving the chunky pixel look. A `<PixelFrame>` wrapper component encapsulates this.

Hover: `translate-y(-4px)`, drop shadow intensifies, frame edge shifts to `--accent`. 200ms transition.

### 7.3 Data

```ts
// config/projects.ts
export interface Project {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  image?: string;        // /sprites/projects/<slug>.png; optional → fallback gradient
  href?: string;         // external URL or future /projects/<slug>
}

export const projects: Project[] = [
  { slug: 'p1', title: 'Project One',   description: 'Placeholder description.', stack: ['TypeScript', 'AWS', 'Kafka'] },
  { slug: 'p2', title: 'Project Two',   description: 'Placeholder description.', stack: ['Go', 'Kubernetes', 'gRPC'] },
  { slug: 'p3', title: 'Project Three', description: 'Placeholder description.', stack: ['Rust', 'Postgres', 'DDD'] },
];
```

### 7.4 Seasonal interaction

ProjectCard uses `--paper`, `--ink`, `--accent`, `--foliage` exclusively — so it adapts automatically on season switch with no per-card logic. Pixel frame edge color = `--accent` so the seasonal accent reads here too. No heavy seasonal scenery in this section (focus = project content).

## 8. Testing

### 8.1 Unit (Vitest)

- `currentRealSeason(date)` mapping: 12 sample dates covering all four seasons (Northern Hemisphere calendar).
- `SeasonProvider`: initial value selection (localStorage > real season), `setSeason` updates `data-season` and persists.
- `Particles` config selector returns expected shape per season.

### 8.2 Component (Vitest + RTL)

- `SeasonToggle`: rendering, `aria-pressed` on active, keyboard navigation (arrow + space/enter).
- `ProjectCard`: renders title, description (line-clamped), all stack tags as `<li>`, href when present.

### 8.3 E2E + visual (Playwright)

- Hero loads; on a fresh profile, `data-season` matches the real current season (date-mocked in test).
- Click each of the 4 toggles → `data-season` updates, screenshot diff matches reference per season.
- Reload after toggling to winter → still winter (localStorage round-trip).
- `prefers-reduced-motion` emulated → particle canvas remains static (assert pixel diff over 500ms is zero).

### 8.4 Out of scope for tests

- Pixel-perfect sprite rendering (manual visual review).
- Exact CSS variable hex values (covered by visual snapshots).

## 9. Accessibility

- `SeasonToggle` is a `<div role="group" aria-label="Change season">` of `<button>`s, each with `aria-pressed` reflecting state and `aria-label` naming the season.
- Particles canvas: `aria-hidden="true"`, `pointer-events: none`, no tab stop.
- Color contrast: `--ink` on `--paper` ≥ WCAG AA per season (verified manually; will adjust palette if any fail).
- `prefers-reduced-motion` cuts transitions and freezes particles.
- All buttons and links have visible focus styles: 2px solid `--accent` outline with 2px offset.
- Semantic landmarks: Hero wrapped in `<header>`, body in `<main>`, Projects in `<section aria-labelledby="projects-heading">`.

## 10. Performance

- LCP target < 2s on mid-range mobile (Moto G class) over 4G.
- CLS target < 0.1.
- Above-the-fold sprites: `<Image priority>` only for the hero's primary sprite layer.
- Non-critical sprite layers and project images: lazy.
- Particles capped (max 60), single rAF loop, paused on tab hidden, skipped if reduced-motion.
- Server components used wherever no interactivity is needed (Hero shell, copy, Projects, ProjectCard).
- Pixel font subset to Latin via `next/font` to minimize transfer.
- No client-side routing libs; no animation library — vanilla CSS + minimal canvas.

## 11. Configuration & extensibility

- `config/site.ts`: identity strings.
- `config/projects.ts`: project list (typed).
- `config/seasons.ts`: per-season metadata (label, icon path, sprite paths, particle config defaults).

Adding a new section (e.g. About) later means a new component + a render in `page.tsx`; no theme plumbing changes.

## 12. Out of scope (MVP)

- About / Skills / Experience / Contact sections.
- Animated character sprite, mouse-tracked or keyboard-controlled.
- Auto-detected season from system date (deferred; manual toggle only).
- Day/night cycle within a season.
- Sound effects / ambient audio.
- CMS / markdown content sources.
- i18n.
- Analytics, SEO meta beyond Next defaults.

## 13. Open assumptions to validate during implementation

- Cozy palette retains WCAG AA contrast across all four seasons — adjust hex values if any pairing fails (especially `--ink` vs `--paper` in winter and summer).
- Itch.io sprite pack will be selected after MVP scaffold; placeholder CSS sprites must look acceptable enough to validate layout before real assets land.
- Pixel display font choice (`VT323` vs `Press Start 2P`) to be settled during implementation based on legibility at hero sizes.

## 14. Acceptance criteria (MVP)

1. Visiting `/` shows a full-viewport Hero with sky, parallax mid layer, ground, particles, headline, and season toggle.
2. Clicking each of the four season buttons changes palette, sprites, and particle effect smoothly within ~600ms.
3. Refresh preserves the last-chosen season.
4. The Projects section renders three placeholder cards in a responsive grid below the Hero, themed via CSS variables.
5. Lighthouse mobile scores: Performance ≥ 90, Accessibility ≥ 95.
6. All unit, component, and E2E tests pass in CI.
7. `prefers-reduced-motion` users see static scene + no particle animation, fully usable.
