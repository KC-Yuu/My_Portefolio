type Rect = readonly [x: number, y: number, w: number, h: number];

const DISC_BASE: ReadonlyArray<Rect> = [
  [13, 9, 6, 1], [11, 10, 10, 1], [10, 11, 12, 1], [10, 12, 12, 1],
  [9, 13, 14, 1], [9, 14, 14, 1], [9, 15, 14, 1], [9, 16, 14, 1],
  [9, 17, 14, 1], [9, 18, 14, 1], [10, 19, 12, 1], [10, 20, 12, 1],
  [11, 21, 10, 1], [13, 22, 6, 1],
];

const DISC_HIGHLIGHT: ReadonlyArray<Rect> = [
  [11, 10, 2, 1], [10, 11, 2, 1], [10, 12, 1, 1],
  [9, 13, 1, 1], [9, 14, 1, 1],
];

const DISC_SHADOW: ReadonlyArray<Rect> = [
  [22, 18, 1, 1], [21, 19, 1, 1], [20, 20, 2, 1],
  [18, 21, 3, 1], [16, 22, 3, 1],
];

const RAYS_LONG: ReadonlyArray<Rect> = [
  [15, 2, 2, 2], [14, 4, 4, 2], [13, 6, 6, 2], [12, 8, 8, 1],
  [12, 23, 8, 1], [13, 24, 6, 2], [14, 26, 4, 2], [15, 28, 2, 2],
  [23, 12, 1, 8], [24, 13, 2, 6], [26, 14, 2, 4], [28, 15, 2, 2],
  [8, 12, 1, 8], [6, 13, 2, 6], [4, 14, 2, 4], [2, 15, 2, 2],
];

const RAYS_SHORT: ReadonlyArray<Rect> = [
  [22, 7, 2, 1], [23, 6, 2, 1], [24, 5, 1, 1],
  [8, 7, 2, 1], [7, 6, 2, 1], [7, 5, 1, 1],
  [22, 24, 2, 1], [23, 25, 2, 1], [24, 26, 1, 1],
  [8, 24, 2, 1], [7, 25, 2, 1], [7, 26, 1, 1],
];

const EYES: ReadonlyArray<Rect> = [
  [12, 14, 2, 1], [18, 14, 2, 1],
];

const MOUTH: ReadonlyArray<Rect> = [
  [13, 17, 1, 1], [18, 17, 1, 1], [14, 18, 4, 1],
];

const SPARKLES_A: ReadonlyArray<Rect> = [
  [30, 4, 1, 1], [1, 27, 1, 1], [27, 1, 1, 1], [4, 30, 1, 1],
];

const SPARKLES_B: ReadonlyArray<Rect> = [
  [1, 4, 1, 1], [30, 27, 1, 1], [4, 1, 1, 1], [27, 30, 1, 1],
];

// Sunglasses overlay — covers the eyes when withShades is true.
const SHADES_FRAME: ReadonlyArray<Rect> = [
  // Left lens (cols 11-14)
  [11, 13, 4, 1], [11, 14, 4, 1], [11, 15, 4, 1],
  // Right lens (cols 17-20)
  [17, 13, 4, 1], [17, 14, 4, 1], [17, 15, 4, 1],
  // Bridge
  [15, 14, 2, 1],
  // Outer brow tips
  [10, 13, 1, 1], [21, 13, 1, 1],
];

const SHADES_HIGHLIGHT: ReadonlyArray<Rect> = [
  [12, 13, 1, 1], [18, 13, 1, 1],
];

const COLORS = {
  base: '#ffd93d',
  highlight: '#fff3a0',
  shadow: '#f4a261',
  face: '#4a2a1a',
} as const;

const STYLES = `
.sun-spark-a { animation: sun-spark 1.4s steps(1) infinite; }
.sun-spark-b { animation: sun-spark 1.4s steps(1) infinite; animation-delay: 0.7s; }
.sun-eyes { animation: sun-blink 4.2s infinite; transform-box: fill-box; transform-origin: center; }
.sun-mouth { animation: sun-mouth 2.6s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
@keyframes sun-spark {
  0%, 49.99% { opacity: 0; }
  50%, 100%  { opacity: 1; }
}
@keyframes sun-blink {
  0%, 92%, 100% { transform: scaleY(1); }
  95%           { transform: scaleY(0.1); }
}
@keyframes sun-mouth {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.12); }
}
@media (prefers-reduced-motion: reduce) {
  .sun-spark-a, .sun-spark-b, .sun-eyes, .sun-mouth { animation: none; }
  .sun-spark-b { opacity: 0; }
}
`;

function renderRects(rects: ReadonlyArray<Rect>, fill: string, prefix: string) {
  return rects.map(([x, y, w, h], i) => (
    <rect key={`${prefix}-${i}`} x={x} y={y} width={w} height={h} fill={fill} />
  ));
}

interface SunProps {
  size?: number;
  className?: string;
  title?: string;
  withShades?: boolean;
}

export function Sun({ size = 128, className, title, withShades }: SunProps) {
  const labelled = Boolean(title);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      shapeRendering="crispEdges"
      role={labelled ? 'img' : undefined}
      aria-hidden={labelled ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <style>{STYLES}</style>
      <g>{renderRects(RAYS_LONG, COLORS.base, 'rl')}</g>
      <g>{renderRects(RAYS_SHORT, COLORS.base, 'rs')}</g>
      <g>{renderRects(DISC_BASE, COLORS.base, 'db')}</g>
      <g>{renderRects(DISC_HIGHLIGHT, COLORS.highlight, 'dh')}</g>
      <g>{renderRects(DISC_SHADOW, COLORS.shadow, 'ds')}</g>
      <g className="sun-spark-a">{renderRects(SPARKLES_A, COLORS.highlight, 'sa')}</g>
      <g className="sun-spark-b">{renderRects(SPARKLES_B, COLORS.highlight, 'sb')}</g>
      {!withShades && (
        <g className="sun-eyes">{renderRects(EYES, COLORS.face, 'ey')}</g>
      )}
      <g className="sun-mouth">{renderRects(MOUTH, COLORS.face, 'mo')}</g>
      {withShades && (
        <>
          <g>{renderRects(SHADES_FRAME, '#1a1a1a', 'sh')}</g>
          <g>{renderRects(SHADES_HIGHLIGHT, '#ffffff', 'shh')}</g>
        </>
      )}
    </svg>
  );
}
