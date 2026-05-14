import { FLOWER_VARIANTS, type FlowerVariant } from '@/components/sprites/Flower';

export interface FlowerSpec {
  xVw: number;
  variant: FlowerVariant;
  scale: number;
}

export const FLOWER_COUNT = 52;

export const FLOWER_FIELD: ReadonlyArray<FlowerSpec> = Array.from(
  { length: FLOWER_COUNT },
  (_, i) => {
    const jitter = (((i * 53) % 31) - 15) / 4;
    const raw = (i / FLOWER_COUNT) * 100 + jitter;
    return {
      xVw: Math.max(3, Math.min(97, raw)),
      variant: FLOWER_VARIANTS[(i * 7) % FLOWER_VARIANTS.length],
      scale: 0.9 + ((i * 19) % 7) / 10,
    };
  }
);

// Top of bloom (approx), used by bees to land on.
export const FLOWER_BLOOM_Y_VH = 68;
// Above bloom — flight altitude between visits.
export const FLOWER_HOVER_Y_VH = 63;
