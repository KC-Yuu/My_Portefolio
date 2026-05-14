type Rect = readonly [x: number, y: number, w: number, h: number];

interface Layer {
  fill: string;
  rects: ReadonlyArray<Rect>;
}

const REAR_HUB_CX = 23;
const REAR_HUB_CY = 19.5;
const FRONT_HUB_CX = 37.5;
const FRONT_HUB_CY = 20.5;

// Side-view tractor facing RIGHT, seed drill trailing on the LEFT. viewBox 44 x 24.
// Mirrors Tractor.tsx body/wheels/window/exhaust/headlight/antenna exactly —
// only the trailing implement (plow) is swapped for a seed drill.
const LAYERS: ReadonlyArray<Layer> = [
  // ---------- Seed drill ----------
  // Hitch arm (same anchor as plow hitch)
  { fill: '#4a3018', rects: [[14, 12, 5, 1], [14, 13, 1, 2]] },

  // Hopper body (green metal)
  { fill: '#5a8a3a', rects: [[3, 10, 13, 6]] },
  // Hopper top + left highlight
  { fill: '#7aaa5a', rects: [[3, 10, 13, 1], [3, 10, 1, 6]] },
  // Hopper right + bottom shadow
  { fill: '#3a6a20', rects: [[15, 11, 1, 5], [3, 15, 13, 1]] },
  // Hopper opening (darker rim)
  { fill: '#2a4a1a', rects: [[5, 9, 9, 1]] },
  // Seeds visible at top of hopper (sunflower seeds: black + cream)
  { fill: '#1a0f08', rects: [[5, 9, 1, 1], [9, 9, 1, 1], [13, 9, 1, 1]] },
  { fill: '#f0d878', rects: [[6, 9, 1, 1], [10, 9, 1, 1]] },
  { fill: '#8a6020', rects: [[7, 9, 1, 1], [11, 9, 1, 1]] },
  { fill: '#1a0f08', rects: [[8, 9, 1, 1], [12, 9, 1, 1]] },

  // Frame bar below hopper
  { fill: '#3a2818', rects: [[2, 16, 14, 1]] },

  // Seed delivery tubes (3 drops from hopper to ground)
  { fill: '#4a4a4a', rects: [[4, 17, 1, 2], [9, 17, 1, 2], [14, 17, 1, 2]] },
  { fill: '#6a6a6a', rects: [[4, 17, 1, 1], [9, 17, 1, 1], [14, 17, 1, 1]] },

  // Disc openers (3 small dark wheels at ground)
  { fill: '#1a1a1a', rects: [[2, 19, 4, 2], [7, 19, 4, 2], [12, 19, 4, 2]] },
  // Disc top highlight
  { fill: '#5a5a5a', rects: [[2, 19, 4, 1], [7, 19, 4, 1], [12, 19, 4, 1]] },
  // Center bolts (brass)
  { fill: '#d4a040', rects: [[3, 20, 1, 1], [8, 20, 1, 1], [13, 20, 1, 1]] },
  // Disc edge shadow
  { fill: '#0a0a0a', rects: [[2, 20, 1, 1], [5, 20, 1, 1], [7, 20, 1, 1], [10, 20, 1, 1], [12, 20, 1, 1], [15, 20, 1, 1]] },

  // ---------- Body ----------
  { fill: '#6a1a14', rects: [[19, 15, 20, 1], [18, 13, 2, 2]] },
  { fill: '#c8362e', rects: [
    [18, 11, 4, 4], [21, 8, 10, 7], [30, 10, 9, 5], [38, 11, 2, 2],
    [21, 2, 10, 2], [21, 4, 1, 6], [30, 4, 1, 6], [20, 1, 12, 1],
  ] },
  { fill: '#e85a4e', rects: [
    [21, 1, 11, 1], [21, 2, 10, 1], [30, 10, 9, 1], [21, 8, 10, 1], [18, 11, 4, 1],
  ] },
  { fill: '#8c1f1a', rects: [[21, 14, 10, 1], [30, 14, 9, 1], [38, 12, 1, 1]] },
  { fill: '#5a1208', rects: [[33, 11, 1, 3], [35, 11, 1, 3], [37, 11, 1, 3]] },
  { fill: '#ff7a6a', rects: [[31, 10, 1, 1], [34, 10, 1, 1], [37, 10, 1, 1]] },
  { fill: '#6a1a14', rects: [[26, 9, 1, 5], [22, 11, 4, 1]] },
  { fill: '#d4a040', rects: [[25, 11, 1, 1]] },
  { fill: '#8c1f1a', rects: [[22, 1, 1, 1], [25, 1, 1, 1], [28, 1, 1, 1], [31, 1, 1, 1]] },

  // ---------- Window ----------
  { fill: '#7ab3e0', rects: [[22, 4, 8, 4]] },
  { fill: '#b8d8f0', rects: [[22, 4, 8, 1], [22, 4, 1, 4]] },
  { fill: '#2c4d6a', rects: [[25, 4, 1, 4], [22, 6, 8, 1]] },
  { fill: '#dceaf5', rects: [[23, 5, 1, 1], [28, 5, 1, 1]] },

  // ---------- Exhaust ----------
  { fill: '#2a2a2a', rects: [[32, 5, 2, 6]] },
  { fill: '#4a4a4a', rects: [[32, 5, 1, 6]] },
  { fill: '#6a6a6a', rects: [[32, 4, 2, 1]] },

  // ---------- Headlight ----------
  { fill: '#f5e58a', rects: [[38, 10, 1, 1]] },
  { fill: '#fffaa0', rects: [[39, 10, 1, 1]] },

  // ---------- Antenna ----------
  { fill: '#3a3a3a', rects: [[29, 0, 1, 1]] },
  { fill: '#d4a040', rects: [[30, 0, 1, 1]] },

  // ---------- Rear wheel (static) ----------
  { fill: '#1a1a1a', rects: [[19, 16, 8, 1], [18, 17, 10, 5], [19, 22, 8, 1]] },
  { fill: '#3a3a3a', rects: [
    [20, 17, 1, 1], [24, 17, 1, 1], [19, 19, 1, 1], [27, 19, 1, 1], [21, 21, 1, 1], [25, 21, 1, 1],
  ] },
  { fill: '#0a0a0a', rects: [
    [21, 17, 1, 1], [25, 17, 1, 1], [18, 18, 1, 1], [27, 18, 1, 1],
    [19, 20, 1, 1], [27, 20, 1, 1], [22, 22, 1, 1], [26, 22, 1, 1],
  ] },
  { fill: '#d4a040', rects: [[21, 18, 4, 3]] },
  { fill: '#8c6420', rects: [[22, 19, 2, 1]] },

  // ---------- Front wheel (static) ----------
  { fill: '#1a1a1a', rects: [[35, 18, 5, 1], [34, 19, 7, 3], [35, 22, 5, 1]] },
  { fill: '#3a3a3a', rects: [[36, 19, 1, 1], [39, 19, 1, 1], [35, 21, 1, 1]] },
  { fill: '#0a0a0a', rects: [
    [35, 19, 1, 1], [38, 19, 1, 1], [34, 20, 1, 1], [40, 20, 1, 1], [36, 22, 1, 1], [39, 22, 1, 1],
  ] },
  { fill: '#d4a040', rects: [[36, 20, 3, 1]] },
];

const REAR_SPOKES: ReadonlyArray<Layer> = [
  { fill: '#1a1a1a', rects: [[22, 18, 1, 1], [24, 20, 1, 1]] },
  { fill: '#f0c060', rects: [[23, 19, 1, 1]] },
];
const FRONT_SPOKES: ReadonlyArray<Layer> = [
  { fill: '#1a1a1a', rects: [[37, 19, 1, 1], [38, 21, 1, 1]] },
];

interface TractorSeederProps {
  size?: number;
  className?: string;
}

function renderLayer(layer: Layer, key: string) {
  return (
    <g key={key} fill={layer.fill}>
      {layer.rects.map(([x, y, w, h], ri) => (
        <rect key={`r-${key}-${ri}`} x={x} y={y} width={w} height={h} />
      ))}
    </g>
  );
}

export function TractorSeeder({ size = 48, className }: TractorSeederProps) {
  const VB_W = 44;
  const VB_H = 24;
  return (
    <svg
      aria-hidden="true"
      width={(size * VB_W) / VB_H}
      height={size}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      shapeRendering="crispEdges"
      className={className}
      style={{ display: 'block' }}
    >
      <style>{`
        @keyframes tractor-seeder-spoke-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .tractor-seeder-spoke {
          animation: tractor-seeder-spoke-spin 0.5s steps(4) infinite;
          transform-box: fill-box;
        }
        @media (prefers-reduced-motion: reduce) {
          .tractor-seeder-spoke { animation: none; }
        }
      `}</style>
      {LAYERS.map((l, i) => renderLayer(l, `body-${i}`))}
      <g
        className="tractor-seeder-spoke"
        style={{ transformOrigin: `${REAR_HUB_CX}px ${REAR_HUB_CY}px` }}
      >
        {REAR_SPOKES.map((l, i) => renderLayer(l, `rs-${i}`))}
      </g>
      <g
        className="tractor-seeder-spoke"
        style={{ transformOrigin: `${FRONT_HUB_CX}px ${FRONT_HUB_CY}px` }}
      >
        {FRONT_SPOKES.map((l, i) => renderLayer(l, `fs-${i}`))}
      </g>
    </svg>
  );
}
