'use client';

import { useEffect, useRef } from 'react';
import { Tractor as TractorSprite } from '@/components/sprites/Tractor';
import { TractorSeeder as TractorSeederSprite } from '@/components/sprites/TractorSeeder';
import { useAnimationFrame } from './useAnimationFrame';

const TRACTOR_SIZE = 72;
const SPRITE_W_PX = 132;

// Two phases: plow (0) then seed (1). Same 4-pass logic reused per phase.
const N_PASSES = 4;
const N_PHASES = 2;
const TOTAL_PASSES = N_PASSES * N_PHASES;
const PASS_MS = 28000;
const CYCLE_MS = TOTAL_PASSES * PASS_MS;
const SPAN_VW = 128;

// Per-pass trail height. Last pass thinner so it doesn't intrude on flowers.
const TRAIL_HEIGHTS = [28, 28, 28, 20]; // index = pass index, 0 = top row, N-1 = bottom row

// Row n bottom (px from container bottom) = sum of heights of rows below (index > n)
function rowBottom(n: number): number {
  let sum = 0;
  for (let i = n + 1; i < N_PASSES; i++) sum += TRAIL_HEIGHTS[i];
  return sum;
}

const TOP_ROW_BOTTOM = rowBottom(0);
const CONTAINER_H = TOP_ROW_BOTTOM + TRACTOR_SIZE;
const CONTAINER_TOP = -148; // user-approved "parfait" top

// Pixel-art dirt tile (16x16) — base + dark/light spots matching GroundLayer dirt-tile.
const TRAIL_PATTERN_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' shape-rendering='crispEdges'><rect width='16' height='16' fill='%234a2e15'/><g fill='%232a1808'><rect x='1' y='0' width='1' height='1'/><rect x='5' y='0' width='1' height='1'/><rect x='10' y='1' width='1' height='1'/><rect x='4' y='2' width='1' height='1'/><rect x='14' y='2' width='1' height='1'/><rect x='2' y='3' width='1' height='1'/><rect x='12' y='3' width='1' height='1'/><rect x='7' y='4' width='1' height='1'/><rect x='11' y='4' width='1' height='1'/><rect x='1' y='5' width='1' height='1'/><rect x='15' y='5' width='1' height='1'/><rect x='9' y='6' width='1' height='1'/><rect x='4' y='7' width='1' height='1'/><rect x='0' y='8' width='1' height='1'/><rect x='13' y='8' width='1' height='1'/><rect x='6' y='9' width='1' height='1'/><rect x='11' y='10' width='1' height='1'/><rect x='3' y='11' width='1' height='1'/><rect x='7' y='11' width='1' height='1'/><rect x='8' y='12' width='1' height='1'/><rect x='1' y='13' width='1' height='1'/><rect x='14' y='14' width='1' height='1'/><rect x='5' y='15' width='1' height='1'/><rect x='3' y='14' width='2' height='1'/><rect x='11' y='2' width='2' height='1'/></g><g fill='%236b4423'><rect x='7' y='1' width='1' height='1'/><rect x='3' y='6' width='1' height='1'/><rect x='12' y='10' width='1' height='1'/><rect x='2' y='9' width='1' height='1'/><rect x='10' y='13' width='1' height='1'/><rect x='6' y='3' width='1' height='1'/><rect x='14' y='7' width='1' height='1'/></g></svg>`;
const TRAIL_BG = `url("data:image/svg+xml;utf8,${TRAIL_PATTERN_SVG}") repeat`;
const TRAIL_BG_SIZE = '16px 16px';
const TRAIL_SHADOW =
  'inset 0 1px 0 0 rgba(0,0,0,0.55), inset 0 -1px 0 0 rgba(0,0,0,0.65)';

// Sunflower-seed overlay tile (16x16) — transparent base, sparse striped seeds.
// Sits on top of dirt rows during the seed phase so plowed dirt stays visible.
const SEED_PATTERN_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' shape-rendering='crispEdges'><g fill='%231a0f08'><rect x='3' y='5' width='2' height='1'/><rect x='11' y='9' width='2' height='1'/><rect x='6' y='12' width='2' height='1'/></g><g fill='%23f0d878'><rect x='3' y='6' width='2' height='1'/><rect x='11' y='10' width='2' height='1'/><rect x='6' y='13' width='2' height='1'/></g><g fill='%238a6020'><rect x='3' y='7' width='2' height='1'/><rect x='11' y='11' width='2' height='1'/><rect x='6' y='14' width='2' height='1'/></g></svg>`;
const SEED_BG = `url("data:image/svg+xml;utf8,${SEED_PATTERN_SVG}") repeat`;
const SEED_BG_SIZE = '16px 16px';

export function Tractor() {
  const dirtRefs = useRef<(HTMLDivElement | null)[]>([]);
  const seedRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tractorRef = useRef<HTMLDivElement>(null);
  const plowSpriteRef = useRef<HTMLDivElement>(null);
  const seederSpriteRef = useRef<HTMLDivElement>(null);

  const startRef = useRef<number>(0);
  const reduceMotionRef = useRef<boolean>(false);
  const lastDirtPRef = useRef<number[]>(new Array(N_PASSES).fill(-1));
  const lastSeedPRef = useRef<number[]>(new Array(N_PASSES).fill(-1));
  const lastTractorTransformRef = useRef<string>('');
  const lastPhaseRef = useRef<number>(-1);

  useEffect(() => {
    startRef.current = performance.now();
    reduceMotionRef.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useAnimationFrame((now: number) => {
    if (!startRef.current) startRef.current = now;
    const start = startRef.current;
    const reduceMotion = reduceMotionRef.current;
    const lastDirtP = lastDirtPRef.current;
    const lastSeedP = lastSeedPRef.current;

    const t = (now - start) % CYCLE_MS;
    const globalIdx = Math.min(TOTAL_PASSES - 1, Math.floor(t / PASS_MS));
    const phaseIdx = Math.floor(globalIdx / N_PASSES); // 0 = plow, 1 = seed
    const passIdx = globalIdx % N_PASSES;              // 0..3 within phase
    const localP = (t - globalIdx * PASS_MS) / PASS_MS;
    const isLR = passIdx % 2 === 0;

    const tractorX = isLR ? -14 + SPAN_VW * localP : 114 - SPAN_VW * localP;
    const visualRowIdx = Math.min(passIdx, N_PASSES - 2);
    const lastPassDrop = passIdx === N_PASSES - 1 ? 16 : 0;
    const baseY = TOP_ROW_BOTTOM - rowBottom(visualRowIdx) + lastPassDrop;
    const bounce = reduceMotion ? 0 : Math.round(Math.sin(now * 0.014) * 1.2);
    const tractorY = baseY + bounce;
    const flip = isLR ? 1 : -1;

    const spriteVw =
      typeof window !== 'undefined' && window.innerWidth
        ? (SPRITE_W_PX / window.innerWidth) * 100
        : 8;

    // Trail width for the active phase at row n given current passIdx + tractor x.
    const trailWidthFor = (n: number): number => {
      let wvw: number;
      if (passIdx > n) wvw = 100;
      else if (passIdx === n) {
        const isLRPass = n % 2 === 0;
        const raw = isLRPass ? tractorX : 100 - tractorX - spriteVw;
        wvw = raw < 0 ? 0 : raw > 100 ? 100 : raw;
      } else wvw = 0;
      return Math.round(wvw * 10) / 10;
    };

    for (let n = 0; n < N_PASSES; n++) {
      // Dirt: full during phase 1 (seed), grows during phase 0 (plow), 0 at start of cycle.
      const dirtW = phaseIdx >= 1 ? 100 : trailWidthFor(n);
      const dirtEl = dirtRefs.current[n];
      if (dirtEl && dirtW !== lastDirtP[n]) {
        lastDirtP[n] = dirtW;
        dirtEl.style.width = `${dirtW}vw`;
      }

      // Seed overlay: 0 during plow phase, grows during seed phase.
      const seedW = phaseIdx >= 1 ? trailWidthFor(n) : 0;
      const seedEl = seedRefs.current[n];
      if (seedEl && seedW !== lastSeedP[n]) {
        lastSeedP[n] = seedW;
        seedEl.style.width = `${seedW}vw`;
      }
    }

    if (tractorRef.current) {
      const xq = Math.round(tractorX * 100) / 100;
      const next = `translate3d(${xq}vw, ${tractorY}px, 0) scaleX(${flip})`;
      if (next !== lastTractorTransformRef.current) {
        lastTractorTransformRef.current = next;
        tractorRef.current.style.transform = next;
      }
    }

    // Swap implement sprite when phase changes.
    if (phaseIdx !== lastPhaseRef.current) {
      lastPhaseRef.current = phaseIdx;
      if (plowSpriteRef.current) {
        plowSpriteRef.current.style.display = phaseIdx === 0 ? 'block' : 'none';
      }
      if (seederSpriteRef.current) {
        seederSpriteRef.current.style.display = phaseIdx === 1 ? 'block' : 'none';
      }
    }
  });

  return (
    <div
      aria-hidden="true"
      className="absolute pointer-events-none"
      style={{
        top: `${CONTAINER_TOP}px`,
        left: 0,
        right: 0,
        height: `${CONTAINER_H}px`,
        zIndex: 3,
        overflow: 'hidden',
        contain: 'layout paint',
      }}
    >
      {Array.from({ length: N_PASSES }, (_, n) => {
        const isLR = n % 2 === 0;
        const bottom = rowBottom(n);
        const height = TRAIL_HEIGHTS[n];
        return (
          <div
            key={`dirt-${n}`}
            ref={(el) => {
              dirtRefs.current[n] = el;
            }}
            style={{
              position: 'absolute',
              left: isLR ? 0 : undefined,
              right: isLR ? undefined : 0,
              bottom: `${bottom}px`,
              height: `${height}px`,
              width: 0,
              overflow: 'hidden',
              contain: 'strict',
              willChange: 'width',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: isLR ? 0 : undefined,
                right: isLR ? undefined : 0,
                width: '100vw',
                height: '100%',
                background: TRAIL_BG,
                backgroundSize: TRAIL_BG_SIZE,
                boxShadow: TRAIL_SHADOW,
              }}
            />
          </div>
        );
      })}
      {Array.from({ length: N_PASSES }, (_, n) => {
        const isLR = n % 2 === 0;
        const bottom = rowBottom(n);
        const height = TRAIL_HEIGHTS[n];
        return (
          <div
            key={`seed-${n}`}
            ref={(el) => {
              seedRefs.current[n] = el;
            }}
            style={{
              position: 'absolute',
              left: isLR ? 0 : undefined,
              right: isLR ? undefined : 0,
              bottom: `${bottom}px`,
              height: `${height}px`,
              width: 0,
              overflow: 'hidden',
              contain: 'strict',
              willChange: 'width',
              zIndex: 1,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: isLR ? 0 : undefined,
                right: isLR ? undefined : 0,
                width: '100vw',
                height: '100%',
                background: SEED_BG,
                backgroundSize: SEED_BG_SIZE,
              }}
            />
          </div>
        );
      })}
      <div
        ref={tractorRef}
        style={{
          position: 'absolute',
          left: 0,
          bottom: `${TOP_ROW_BOTTOM}px`,
          width: `${SPRITE_W_PX}px`,
          height: `${TRACTOR_SIZE}px`,
          transform: 'translateX(-14vw) translateY(0) scaleX(1)',
          willChange: 'transform',
          zIndex: 2,
        }}
      >
        <style>{`
          @keyframes tractor-smoke {
            0%   { opacity: 0;   transform: translate(0, 0)         scale(0.6); }
            20%  { opacity: 0.75; }
            100% { opacity: 0;   transform: translate(-14px, -32px) scale(1.8); }
          }
          .tractor-smoke {
            position: absolute;
            left: 95px;
            bottom: 60px;
            width: 5px;
            height: 5px;
            background: rgba(120, 120, 120, 0.85);
            border-radius: 50%;
            animation: tractor-smoke 1.6s linear infinite;
            pointer-events: none;
          }
          .tractor-smoke-b { animation-delay: 0.55s; background: rgba(140, 140, 140, 0.8); }
          .tractor-smoke-c { animation-delay: 1.1s;  background: rgba(160, 160, 160, 0.75); }
          @media (prefers-reduced-motion: reduce) {
            .tractor-smoke { animation: none; opacity: 0; }
          }
        `}</style>
        <span className="tractor-smoke" />
        <span className="tractor-smoke tractor-smoke-b" />
        <span className="tractor-smoke tractor-smoke-c" />
        <div
          ref={plowSpriteRef}
          style={{ position: 'absolute', bottom: 0, left: 0, display: 'block' }}
        >
          <TractorSprite size={TRACTOR_SIZE} />
        </div>
        <div
          ref={seederSpriteRef}
          style={{ position: 'absolute', bottom: 0, left: 0, display: 'none' }}
        >
          <TractorSeederSprite size={TRACTOR_SIZE} />
        </div>
      </div>
    </div>
  );
}
