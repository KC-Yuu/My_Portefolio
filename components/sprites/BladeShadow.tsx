type Rect = readonly [x: number, y: number, w: number, h: number];

// Stepped diagonal parallelogram projecting down-left from base of sprite.
// Anchor (top-right corner of viewBox) sits at base of blade; sprite extends
// down-left onto the ground.
const RECTS: ReadonlyArray<Rect> = [
  [13, 0, 5, 1],
  [10, 1, 5, 1],
  [7, 2, 5, 1],
  [4, 3, 5, 1],
  [1, 4, 5, 1],
  [0, 5, 3, 1],
];

const VB_W = 18;
const VB_H = 6;

const SVG_STRING = `<svg xmlns="http://www.w3.org/2000/svg" width="${VB_W}" height="${VB_H}" viewBox="0 0 ${VB_W} ${VB_H}" shape-rendering="crispEdges">${RECTS.map(
  ([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#000"/>`
).join('')}</svg>`;
const SRC = `data:image/svg+xml;utf8,${encodeURIComponent(SVG_STRING)}`;

interface BladeShadowProps {
  size?: number;
  className?: string;
}

export function BladeShadow({ size = 24, className }: BladeShadowProps) {
  return (
    <img
      aria-hidden="true"
      src={SRC}
      alt=""
      decoding="async"
      className={className}
      style={{
        display: 'block',
        width: size,
        height: (size * VB_H) / VB_W,
        maxWidth: 'none',
        imageRendering: 'pixelated',
      }}
    />
  );
}
