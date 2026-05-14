'use client';
import { useSeason } from '@/components/season/useSeason';
import { Sun } from '@/components/sprites/Sun';

export function SkyLayer() {
  const { season } = useSeason();
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0"
      style={{
        background:
          'linear-gradient(180deg, var(--sky-top) 0%, var(--sky-bot) 100%)',
        transition: 'background 600ms ease',
      }}
    >
      {season === 'summer' ? (
        <>
          <HeatGlow />
          <SunBacklight />
          <GodRays />
          <div
            data-sun-target
            className="absolute"
            style={{ top: '10%', right: '12%' }}
          >
            <Sun size={96} className="pixel" withShades />
          </div>
        </>
      ) : (
        <Placeholder />
      )}
    </div>
  );
}

const RAYS: ReadonlyArray<{
  rotate: number;
  width: number;
  opacity: number;
  delay: number;
}> = [
  { rotate:  -5, width: 80,  opacity: 0.55, delay: 0   },
  { rotate:  15, width: 110, opacity: 0.65, delay: 1.2 },
  { rotate:  30, width: 60,  opacity: 0.50, delay: 2.4 },
  { rotate:  45, width: 90,  opacity: 0.60, delay: 0.6 },
  { rotate:  60, width: 50,  opacity: 0.45, delay: 3.0 },
  { rotate:  75, width: 70,  opacity: 0.42, delay: 1.8 },
];

function HeatGlow() {
  return (
    <div
      aria-hidden="true"
      className="absolute pointer-events-none"
      style={{
        top: '-25%',
        right: '-15%',
        width: '75%',
        height: '90%',
        background: `radial-gradient(circle at 70% 30%,
          rgba(255, 200, 150, 0.35) 0%,
          rgba(255, 180, 130, 0.22) 20%,
          rgba(255, 160, 115, 0.12) 40%,
          rgba(255, 150, 110, 0.05) 60%,
          transparent 80%)`,
      }}
    />
  );
}

function SunBacklight() {
  return (
    <div
      aria-hidden="true"
      data-sun-backlight
      className="absolute pointer-events-none"
      style={{
        top: 'calc(10% - 80px)',
        right: 'calc(12% - 80px)',
        width: 256,
        height: 256,
        background: `radial-gradient(circle,
          rgba(255, 245, 170, 0.85) 0%,
          rgba(255, 225, 100, 0.70) 18%,
          rgba(255, 200, 70, 0.45) 38%,
          rgba(255, 175, 55, 0.22) 58%,
          rgba(255, 160, 50, 0.08) 72%,
          transparent 85%)`,
        opacity: 0,
        transition: 'opacity 350ms ease-out',
      }}
    />
  );
}

function GodRays() {
  return (
    <div
      aria-hidden="true"
      className="god-rays absolute inset-0 pointer-events-none"
      style={{
        overflow: 'hidden',
      }}
    >
      <style>{`
        .god-ray-inner {
          position: absolute;
          inset: 0;
          opacity: var(--ray-op-min, 0.10);
          animation: god-ray-pulse 6s ease-in-out infinite alternate;
          animation-fill-mode: backwards;
        }
        @keyframes god-ray-pulse {
          from { opacity: var(--ray-op-min, 0.10); }
          to   { opacity: var(--ray-op-max, 0.22); }
        }
        @media (prefers-reduced-motion: reduce) {
          .god-ray-inner { animation: none; }
        }
      `}</style>
      {RAYS.map((r, i) => (
        <div
          key={i}
          data-ray={i}
          data-ray-angle={r.rotate}
          style={{
            position: 'absolute',
            top: 'calc(10% + 48px)',
            left: 'calc(88% - 48px)',
            width: r.width,
            height: '160%',
            transformOrigin: 'top center',
            transform: `translate(-50%, 0) rotate(${r.rotate}deg)`,
            transition: 'opacity 350ms ease-out',
          }}
        >
          <div
            className="god-ray-inner"
            style={{
              background:
                'linear-gradient(to right, transparent 0%, rgba(255, 240, 160, 1) 50%, transparent 100%)',
              animationDelay: `${r.delay}s`,
              ['--ray-op-min' as string]: `${r.opacity * 0.25}`,
              ['--ray-op-max' as string]: `${r.opacity * 0.55}`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

function Placeholder() {
  return (
    <svg
      aria-hidden="true"
      className="pixel absolute"
      style={{
        top: '12%',
        right: '15%',
        width: 64,
        height: 64,
        color: 'var(--accent)',
      }}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
    >
      <rect x="4" y="4" width="8" height="8" fill="currentColor" />
      <rect x="3" y="5" width="1" height="6" fill="currentColor" />
      <rect x="12" y="5" width="1" height="6" fill="currentColor" />
      <rect x="5" y="3" width="6" height="1" fill="currentColor" />
      <rect x="5" y="12" width="6" height="1" fill="currentColor" />
    </svg>
  );
}
