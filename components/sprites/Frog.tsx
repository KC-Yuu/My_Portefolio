type Rect = readonly [x: number, y: number, w: number, h: number];

const BODY_RECTS: ReadonlyArray<Rect> = [
  [2, 0, 4, 1],
  [1, 1, 6, 1],
  [0, 2, 8, 1],
  [0, 3, 8, 1],
  [1, 4, 6, 1],
  [2, 5, 1, 1], [5, 5, 1, 1],
];

const HIGHLIGHT_RECTS: ReadonlyArray<Rect> = [
  [3, 3, 2, 1],
  [4, 4, 1, 1],
];

const EYE_WHITE_RECTS: ReadonlyArray<Rect> = [
  [2, 1, 1, 1], [5, 1, 1, 1],
];

const EYE_PUPIL_RECTS: ReadonlyArray<Rect> = [
  [2, 2, 1, 1], [5, 2, 1, 1],
];

function rectsTo(fill: string, rects: ReadonlyArray<Rect>): string {
  return rects
    .map(
      ([x, y, w, h]) =>
        `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`
    )
    .join('');
}

const SRC = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="6" viewBox="0 0 8 6" shape-rendering="crispEdges">${rectsTo('#4a8b3a', BODY_RECTS)}${rectsTo('#6dbb4a', HIGHLIGHT_RECTS)}${rectsTo('#fffaf0', EYE_WHITE_RECTS)}${rectsTo('#1a1a1a', EYE_PUPIL_RECTS)}</svg>`
)}`;

interface FrogProps {
  size?: number;
  className?: string;
}

export function Frog({ size = 22, className }: FrogProps) {
  return (
    <img
      aria-hidden="true"
      src={SRC}
      alt=""
      decoding="async"
      className={className}
      style={{
        display: 'block',
        width: (size * 8) / 6,
        height: size,
        maxWidth: 'none',
        imageRendering: 'pixelated',
      }}
    />
  );
}
