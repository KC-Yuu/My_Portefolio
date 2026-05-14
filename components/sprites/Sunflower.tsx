type Rect = readonly [x: number, y: number, w: number, h: number];

interface Layer {
  fill: string;
  rects: ReadonlyArray<Rect>;
}

const VB_W = 12;
const VB_H = 24;

const LAYERS: ReadonlyArray<Layer> = [
  // Stem
  { fill: '#4a8c3a', rects: [[5, 8, 2, 16]] },
  { fill: '#2a5a20', rects: [[6, 8, 1, 16]] },

  // Upper leaves (around y=13-14)
  { fill: '#5aaa42', rects: [[2, 14, 3, 1], [3, 13, 2, 1], [7, 14, 3, 1], [7, 13, 2, 1]] },
  { fill: '#3a7a2a', rects: [[2, 14, 1, 1], [9, 14, 1, 1]] },

  // Lower leaves (around y=19)
  { fill: '#5aaa42', rects: [[3, 19, 2, 1], [7, 19, 2, 1]] },
  { fill: '#3a7a2a', rects: [[3, 19, 1, 1], [8, 19, 1, 1]] },

  // Flower head — outer petals (yellow)
  { fill: '#f5c83a', rects: [
    [4, 0, 4, 1],
    [3, 1, 6, 1],
    [2, 2, 8, 1],
    [2, 3, 8, 1],
    [2, 4, 8, 1],
    [2, 5, 8, 1],
    [3, 6, 6, 1],
    [4, 7, 4, 1],
  ] },

  // Petal shading on right/bottom edge
  { fill: '#d4a020', rects: [
    [8, 2, 1, 1],
    [9, 3, 1, 1],
    [9, 4, 1, 1],
    [8, 5, 1, 1],
    [7, 6, 2, 1],
    [6, 7, 2, 1],
  ] },

  // Disk (brown center)
  { fill: '#6a3a18', rects: [[4, 3, 4, 2]] },
  // Disk highlight (top-left of disk)
  { fill: '#8a5028', rects: [[4, 3, 2, 1]] },
  // Seeds (dark dots)
  { fill: '#1a0808', rects: [[5, 4, 1, 1], [7, 4, 1, 1], [6, 3, 1, 1]] },
];

function buildSvg(): string {
  const body = LAYERS
    .map((l) =>
      l.rects
        .map(([x, y, w, h]) => `<rect x='${x}' y='${y}' width='${w}' height='${h}' fill='${l.fill}'/>`)
        .join(''),
    )
    .join('');
  return `<svg xmlns='http://www.w3.org/2000/svg' width='${VB_W}' height='${VB_H}' viewBox='0 0 ${VB_W} ${VB_H}' shape-rendering='crispEdges'>${body}</svg>`;
}

const SRC = `data:image/svg+xml;utf8,${encodeURIComponent(buildSvg())}`;

interface SunflowerProps {
  size?: number;
  className?: string;
}

export function Sunflower({ size = 30, className }: SunflowerProps) {
  return (
    <img
      src={SRC}
      alt=""
      decoding="async"
      aria-hidden="true"
      className={className}
      style={{
        display: 'block',
        width: (size * VB_W) / VB_H,
        height: size,
        maxWidth: 'none',
        imageRendering: 'pixelated',
      }}
    />
  );
}
