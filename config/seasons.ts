import type { Season } from '@/components/season/season';

export interface ParticleConfig {
  count: number;
  velY: [number, number];
  velX: [number, number];
  size: [number, number];
  rotate: boolean;
  upward: boolean;
}

export interface SeasonMeta {
  label: string;
  icon: string;          // unicode glyph (placeholder; swap to sprite path later)
  particles: ParticleConfig;
}

export const SEASON_META: Record<Season, SeasonMeta> = {
  spring: {
    label: 'Spring',
    icon: '✿',
    particles: { count: 50, velY: [0.3, 0.7],  velX: [-0.4, 0.4], size: [3, 5], rotate: true,  upward: false },
  },
  summer: {
    label: 'Summer',
    icon: '☀',
    particles: { count: 25, velY: [-0.3, -0.6], velX: [-0.2, 0.2], size: [2, 3], rotate: false, upward: true  },
  },
  autumn: {
    label: 'Autumn',
    icon: '🍂',
    particles: { count: 50, velY: [0.4, 0.9],  velX: [-0.5, 0.5], size: [4, 7], rotate: true,  upward: false },
  },
  winter: {
    label: 'Winter',
    icon: '❄',
    particles: { count: 60, velY: [0.4, 0.8],  velX: [-0.3, 0.3], size: [3, 6], rotate: false, upward: false },
  },
};
