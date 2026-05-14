type Rect = readonly [x: number, y: number, w: number, h: number];

interface CloudShape {
  vb: readonly [number, number];
  body: ReadonlyArray<Rect>;
  shadow: ReadonlyArray<Rect>;
}

const SHAPES = {
  A: {
    vb: [16, 8],
    body: [
      [5, 1, 4, 1],
      [3, 2, 10, 1],
      [2, 3, 12, 1],
      [2, 4, 12, 1],
    ],
    shadow: [
      [4, 5, 8, 1],
    ],
  },
  B: {
    vb: [24, 10],
    body: [
      [8, 1, 4, 1],
      [5, 2, 10, 1],
      [3, 3, 14, 1],
      [2, 4, 18, 1],
      [2, 5, 20, 1],
      [3, 6, 18, 1],
    ],
    shadow: [
      [5, 7, 14, 1],
    ],
  },
  C: {
    vb: [32, 12],
    body: [
      [10, 2, 6, 1],
      [18, 1, 5, 1],
      [7, 3, 18, 1],
      [4, 4, 24, 1],
      [2, 5, 28, 1],
      [2, 6, 28, 1],
      [3, 7, 26, 1],
    ],
    shadow: [
      [6, 8, 20, 1],
    ],
  },
} as const satisfies Record<string, CloudShape>;

export type CloudVariant = keyof typeof SHAPES;
export const CLOUD_VARIANTS = Object.keys(SHAPES) as CloudVariant[];

const COLORS = {
  body: '#ffffff',
  shadow: '#f5d8a8',
} as const;

interface CloudProps {
  variant: CloudVariant;
  size?: number;
  className?: string;
}

function buildSvg(shape: CloudShape): string {
  const [w, h] = shape.vb;
  const body = shape.body
    .map(
      ([x, y, rw, rh]) =>
        `<rect x="${x}" y="${y}" width="${rw}" height="${rh}" fill="${COLORS.body}"/>`
    )
    .join('');
  const shadow = shape.shadow
    .map(
      ([x, y, rw, rh]) =>
        `<rect x="${x}" y="${y}" width="${rw}" height="${rh}" fill="${COLORS.shadow}"/>`
    )
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${body}${shadow}</svg>`;
}

const VARIANT_SRC = Object.fromEntries(
  (Object.keys(SHAPES) as CloudVariant[]).map((v) => [
    v,
    `data:image/svg+xml;utf8,${encodeURIComponent(buildSvg(SHAPES[v]))}`,
  ])
) as Record<CloudVariant, string>;

const VARIANT_VB = Object.fromEntries(
  (Object.keys(SHAPES) as CloudVariant[]).map((v) => [v, SHAPES[v].vb])
) as Record<CloudVariant, readonly [number, number]>;

export function Cloud({ variant, size = 64, className }: CloudProps) {
  const [w, h] = VARIANT_VB[variant];
  return (
    <img
      aria-hidden="true"
      src={VARIANT_SRC[variant]}
      alt=""
      decoding="async"
      className={className}
      style={{
        display: 'block',
        width: (size * w) / h,
        height: size,
        maxWidth: 'none',
        imageRendering: 'pixelated',
      }}
    />
  );
}
