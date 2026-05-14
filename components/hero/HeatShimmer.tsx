'use client';
import { useSeason } from '@/components/season/useSeason';

export function HeatShimmer() {
  const { season } = useSeason();
  if (season !== 'summer') return null;
  return (
    <>
      <svg
        aria-hidden="true"
        width="0"
        height="0"
        style={{ position: 'absolute', overflow: 'hidden' }}
      >
        <defs>
          <filter
            id="heat-shimmer"
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.013 0.05"
              numOctaves="2"
              seed="3"
              result="turb"
            >
              <animate
                attributeName="baseFrequency"
                values="0.013 0.05; 0.015 0.055; 0.013 0.05"
                dur="7s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="turb" scale="4">
              <animate
                attributeName="scale"
                values="3; 6; 3"
                dur="4.5s"
                repeatCount="indefinite"
              />
            </feDisplacementMap>
          </filter>
        </defs>
      </svg>
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          left: 0,
          right: 0,
          top: '60%',
          height: '14%',
          backdropFilter: 'url(#heat-shimmer)',
          WebkitBackdropFilter: 'url(#heat-shimmer)',
          zIndex: 36,
        }}
      />
    </>
  );
}
