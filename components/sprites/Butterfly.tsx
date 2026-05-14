type Rect = readonly [x: number, y: number, w: number, h: number];

interface Layer {
  fill: string;
  rects: ReadonlyArray<Rect>;
}

interface Frame {
  wings: ReadonlyArray<Layer>;
}

interface ButterflyShape {
  body: ReadonlyArray<Layer>;
  frameA: Frame;
  frameB: Frame;
}

const BODY_COLOR = '#2b1d1a';

const SHAPES = {
  monarch: {
    body: [
      { fill: BODY_COLOR, rects: [
        [5, 2, 2, 4],
        [4, 0, 1, 1], [7, 0, 1, 1],
        [4, 1, 1, 1], [7, 1, 1, 1],
      ]},
    ],
    frameA: {
      wings: [
        { fill: '#ff7a3a', rects: [
          [1, 1, 4, 3], [7, 1, 4, 3],
          [2, 4, 3, 2], [7, 4, 3, 2],
        ]},
        { fill: '#c44a16', rects: [
          [1, 2, 1, 1], [10, 2, 1, 1],
          [2, 5, 1, 1], [9, 5, 1, 1],
        ]},
      ],
    },
    frameB: {
      wings: [
        { fill: '#ff7a3a', rects: [
          [3, 1, 2, 3], [7, 1, 2, 3],
          [3, 4, 2, 2], [7, 4, 2, 2],
        ]},
        { fill: '#c44a16', rects: [
          [3, 3, 1, 1], [8, 3, 1, 1],
        ]},
      ],
    },
  },
  azure: {
    body: [
      { fill: BODY_COLOR, rects: [
        [5, 2, 2, 4],
        [4, 0, 1, 1], [7, 0, 1, 1],
        [4, 1, 1, 1], [7, 1, 1, 1],
      ]},
    ],
    frameA: {
      wings: [
        { fill: '#7ab8e8', rects: [
          [1, 1, 4, 3], [7, 1, 4, 3],
          [2, 4, 3, 2], [7, 4, 3, 2],
        ]},
        { fill: '#3b6fa8', rects: [
          [1, 2, 1, 1], [10, 2, 1, 1],
          [2, 5, 1, 1], [9, 5, 1, 1],
        ]},
      ],
    },
    frameB: {
      wings: [
        { fill: '#7ab8e8', rects: [
          [3, 1, 2, 3], [7, 1, 2, 3],
          [3, 4, 2, 2], [7, 4, 2, 2],
        ]},
        { fill: '#3b6fa8', rects: [
          [3, 3, 1, 1], [8, 3, 1, 1],
        ]},
      ],
    },
  },
} as const satisfies Record<string, ButterflyShape>;

export type ButterflyVariant = keyof typeof SHAPES;
export const BUTTERFLY_VARIANTS = Object.keys(SHAPES) as ButterflyVariant[];

// Pre-render each frame (wings + body baked together) as a cached img per variant.
// CSS animation toggles opacity between frame A and B — compositor handles flap.
function layersToRects(layers: ReadonlyArray<Layer>): string {
  return layers
    .map((l) =>
      l.rects
        .map(
          ([x, y, w, h]) =>
            `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${l.fill}"/>`
        )
        .join('')
    )
    .join('');
}

function buildFrameSvg(shape: ButterflyShape, frame: 'frameA' | 'frameB'): string {
  const wings = layersToRects(shape[frame].wings);
  const body = layersToRects(shape.body);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" shape-rendering="crispEdges">${wings}${body}</svg>`;
}

const VARIANT_FRAME_A = Object.fromEntries(
  (Object.keys(SHAPES) as ButterflyVariant[]).map((v) => [
    v,
    `data:image/svg+xml;utf8,${encodeURIComponent(buildFrameSvg(SHAPES[v], 'frameA'))}`,
  ])
) as Record<ButterflyVariant, string>;

const VARIANT_FRAME_B = Object.fromEntries(
  (Object.keys(SHAPES) as ButterflyVariant[]).map((v) => [
    v,
    `data:image/svg+xml;utf8,${encodeURIComponent(buildFrameSvg(SHAPES[v], 'frameB'))}`,
  ])
) as Record<ButterflyVariant, string>;

const FRAME_STYLES = `
.bf-a { animation: bf-flap-a 0.32s steps(1) infinite; }
.bf-b { animation: bf-flap-b 0.32s steps(1) infinite; }
@keyframes bf-flap-a {
  0%, 49.99% { opacity: 1; }
  50%, 100%  { opacity: 0; }
}
@keyframes bf-flap-b {
  0%, 49.99% { opacity: 0; }
  50%, 100%  { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .bf-a, .bf-b { animation: none; }
  .bf-b { opacity: 0; }
}
`;

let stylesInjected = false;
function ensureStyles() {
  if (stylesInjected || typeof document === 'undefined') return;
  const el = document.createElement('style');
  el.textContent = FRAME_STYLES;
  document.head.appendChild(el);
  stylesInjected = true;
}

interface ButterflyProps {
  variant: ButterflyVariant;
  size?: number;
  className?: string;
}

export function Butterfly({ variant, size = 24, className }: ButterflyProps) {
  ensureStyles();
  const w = (size * 12) / 8;
  const imgStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: w,
    height: size,
    maxWidth: 'none',
    imageRendering: 'pixelated',
  };
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ position: 'relative', display: 'block', width: w, height: size }}
    >
      <img className="bf-a" src={VARIANT_FRAME_A[variant]} alt="" decoding="async" style={imgStyle} />
      <img className="bf-b" src={VARIANT_FRAME_B[variant]} alt="" decoding="async" style={imgStyle} />
    </div>
  );
}
