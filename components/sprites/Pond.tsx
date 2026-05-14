type Rect = readonly [x: number, y: number, w: number, h: number];

interface Layer {
  fill: string;
  rects: ReadonlyArray<Rect>;
}

const VB_W = 144;

const EARTH_TAPER: ReadonlyArray<{ x: number; w: number }> = [
  { x: 38, w: 68 },
  { x: 30, w: 84 },
  { x: 24, w: 96 },
  { x: 18, w: 108 },
  { x: 14, w: 116 },
  { x: 10, w: 124 },
  { x: 6, w: 132 },
  { x: 3, w: 138 },
  { x: 1, w: 142 },
];

const EARTH_BODY_ROWS = 22;
const VB_H = EARTH_TAPER.length * 2 + EARTH_BODY_ROWS;
const TAPER_LEN = EARTH_TAPER.length;
const BODY_END = TAPER_LEN + EARTH_BODY_ROWS;
const WATER_INSET = 3;

function rowProfile(y: number): { x: number; w: number } | null {
  if (y < 0 || y >= VB_H) return null;
  if (y < TAPER_LEN) return EARTH_TAPER[y];
  if (y < BODY_END) return EARTH_TAPER[TAPER_LEN - 1];
  return EARTH_TAPER[VB_H - 1 - y];
}

function buildLayers(): {
  earth: Rect[];
  water: Rect[];
  waterOutline: Rect[];
} {
  const earth: Rect[] = [];
  const water: Rect[] = [];
  const waterOutline: Rect[] = [];

  for (let y = 0; y < VB_H; y++) {
    const e = rowProfile(y);
    if (!e) continue;

    earth.push([e.x, y, e.w, 1]);

    if (y >= WATER_INSET && y < VB_H - WATER_INSET) {
      const wx = e.x + WATER_INSET;
      const ww = e.w - 2 * WATER_INSET;
      if (ww > 0) {
        water.push([wx, y, ww, 1]);
        if (y === WATER_INSET || y === VB_H - WATER_INSET - 1) {
          waterOutline.push([wx, y, ww, 1]);
        } else {
          waterOutline.push([wx, y, 1, 1]);
          waterOutline.push([wx + ww - 1, y, 1, 1]);
        }
      }
    }
  }

  return { earth, water, waterOutline };
}

const { earth: EARTH_RECTS, water: WATER_RECTS, waterOutline: WATER_OUTLINE_RECTS } =
  buildLayers();

function makeRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function generateSideSpeckles(count: number, seed: number): Rect[] {
  const rand = makeRng(seed);
  const result: Rect[] = [];
  let attempts = 0;
  while (result.length < count && attempts < count * 6) {
    attempts++;
    // Pick row in side zone only (excludes top and bottom full-earth strips).
    const y = WATER_INSET + Math.floor(rand() * (VB_H - 2 * WATER_INSET));
    const profile = rowProfile(y);
    if (!profile) continue;
    let x: number;
    let maxW: number;
    if (rand() < 0.5) {
      x = profile.x + Math.floor(rand() * WATER_INSET);
      maxW = profile.x + WATER_INSET - x;
    } else {
      x = profile.x + profile.w - WATER_INSET + Math.floor(rand() * WATER_INSET);
      maxW = profile.x + profile.w - x;
    }
    const w = Math.max(1, Math.min(maxW, 1 + Math.floor(rand() * 3)));
    if (w > 0) result.push([x, y, w, 1]);
  }
  return result;
}

function generateTopBottomSpeckles(count: number, seed: number): Rect[] {
  const rand = makeRng(seed);
  const result: Rect[] = [];
  let attempts = 0;
  while (result.length < count && attempts < count * 6) {
    attempts++;
    const isTop = rand() < 0.5;
    const y = isTop
      ? Math.floor(rand() * WATER_INSET)
      : VB_H - WATER_INSET + Math.floor(rand() * WATER_INSET);
    const profile = rowProfile(y);
    if (!profile) continue;
    const x = profile.x + Math.floor(rand() * profile.w);
    const maxW = profile.x + profile.w - x;
    const w = Math.max(1, Math.min(maxW, 1 + Math.floor(rand() * 3)));
    if (w > 0) result.push([x, y, w, 1]);
  }
  return result;
}

const EARTH_DARK_SPECKS: ReadonlyArray<Rect> = [
  ...generateSideSpeckles(18, 12345),
  ...generateTopBottomSpeckles(28, 54321),
];

const EARTH_LIGHT_SPECKS: ReadonlyArray<Rect> = [
  ...generateSideSpeckles(8, 67890),
  ...generateTopBottomSpeckles(14, 24680),
];

const DEEP_BAND_RECTS: ReadonlyArray<Rect> = [
  [18, 17, 108, 1],
  [16, 18, 112, 6],
  [18, 24, 108, 1],
];

// Lily pads — grouped per pad so each can drift in its own tiny circle.
const PAD_A_LAYERS: ReadonlyArray<Layer> = [
  { fill: '#2e5f24', rects: [
    [48, 17, 5, 1], [47, 18, 7, 1], [47, 19, 7, 1], [47, 20, 7, 1], [48, 21, 5, 1],
  ]},
  { fill: '#1a3e15', rects: [[50, 19, 1, 1], [49, 19, 1, 1]] },
  { fill: '#5a9d3e', rects: [[49, 18, 1, 1], [51, 19, 1, 1]] },
];

const PAD_B_LAYERS: ReadonlyArray<Layer> = [
  { fill: '#2e5f24', rects: [
    [76, 21, 7, 1], [75, 22, 9, 1], [75, 23, 9, 1], [75, 24, 9, 1], [76, 25, 7, 1],
  ]},
  { fill: '#1a3e15', rects: [[79, 23, 2, 1], [78, 24, 1, 1]] },
  { fill: '#5a9d3e', rects: [[78, 23, 1, 1], [82, 22, 1, 1]] },
  { fill: '#ffb7d5', rects: [[79, 22, 1, 1], [80, 22, 1, 1], [79, 23, 1, 1]] },
  { fill: '#e63946', rects: [[80, 23, 1, 1]] },
];

const PAD_C_LAYERS: ReadonlyArray<Layer> = [
  { fill: '#2e5f24', rects: [
    [100, 17, 5, 1], [99, 18, 7, 1], [99, 19, 7, 1], [99, 20, 7, 1], [100, 21, 5, 1],
  ]},
  { fill: '#1a3e15', rects: [[101, 19, 1, 1], [102, 20, 1, 1]] },
  { fill: '#5a9d3e', rects: [[101, 18, 1, 1], [103, 20, 1, 1]] },
];

const STATIC_LAYERS: ReadonlyArray<Layer> = [
  { fill: '#6b4423', rects: EARTH_RECTS },
  { fill: '#8b5e30', rects: EARTH_LIGHT_SPECKS },
  { fill: '#4a2e15', rects: EARTH_DARK_SPECKS },
  { fill: '#4a90d9', rects: WATER_RECTS },
  { fill: '#2e6cb0', rects: WATER_OUTLINE_RECTS },
  { fill: '#3676b5', rects: DEEP_BAND_RECTS },
];

// Per-pad halo rings (1=inner, 2=mid, 3=outer). Each pad bundles its halo + body.
// Pad A body: rows 17(48-52), 18-20(47-53), 21(48-52). Halo cells are 1/2/3 pixels outside.
const PAD_A_RING_1: ReadonlyArray<Rect> = [
  [48, 16, 5, 1], [48, 22, 5, 1],
  [47, 17, 1, 1], [53, 17, 1, 1],
  [47, 21, 1, 1], [53, 21, 1, 1],
  [46, 18, 1, 1], [46, 19, 1, 1], [46, 20, 1, 1],
  [54, 18, 1, 1], [54, 19, 1, 1], [54, 20, 1, 1],
];
const PAD_A_RING_2: ReadonlyArray<Rect> = [
  [47, 15, 7, 1], [47, 23, 7, 1],
  [46, 16, 1, 1], [54, 16, 1, 1],
  [46, 17, 1, 1], [54, 17, 1, 1],
  [46, 21, 1, 1], [54, 21, 1, 1],
  [46, 22, 1, 1], [54, 22, 1, 1],
  [45, 18, 1, 1], [45, 19, 1, 1], [45, 20, 1, 1],
  [55, 18, 1, 1], [55, 19, 1, 1], [55, 20, 1, 1],
];
const PAD_A_RING_3: ReadonlyArray<Rect> = [
  [46, 14, 9, 1], [46, 24, 9, 1],
  [45, 15, 1, 1], [55, 15, 1, 1],
  [45, 16, 1, 1], [55, 16, 1, 1],
  [45, 17, 1, 1], [55, 17, 1, 1],
  [45, 21, 1, 1], [55, 21, 1, 1],
  [45, 22, 1, 1], [55, 22, 1, 1],
  [45, 23, 1, 1], [55, 23, 1, 1],
  [44, 18, 1, 1], [44, 19, 1, 1], [44, 20, 1, 1],
  [56, 18, 1, 1], [56, 19, 1, 1], [56, 20, 1, 1],
];

// Pad B body: rows 21(76-82), 22-24(75-83), 25(76-82).
const PAD_B_RING_1: ReadonlyArray<Rect> = [
  [76, 20, 7, 1], [76, 26, 7, 1],
  [75, 21, 1, 1], [83, 21, 1, 1],
  [75, 25, 1, 1], [83, 25, 1, 1],
  [74, 22, 1, 1], [74, 23, 1, 1], [74, 24, 1, 1],
  [84, 22, 1, 1], [84, 23, 1, 1], [84, 24, 1, 1],
];
const PAD_B_RING_2: ReadonlyArray<Rect> = [
  [75, 19, 9, 1], [75, 27, 9, 1],
  [74, 20, 1, 1], [84, 20, 1, 1],
  [74, 21, 1, 1], [84, 21, 1, 1],
  [74, 25, 1, 1], [84, 25, 1, 1],
  [74, 26, 1, 1], [84, 26, 1, 1],
  [73, 22, 1, 1], [73, 23, 1, 1], [73, 24, 1, 1],
  [85, 22, 1, 1], [85, 23, 1, 1], [85, 24, 1, 1],
];
const PAD_B_RING_3: ReadonlyArray<Rect> = [
  [74, 18, 11, 1], [74, 28, 11, 1],
  [73, 19, 1, 1], [85, 19, 1, 1],
  [73, 20, 1, 1], [85, 20, 1, 1],
  [73, 21, 1, 1], [85, 21, 1, 1],
  [73, 25, 1, 1], [85, 25, 1, 1],
  [73, 26, 1, 1], [85, 26, 1, 1],
  [73, 27, 1, 1], [85, 27, 1, 1],
  [72, 22, 1, 1], [72, 23, 1, 1], [72, 24, 1, 1],
  [86, 22, 1, 1], [86, 23, 1, 1], [86, 24, 1, 1],
];

// Pad C body: rows 17(100-104), 18-20(99-105), 21(100-104).
const PAD_C_RING_1: ReadonlyArray<Rect> = [
  [100, 16, 5, 1], [100, 22, 5, 1],
  [99, 17, 1, 1], [105, 17, 1, 1],
  [99, 21, 1, 1], [105, 21, 1, 1],
  [98, 18, 1, 1], [98, 19, 1, 1], [98, 20, 1, 1],
  [106, 18, 1, 1], [106, 19, 1, 1], [106, 20, 1, 1],
];
const PAD_C_RING_2: ReadonlyArray<Rect> = [
  [99, 15, 7, 1], [99, 23, 7, 1],
  [98, 16, 1, 1], [106, 16, 1, 1],
  [98, 17, 1, 1], [106, 17, 1, 1],
  [98, 21, 1, 1], [106, 21, 1, 1],
  [98, 22, 1, 1], [106, 22, 1, 1],
  [97, 18, 1, 1], [97, 19, 1, 1], [97, 20, 1, 1],
  [107, 18, 1, 1], [107, 19, 1, 1], [107, 20, 1, 1],
];
const PAD_C_RING_3: ReadonlyArray<Rect> = [
  [98, 14, 9, 1], [98, 24, 9, 1],
  [97, 15, 1, 1], [107, 15, 1, 1],
  [97, 16, 1, 1], [107, 16, 1, 1],
  [97, 17, 1, 1], [107, 17, 1, 1],
  [97, 21, 1, 1], [107, 21, 1, 1],
  [97, 22, 1, 1], [107, 22, 1, 1],
  [97, 23, 1, 1], [107, 23, 1, 1],
  [96, 18, 1, 1], [96, 19, 1, 1], [96, 20, 1, 1],
  [108, 18, 1, 1], [108, 19, 1, 1], [108, 20, 1, 1],
];

const RIPPLE_COLOR = '#c8e3f5';

const FRAME_A_HIGHLIGHTS: ReadonlyArray<Rect> = [
  [22, 11, 8, 1],
  [60, 13, 6, 1],
  [88, 11, 8, 1],
  [115, 14, 7, 1],
  [35, 28, 10, 1],
  [110, 30, 8, 1],
  [18, 22, 4, 1],
  [128, 26, 5, 1],
  [62, 32, 8, 1],
  [42, 9, 3, 1],
];

const FRAME_B_HIGHLIGHTS: ReadonlyArray<Rect> = [
  [32, 11, 6, 1],
  [70, 13, 8, 1],
  [98, 11, 6, 1],
  [122, 14, 6, 1],
  [50, 30, 8, 1],
  [120, 28, 6, 1],
  [22, 20, 5, 1],
  [130, 24, 4, 1],
  [82, 32, 6, 1],
  [54, 9, 4, 1],
];

const HIGHLIGHT_COLOR = '#a5d3ee';

const STYLES = `
.pond-a { animation: pond-shimmer-a 3.6s steps(1) infinite; }
.pond-b { animation: pond-shimmer-b 3.6s steps(1) infinite; }
.lily-pad-group {
  animation: pad-drift 12s steps(4, end) infinite;
}
.pad-a { animation-delay: 0s; }
.pad-b { animation-delay: -4s; }
.pad-c { animation-delay: -8s; }
@keyframes pad-drift {
  0%   { transform: translate(0px, 0px); }
  25%  { transform: translate(1px, 0px); }
  50%  { transform: translate(0px, 0px); }
  75%  { transform: translate(-1px, 0px); }
  100% { transform: translate(0px, 0px); }
}
@keyframes pond-shimmer-a {
  0%, 49.99% { opacity: 1; }
  50%, 100%  { opacity: 0; }
}
@keyframes pond-shimmer-b {
  0%, 49.99% { opacity: 0; }
  50%, 100%  { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .pond-a, .pond-b, .lily-pad-group { animation: none; }
  .pond-b { opacity: 0; }
}
`;

// Pre-render the large STATIC_LAYERS (earth + water + outline) as a cached img.
// Removes ~300 rects from runtime DOM; static base painted once into bitmap and
// shared across renders. Animated parts stay inline SVG above.
const STATIC_SVG_STRING = `<svg xmlns="http://www.w3.org/2000/svg" width="${VB_W}" height="${VB_H}" viewBox="0 0 ${VB_W} ${VB_H}" shape-rendering="crispEdges">${STATIC_LAYERS.map(
  (l) =>
    l.rects
      .map(
        ([x, y, w, h]) =>
          `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${l.fill}"/>`
      )
      .join('')
).join('')}</svg>`;
const STATIC_SRC = `data:image/svg+xml;utf8,${encodeURIComponent(STATIC_SVG_STRING)}`;

interface PondProps {
  size?: number;
  className?: string;
}

export function Pond({ size = 900, className }: PondProps) {
  const h = (size * VB_H) / VB_W;
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ position: 'relative', display: 'block', width: size, height: h }}
    >
      <img
        src={STATIC_SRC}
        alt=""
        decoding="async"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size,
          height: h,
          maxWidth: 'none',
          imageRendering: 'pixelated',
        }}
      />
      <svg
        aria-hidden="true"
        width={size}
        height={h}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        shapeRendering="crispEdges"
        style={{ position: 'absolute', top: 0, left: 0, display: 'block' }}
      >
        <style>{STYLES}</style>
        {/* Static base baked into img above. Only animated layers below. */}
        <g className="pond-a">
        {FRAME_A_HIGHLIGHTS.map(([x, y, w, h], i) => (
          <rect key={`a-${i}`} x={x} y={y} width={w} height={h} fill={HIGHLIGHT_COLOR} />
        ))}
      </g>
      <g className="pond-b">
        {FRAME_B_HIGHLIGHTS.map(([x, y, w, h], i) => (
          <rect key={`b-${i}`} x={x} y={y} width={w} height={h} fill={HIGHLIGHT_COLOR} />
        ))}
      </g>
      <g className="lily-pad-group pad-a" data-frog-pad="0">
        <g opacity="0.25">
          {PAD_A_RING_3.map(([x, y, w, h], i) => (
            <rect key={`a3-${i}`} x={x} y={y} width={w} height={h} fill={RIPPLE_COLOR} />
          ))}
        </g>
        <g opacity="0.45">
          {PAD_A_RING_2.map(([x, y, w, h], i) => (
            <rect key={`a2-${i}`} x={x} y={y} width={w} height={h} fill={RIPPLE_COLOR} />
          ))}
        </g>
        <g opacity="0.7">
          {PAD_A_RING_1.map(([x, y, w, h], i) => (
            <rect key={`a1-${i}`} x={x} y={y} width={w} height={h} fill={RIPPLE_COLOR} />
          ))}
        </g>
        {PAD_A_LAYERS.flatMap((l, li) =>
          l.rects.map(([x, y, w, h], ri) => (
            <rect key={`pa-${li}-${ri}`} x={x} y={y} width={w} height={h} fill={l.fill} />
          ))
        )}
      </g>
      <g className="lily-pad-group pad-b" data-frog-pad="1">
        <g opacity="0.25">
          {PAD_B_RING_3.map(([x, y, w, h], i) => (
            <rect key={`b3-${i}`} x={x} y={y} width={w} height={h} fill={RIPPLE_COLOR} />
          ))}
        </g>
        <g opacity="0.45">
          {PAD_B_RING_2.map(([x, y, w, h], i) => (
            <rect key={`b2-${i}`} x={x} y={y} width={w} height={h} fill={RIPPLE_COLOR} />
          ))}
        </g>
        <g opacity="0.7">
          {PAD_B_RING_1.map(([x, y, w, h], i) => (
            <rect key={`b1-${i}`} x={x} y={y} width={w} height={h} fill={RIPPLE_COLOR} />
          ))}
        </g>
        {PAD_B_LAYERS.flatMap((l, li) =>
          l.rects.map(([x, y, w, h], ri) => (
            <rect key={`pb-${li}-${ri}`} x={x} y={y} width={w} height={h} fill={l.fill} />
          ))
        )}
      </g>
      <g className="lily-pad-group pad-c" data-frog-pad="2">
        <g opacity="0.25">
          {PAD_C_RING_3.map(([x, y, w, h], i) => (
            <rect key={`c3-${i}`} x={x} y={y} width={w} height={h} fill={RIPPLE_COLOR} />
          ))}
        </g>
        <g opacity="0.45">
          {PAD_C_RING_2.map(([x, y, w, h], i) => (
            <rect key={`c2-${i}`} x={x} y={y} width={w} height={h} fill={RIPPLE_COLOR} />
          ))}
        </g>
        <g opacity="0.7">
          {PAD_C_RING_1.map(([x, y, w, h], i) => (
            <rect key={`c1-${i}`} x={x} y={y} width={w} height={h} fill={RIPPLE_COLOR} />
          ))}
        </g>
        {PAD_C_LAYERS.flatMap((l, li) =>
          l.rects.map(([x, y, w, h], ri) => (
            <rect key={`pc-${li}-${ri}`} x={x} y={y} width={w} height={h} fill={l.fill} />
          ))
        )}
      </g>
      </svg>
    </div>
  );
}
