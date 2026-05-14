type Rect = readonly [x: number, y: number, w: number, h: number];

interface BloomLayer {
  fill: string;
  rects: ReadonlyArray<Rect>;
}

interface FlowerShape {
  stem: ReadonlyArray<Rect>;
  bloom: ReadonlyArray<BloomLayer>;
}

const SHAPES = {
  poppy: {
    stem: [[3, 5, 1, 7]],
    bloom: [
      { fill: '#e63946', rects: [[3, 2, 2, 1], [2, 3, 4, 1], [3, 4, 2, 1]] },
      { fill: '#6a040f', rects: [[3, 3, 1, 1]] },
    ],
  },
  daisy: {
    stem: [[4, 5, 1, 7]],
    bloom: [
      { fill: '#fffaf0', rects: [[4, 2, 1, 1], [3, 3, 1, 1], [5, 3, 1, 1], [4, 4, 1, 1]] },
      { fill: '#ffd93d', rects: [[4, 3, 1, 1]] },
    ],
  },
  dandelion: {
    stem: [[3, 5, 1, 7]],
    bloom: [
      { fill: '#ffd93d', rects: [[3, 2, 2, 1], [2, 3, 4, 1], [3, 4, 2, 1]] },
      { fill: '#f4a261', rects: [[3, 3, 1, 1]] },
    ],
  },
  cornflower: {
    stem: [[4, 5, 1, 7]],
    bloom: [
      { fill: '#5b9bd5', rects: [[4, 2, 1, 1], [3, 3, 1, 1], [5, 3, 1, 1], [4, 4, 1, 1]] },
      { fill: '#1d3557', rects: [[4, 3, 1, 1]] },
    ],
  },
} as const satisfies Record<string, FlowerShape>;

export type FlowerVariant = keyof typeof SHAPES;
export const FLOWER_VARIANTS = Object.keys(SHAPES) as FlowerVariant[];

// Two-layer composition: stem as currentColor-masked div (preserves seasonal --foliage),
// bloom as static <img> with hardcoded fills. Both share the 8x12 viewBox via 100%/100%.
function buildStemMask(stem: ReadonlyArray<Rect>): string {
  const body = stem
    .map(
      ([x, y, w, h]) =>
        `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#000"/>`
    )
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" shape-rendering="crispEdges">${body}</svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

function buildBloomSrc(bloom: ReadonlyArray<BloomLayer>): string {
  const body = bloom
    .map((l) =>
      l.rects
        .map(
          ([x, y, w, h]) =>
            `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${l.fill}"/>`
        )
        .join('')
    )
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" shape-rendering="crispEdges">${body}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const VARIANT_STEM = Object.fromEntries(
  (Object.keys(SHAPES) as FlowerVariant[]).map((v) => [v, buildStemMask(SHAPES[v].stem)])
) as Record<FlowerVariant, string>;

const VARIANT_BLOOM = Object.fromEntries(
  (Object.keys(SHAPES) as FlowerVariant[]).map((v) => [v, buildBloomSrc(SHAPES[v].bloom)])
) as Record<FlowerVariant, string>;

interface FlowerProps {
  variant: FlowerVariant;
  size?: number;
  className?: string;
}

export function Flower({ variant, size = 20, className }: FlowerProps) {
  const w = (size * 8) / 12;
  const stem = VARIANT_STEM[variant];
  const bloom = VARIANT_BLOOM[variant];
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ position: 'relative', display: 'block', width: w, height: size }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'currentColor',
          maskImage: stem,
          WebkitMaskImage: stem,
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
        }}
      />
      <img
        src={bloom}
        alt=""
        decoding="async"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          maxWidth: 'none',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
}
