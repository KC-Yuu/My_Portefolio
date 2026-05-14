<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Hero performance rules

The hero scene is paint/composite-bound at high refresh rates (144Hz). Follow these rules for any new sprite, animation, or layer added under `components/hero/` or `components/sprites/`. Breaking them silently undoes prior optimization work.

## Adding a new pixel-art sprite

Default: build SVG string at module load, encode as `data:image/svg+xml;utf8,...`, render via `<img>`. Reference: `components/sprites/Tree.tsx`, `Cloud.tsx`, `Frog.tsx`, `BladeShadow.tsx`.

```tsx
function buildSvg(shape): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${rects}</svg>`;
}
const SRC = `data:image/svg+xml;utf8,${encodeURIComponent(buildSvg(shape))}`;
```

Render:
```tsx
<img
  src={SRC}
  alt=""
  decoding="async"
  style={{ display: 'block', width, height, maxWidth: 'none', imageRendering: 'pixelated' }}
/>
```

Required:
- Explicit `width`/`height` on the `<svg>` element (matches viewBox) — without them, browsers fall back to 300×150 natural size and `pixelated` rendering breaks at small sizes.
- `style.maxWidth: 'none'` — Tailwind preflight applies `img { max-width: 100% }` which silently shrinks sprites inside zero-width parents.
- `imageRendering: 'pixelated'` — keeps the pixel-art aesthetic on scale.
- `decoding="async"` — never block layout on sprite decode.

NEVER render new sprites as inline `<svg><rect/></svg>` with many rects. Each instance adds dozens of DOM nodes; 100 instances explode into thousands. Inline SVG is only acceptable for unique single-instance sprites (e.g. `Sun`, `Pond`) AND only for the animated parts (see below).

## Sprite with dynamic color (`currentColor`)

Use a CSS mask with the SVG silhouette in black, `backgroundColor: 'currentColor'`. Pattern: `GrassBlade.tsx`. Color stays themable (e.g. seasonal `--foliage`).

## Sprite with mixed static + dynamic colors

Split into two layers stacked inside a `position: relative` wrapper: a masked div for currentColor parts, an `<img>` for fixed-color parts. Pattern: `Flower.tsx` (stem mask + bloom img).

## Sprite with multi-frame animation

Pre-render each frame as its own `<img>` baked with all layers (body + frame-specific wings, etc). Stack them absolute-positioned in a wrapper; toggle via CSS opacity keyframes. Pattern: `Butterfly.tsx`. Do NOT use inline `<g class="frame-a">…</g>` SVG groups with rect children — that re-rasters dozens of rects per flap.

## Sprite with both static + animated parts

Bake the static parts as a single `<img>`; render only the animated layers as inline SVG above. Pattern: `Pond.tsx` (earth/water base baked → img, lily pads + shimmer kept inline).

## JS-driven animations (transforms each frame)

Subscribe to the shared master rAF instead of running your own loop:

```tsx
import { useAnimationFrame, subscribeAnimationFrame } from './useAnimationFrame';

// Hook form (preferred when work fits in callback):
useAnimationFrame((now) => { /* update DOM */ });

// Imperative form (when work must live inside an existing useEffect closure):
useEffect(() => {
  const unsub = subscribeAnimationFrame((now) => { /* … */ });
  return unsub;
}, []);
```

NEVER add a fresh `requestAnimationFrame(tick)` chain in a new component. Use the master loop. Each independent rAF callback adds fixed-cost overhead per frame (~0.05ms) and they accumulate.

Per-frame rules:
- Skip DOM writes when the new value equals the previous one (cache via `useRef`).
- Use `translate3d(...)` (composited) rather than `top/left/width/height` (layout).
- Quantize float values before stringifying (e.g. `Math.round(x * 100) / 100`) to dedupe writes.

## CSS animations

- `transform` and `opacity` only. Browser auto-promotes them; do NOT add `will-change` unless the element ALSO receives JS-driven transforms — `will-change` creates a compositor layer and we cap at ~11 in the whole hero.
- For idle CSS keyframes (sway, drift, flap), `will-change` is forbidden.
- `prefers-reduced-motion` media query MUST disable the animation.

## Forbidden CSS

These were removed for measured FPS reasons. Do not reintroduce without profiling justification:

- `mix-blend-mode` (any value) on elements larger than a sprite. Each blend creates a non-accelerated compositor pass over the backdrop. The hero target is zero blend modes.
- `backdrop-filter` — same reason.
- `filter` with blur/drop-shadow on animated elements.

If the visual effect "needs" a blend mode, achieve it instead with adjusted rgba alpha + appropriate color, then verify in DevTools Performance.

## Canvas-based sprites (Frogs/Bees pattern)

Both share a single `<canvas>` rendered by `SpriteCanvas.tsx`. New canvas drawers register via `subscribeSpriteDraw((ctx, canvas, now) => …)`. Do NOT mount a new `<canvas>` element for an additional sprite.

Required inside each drawer:
- `dpr = 1` for pixel-art (DPR>1 quadruples raster area for zero visual gain).
- Dirty-rect clearing: track last drawn bbox per entity, `clearRect` only that union with the new bbox. Never `clearRect(0, 0, w, h)`.
- Skip the entire `drawScene` call when nothing visually changed (compare to cached last values).
- Cache `getBoundingClientRect()` lookups on resize/scroll — never call them inside the per-frame tick.

## Per-element counts

Hero target ceilings (DOM):
- Trees: ~200 total across all layers; reduce far/midfar if adding new layers.
- Blades: ~150 grass + ~50 flowers. Animate at most 1/3 of blades (use `is-anim` class on subset).
- Animated trees: ~1 in 3 max swaying simultaneously.

If a new feature needs more, pre-rasterize aggressively or use a tile pattern instead of N elements.

## Pre-merge checklist for hero changes

Before considering a hero/sprite change complete, verify in DevTools Performance panel:
- Frame time p95 ≤ 7ms (144Hz) or ≤ 16ms (60Hz)
- Long Tasks count = 0 during idle
- Compositor layer count not increased meaningfully (`will-change` count stays ≤ ~15)
- No new `mix-blend-mode` declarations in the diff

Quick FPS smoke test (paste in DevTools console):
```js
(async () => { const s=[]; let l=performance.now(); const st=l; await new Promise(r=>{function t(n){s.push(n-l);l=n;if(n-st<3000)requestAnimationFrame(t);else r();}requestAnimationFrame(t);}); const sorted=[...s].sort((a,b)=>a-b); console.log({fps:+(1000/(s.reduce((a,b)=>a+b)/s.length)).toFixed(1),p95:+sorted[Math.floor(sorted.length*0.95)].toFixed(2)}); })();
```
