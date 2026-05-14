'use client';
import { useSeason } from '@/components/season/useSeason';

export function WarmTint() {
  const { season } = useSeason();
  if (season !== 'summer') return null;
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-40"
      style={{
        background: `
          radial-gradient(ellipse at 82% 12%,
            rgba(255, 215, 140, 0.12) 0%,
            rgba(255, 190, 100, 0.06) 30%,
            transparent 65%),
          linear-gradient(180deg,
            rgba(255, 200, 120, 0.02) 0%,
            rgba(255, 160, 90, 0.06) 100%)
        `,
      }}
    />
  );
}
