type Rect = readonly [x: number, y: number, w: number, h: number];

const VARIANTS = {
  A: [ // tall straight, slightly wider base
    [3, 2, 1, 9], [3, 11, 2, 1],
  ],
  B: [ // tapered: 2px base, 1px tip
    [3, 8, 2, 4], [3, 4, 1, 4], [3, 3, 1, 1],
  ],
  C: [ // lean right (arc)
    [3, 10, 1, 2], [4, 8, 1, 2], [5, 6, 1, 2], [6, 4, 1, 2], [6, 3, 1, 1],
  ],
  D: [ // lean left (arc, mirror of C)
    [4, 10, 1, 2], [3, 8, 1, 2], [2, 6, 1, 2], [1, 4, 1, 2], [1, 3, 1, 1],
  ],
  E: [ // twin: two short blades side by side
    [1, 8, 1, 4], [1, 7, 1, 1], [5, 7, 1, 5], [5, 6, 1, 1],
  ],
  F: [ // curl tip rightward
    [3, 5, 1, 7], [3, 4, 1, 1], [4, 3, 1, 1],
  ],
} satisfies Record<string, ReadonlyArray<Rect>>;

export type GrassVariant = keyof typeof VARIANTS;
export const GRASS_VARIANTS = Object.keys(VARIANTS) as GrassVariant[];

// Build mask data URL per variant once. Mask shape = SVG silhouette (black rects),
// background-color inherits currentColor so the blade color stays dynamic.
function buildMaskUrl(rects: ReadonlyArray<Rect>): string {
  const body = rects
    .map(
      ([x, y, w, h]) =>
        `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#000"/>`
    )
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" shape-rendering="crispEdges">${body}</svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

const VARIANT_MASK = Object.fromEntries(
  (Object.keys(VARIANTS) as GrassVariant[]).map((v) => [v, buildMaskUrl(VARIANTS[v])])
) as Record<GrassVariant, string>;

interface GrassBladeProps {
  variant: GrassVariant;
  size?: number;
  className?: string;
}

export function GrassBlade({ variant, size = 16, className }: GrassBladeProps) {
  const mask = VARIANT_MASK[variant];
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        display: 'block',
        width: (size * 8) / 12,
        height: size,
        backgroundColor: 'currentColor',
        maskImage: mask,
        WebkitMaskImage: mask,
        maskSize: '100% 100%',
        WebkitMaskSize: '100% 100%',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
      }}
    />
  );
}
