type Rect = readonly [x: number, y: number, w: number, h: number];

interface Layer {
  fill: string;
  rects: ReadonlyArray<Rect>;
}

const VB_W = 56;
const VB_H = 26;

// Combine harvester facing RIGHT. Header (cutterbar + reel) on the right,
// grain tank on top of body, cab in the middle, exhaust pipe.
// Big front wheel, small rear wheel (canonical combine layout).
const LAYERS: ReadonlyArray<Layer> = [
  // ---------- Header (cutterbar + bar + reel posts) ----------
  // Header bar (red, projects forward)
  { fill: '#3d8b27', rects: [[38, 17, 18, 4]] },
  { fill: '#5cb03a', rects: [[38, 17, 18, 1]] },
  { fill: '#235817', rects: [[38, 20, 18, 1]] },
  // Cutterbar (black row)
  { fill: '#1a1a1a', rects: [[38, 21, 18, 1]] },
  // Cutterbar teeth (alternating)
  { fill: '#5a5a5a', rects: [
    [39, 22, 1, 1], [41, 22, 1, 1], [43, 22, 1, 1], [45, 22, 1, 1],
    [47, 22, 1, 1], [49, 22, 1, 1], [51, 22, 1, 1], [53, 22, 1, 1], [55, 22, 1, 1],
  ] },
  // Header attachment arm
  { fill: '#1a4011', rects: [[36, 18, 3, 3]] },

  // Reel posts (3 verticals)
  { fill: '#2a2a2a', rects: [[40, 12, 1, 5], [46, 12, 1, 5], [52, 12, 1, 5]] },
  // Reel bar (axis) — horizontal yellow rod
  { fill: '#d4a040', rects: [[39, 11, 16, 2]] },
  { fill: '#f0c060', rects: [[39, 11, 16, 1]] },
  // Reel paddles (vertical fins below bar) — static frame
  { fill: '#f0c060', rects: [[40, 13, 1, 3], [44, 13, 1, 3], [48, 13, 1, 3], [52, 13, 1, 3]] },

  // ---------- Body chassis (red) ----------
  { fill: '#3d8b27', rects: [[4, 13, 34, 9]] },
  { fill: '#5cb03a', rects: [[4, 13, 34, 1]] },
  { fill: '#235817', rects: [[4, 21, 34, 1]] },
  { fill: '#1a4011', rects: [[36, 14, 2, 4]] },
  // Engine vents
  { fill: '#11300a', rects: [[6, 16, 1, 3], [9, 16, 1, 3], [12, 16, 1, 3]] },
  { fill: '#f0c060', rects: [[6, 15, 1, 1], [9, 15, 1, 1], [12, 15, 1, 1]] },

  // ---------- Grain tank (top-back of body) ----------
  { fill: '#a89028', rects: [[4, 6, 14, 7]] },
  { fill: '#d4b440', rects: [[4, 6, 14, 1], [4, 6, 1, 7]] },
  { fill: '#6a5818', rects: [[17, 6, 1, 7], [4, 12, 14, 1]] },
  // Tank top hatch
  { fill: '#3a2818', rects: [[8, 4, 6, 2]] },
  { fill: '#5a3818', rects: [[8, 4, 6, 1]] },
  // Grain visible in tank
  { fill: '#f0d878', rects: [[10, 5, 2, 1]] },
  { fill: '#d4a040', rects: [[11, 5, 1, 1]] },

  // ---------- Cab ----------
  { fill: '#3d8b27', rects: [[20, 4, 16, 10]] },
  { fill: '#5cb03a', rects: [[20, 4, 16, 1], [20, 4, 1, 10]] },
  { fill: '#235817', rects: [[35, 4, 1, 10], [20, 13, 16, 1]] },
  // Cab window
  { fill: '#7ab3e0', rects: [[22, 6, 12, 6]] },
  { fill: '#b8d8f0', rects: [[22, 6, 12, 1], [22, 6, 1, 6]] },
  { fill: '#2c4d6a', rects: [[27, 6, 1, 6], [22, 9, 12, 1]] },
  { fill: '#dceaf5', rects: [[23, 7, 1, 1], [29, 7, 1, 1]] },

  // ---------- Exhaust pipe (tall, above tank) ----------
  { fill: '#2a2a2a', rects: [[15, 0, 2, 6]] },
  { fill: '#4a4a4a', rects: [[15, 0, 1, 6]] },
  { fill: '#6a6a6a', rects: [[15, 0, 2, 1]] },

  // ---------- Antenna ----------
  { fill: '#3a3a3a', rects: [[30, 2, 1, 2]] },
  { fill: '#d4a040', rects: [[30, 1, 1, 1]] },

  // ---------- Front BIG wheel (right side) ----------
  { fill: '#1a1a1a', rects: [[40, 19, 11, 6], [41, 18, 9, 1], [41, 25, 9, 1]] },
  { fill: '#3a3a3a', rects: [
    [42, 19, 1, 1], [48, 19, 1, 1], [40, 21, 1, 1], [50, 21, 1, 1],
    [43, 24, 1, 1], [47, 24, 1, 1],
  ] },
  { fill: '#0a0a0a', rects: [
    [41, 19, 1, 1], [49, 19, 1, 1], [40, 22, 1, 1], [50, 22, 1, 1],
    [42, 25, 1, 1], [49, 25, 1, 1],
  ] },
  // Hub face (static)
  { fill: '#d4a040', rects: [[43, 21, 5, 3]] },
  { fill: '#8c6420', rects: [[44, 22, 3, 1]] },

  // ---------- Rear small wheel (left side) ----------
  { fill: '#1a1a1a', rects: [[3, 22, 7, 3], [4, 21, 5, 1], [4, 25, 5, 1]] },
  { fill: '#3a3a3a', rects: [[4, 22, 1, 1], [8, 22, 1, 1], [3, 23, 1, 1], [9, 23, 1, 1]] },
  { fill: '#0a0a0a', rects: [[3, 22, 1, 1], [9, 22, 1, 1]] },
  // Rear hub
  { fill: '#d4a040', rects: [[5, 23, 3, 1]] },
];

// Rotating spokes (only these spin, hub face + tire stay still).
const FRONT_HUB_CX = 45.5;
const FRONT_HUB_CY = 22;
const REAR_HUB_CX = 6.5;
const REAR_HUB_CY = 23;

const FRONT_SPOKES: ReadonlyArray<Layer> = [
  { fill: '#1a1a1a', rects: [[44, 21, 1, 1], [46, 23, 1, 1]] },
  { fill: '#f0c060', rects: [[45, 22, 1, 1]] },
];
const REAR_SPOKES: ReadonlyArray<Layer> = [
  { fill: '#1a1a1a', rects: [[5, 22, 1, 1], [7, 24, 1, 1]] },
];

interface CombineProps {
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

export function Combine({ size = 84, className }: CombineProps) {
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
        @keyframes combine-spoke-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .combine-spoke {
          animation: combine-spoke-spin 0.5s steps(4) infinite;
          transform-box: fill-box;
        }
        @media (prefers-reduced-motion: reduce) {
          .combine-spoke { animation: none; }
        }
      `}</style>
      {LAYERS.map((l, i) => renderLayer(l, `body-${i}`))}
      <g
        className="combine-spoke"
        style={{ transformOrigin: `${FRONT_HUB_CX}px ${FRONT_HUB_CY}px` }}
      >
        {FRONT_SPOKES.map((l, i) => renderLayer(l, `fs-${i}`))}
      </g>
      <g
        className="combine-spoke"
        style={{ transformOrigin: `${REAR_HUB_CX}px ${REAR_HUB_CY}px` }}
      >
        {REAR_SPOKES.map((l, i) => renderLayer(l, `rs-${i}`))}
      </g>
    </svg>
  );
}
