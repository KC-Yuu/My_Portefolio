'use client';

import { useCallback, useEffect, useRef } from 'react';
import { Tractor as TractorSprite } from '@/components/sprites/Tractor';
import { TractorSeeder as TractorSeederSprite } from '@/components/sprites/TractorSeeder';
import { Combine as CombineSprite } from '@/components/sprites/Combine';
import { Sunflower } from '@/components/sprites/Sunflower';
import { useAnimationFrame } from './useAnimationFrame';

const TRACTOR_SIZE = 72;
const SPRITE_W_PX = 132;
// Combine is taller in viewBox (26h vs 24h) and wider (56 vs 44). Height matched
// to tractor; width derived so the sprite renders at correct aspect.
const COMBINE_W_PX = Math.round((TRACTOR_SIZE * 56) / 26);

// Four phases of the field cycle:
//   0 = plow    (4 passes, tractor + plow leaves dirt rows)
//   1 = seed    (4 passes, same path, sunflower-seed overlay)
//   2 = grow    (1 pass,   tractor offscreen, sunflowers bloom)
//   3 = harvest (4 passes, combine retraces rows, sunflowers fall as it passes)
const N_PLOW = 4;
const N_SEED = 4;
const N_GROW = 1;
const N_HARVEST = 4;
const N_ROWS = N_PLOW;
const TOTAL_PASSES = N_PLOW + N_SEED + N_GROW + N_HARVEST;
const PASS_MS = 28000;
const CYCLE_MS = TOTAL_PASSES * PASS_MS;
const SPAN_VW = 128;

const TRAIL_HEIGHTS = [28, 28, 28, 20];

function rowBottom(n: number): number {
  let sum = 0;
  for (let i = n + 1; i < N_ROWS; i++) sum += TRAIL_HEIGHTS[i];
  return sum;
}

const TOP_ROW_BOTTOM = rowBottom(0);
const CONTAINER_H = TOP_ROW_BOTTOM + TRACTOR_SIZE;
const CONTAINER_TOP = -148;

const TRAIL_PATTERN_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' shape-rendering='crispEdges'><rect width='16' height='16' fill='%234a2e15'/><g fill='%232a1808'><rect x='1' y='0' width='1' height='1'/><rect x='5' y='0' width='1' height='1'/><rect x='10' y='1' width='1' height='1'/><rect x='4' y='2' width='1' height='1'/><rect x='14' y='2' width='1' height='1'/><rect x='2' y='3' width='1' height='1'/><rect x='12' y='3' width='1' height='1'/><rect x='7' y='4' width='1' height='1'/><rect x='11' y='4' width='1' height='1'/><rect x='1' y='5' width='1' height='1'/><rect x='15' y='5' width='1' height='1'/><rect x='9' y='6' width='1' height='1'/><rect x='4' y='7' width='1' height='1'/><rect x='0' y='8' width='1' height='1'/><rect x='13' y='8' width='1' height='1'/><rect x='6' y='9' width='1' height='1'/><rect x='11' y='10' width='1' height='1'/><rect x='3' y='11' width='1' height='1'/><rect x='7' y='11' width='1' height='1'/><rect x='8' y='12' width='1' height='1'/><rect x='1' y='13' width='1' height='1'/><rect x='14' y='14' width='1' height='1'/><rect x='5' y='15' width='1' height='1'/><rect x='3' y='14' width='2' height='1'/><rect x='11' y='2' width='2' height='1'/></g><g fill='%236b4423'><rect x='7' y='1' width='1' height='1'/><rect x='3' y='6' width='1' height='1'/><rect x='12' y='10' width='1' height='1'/><rect x='2' y='9' width='1' height='1'/><rect x='10' y='13' width='1' height='1'/><rect x='6' y='3' width='1' height='1'/><rect x='14' y='7' width='1' height='1'/></g></svg>`;
const TRAIL_BG = `url("data:image/svg+xml;utf8,${TRAIL_PATTERN_SVG}") repeat`;
const TRAIL_BG_SIZE = '16px 16px';
const TRAIL_SHADOW =
  'inset 0 1px 0 0 rgba(0,0,0,0.55), inset 0 -1px 0 0 rgba(0,0,0,0.65)';

const SEED_PATTERN_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' shape-rendering='crispEdges'><g fill='%231a0f08'><rect x='3' y='5' width='2' height='1'/><rect x='11' y='9' width='2' height='1'/><rect x='6' y='12' width='2' height='1'/></g><g fill='%23f0d878'><rect x='3' y='6' width='2' height='1'/><rect x='11' y='10' width='2' height='1'/><rect x='6' y='13' width='2' height='1'/></g><g fill='%238a6020'><rect x='3' y='7' width='2' height='1'/><rect x='11' y='11' width='2' height='1'/><rect x='6' y='14' width='2' height='1'/></g></svg>`;
const SEED_BG = `url("data:image/svg+xml;utf8,${SEED_PATTERN_SVG}") repeat`;
const SEED_BG_SIZE = '16px 16px';

// Dense sunflower field: 50 per row × 4 rows = 200. Hidden via display:none
// outside the grow phase so paint cost is paid only ~11% of the cycle.
const FLOWERS_PER_ROW = 50;
const FLOWER_SIZE = 28;
const FLOWER_XS = Array.from({ length: FLOWERS_PER_ROW }, (_, i) =>
  1 + (98 * i) / (FLOWERS_PER_ROW - 1),
);
// Vertical jitter per flower so the row doesn't look like a ruler.
const FLOWER_JITTER_Y = Array.from({ length: FLOWERS_PER_ROW }, (_, i) =>
  ((i * 37) % 11) - 5,
);
// Horizontal jitter so spacing isn't perfectly periodic (in vw).
const FLOWER_JITTER_X = Array.from({ length: FLOWERS_PER_ROW }, (_, i) =>
  (((i * 53) % 13) - 6) * 0.15,
);
// Size jitter — vary scale per flower for organic look.
const FLOWER_SCALE = Array.from({ length: FLOWERS_PER_ROW }, (_, i) =>
  0.75 + ((i * 71) % 11) / 20,
);

function classifyPhase(globalIdx: number): { phaseIdx: number; passIdx: number } {
  if (globalIdx < N_PLOW) return { phaseIdx: 0, passIdx: globalIdx };
  if (globalIdx < N_PLOW + N_SEED) return { phaseIdx: 1, passIdx: globalIdx - N_PLOW };
  if (globalIdx < N_PLOW + N_SEED + N_GROW) {
    return { phaseIdx: 2, passIdx: globalIdx - N_PLOW - N_SEED };
  }
  return { phaseIdx: 3, passIdx: globalIdx - N_PLOW - N_SEED - N_GROW };
}

const DEV = process.env.NODE_ENV === 'development';

export function Tractor() {
  const dirtRefs = useRef<(HTMLDivElement | null)[]>([]);
  const seedRefs = useRef<(HTMLDivElement | null)[]>([]);
  const flowerRowRefs = useRef<(HTMLDivElement | null)[]>(new Array(N_ROWS).fill(null));
  const tractorRef = useRef<HTMLDivElement>(null);
  const plowSpriteRef = useRef<HTMLDivElement>(null);
  const seederSpriteRef = useRef<HTMLDivElement>(null);
  const combineSpriteRef = useRef<HTMLDivElement>(null);
  const flowerRefs = useRef<(HTMLDivElement | null)[][]>(
    Array.from({ length: N_ROWS }, () => new Array(FLOWERS_PER_ROW).fill(null)),
  );

  const startRef = useRef<number>(0);
  const reduceMotionRef = useRef<boolean>(false);
  const lastDirtClipRef = useRef<string[]>(new Array(N_ROWS).fill(''));
  const lastSeedClipRef = useRef<string[]>(new Array(N_ROWS).fill(''));
  const lastFlowerPRef = useRef<number[][]>(
    Array.from({ length: N_ROWS }, () => new Array(FLOWERS_PER_ROW).fill(-1)),
  );
  const lastTractorTransformRef = useRef<string>('');
  const lastPhaseRef = useRef<number>(-1);
  const lastTractorZRef = useRef<number>(-1);

  useEffect(() => {
    startRef.current = performance.now();
    reduceMotionRef.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const jumpTo = useCallback((globalIdx: number) => {
    startRef.current = performance.now() - globalIdx * PASS_MS;
    lastPhaseRef.current = -1; // force phase-change side-effects to re-run
  }, []);

  // Dev keyboard shortcuts: 1=plow, 2=seed, 3=grow, R=restart cycle.
  useEffect(() => {
    if (!DEV) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === '1') jumpTo(0);
      else if (e.key === '2') jumpTo(N_PLOW);
      else if (e.key === '3') jumpTo(N_PLOW + N_SEED);
      else if (e.key === '4') jumpTo(N_PLOW + N_SEED + N_GROW);
      else if (e.key === 'r' || e.key === 'R') jumpTo(0);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [jumpTo]);

  useAnimationFrame((now: number) => {
    if (!startRef.current) startRef.current = now;
    const start = startRef.current;
    const reduceMotion = reduceMotionRef.current;
    const lastDirtClip = lastDirtClipRef.current;
    const lastSeedClip = lastSeedClipRef.current;
    const lastFlowerP = lastFlowerPRef.current;

    const elapsed = now - start;
    const t = ((elapsed % CYCLE_MS) + CYCLE_MS) % CYCLE_MS;
    const globalIdx = Math.min(TOTAL_PASSES - 1, Math.floor(t / PASS_MS));
    const { phaseIdx, passIdx } = classifyPhase(globalIdx);
    const localP = (t - globalIdx * PASS_MS) / PASS_MS;
    const isLR = passIdx % 2 === 0;

    const tractorX = isLR ? -14 + SPAN_VW * localP : 114 - SPAN_VW * localP;
    const visualRowIdx = Math.min(passIdx, N_ROWS - 2);
    const lastPassDrop = passIdx === N_ROWS - 1 ? 16 : 0;
    const baseY = TOP_ROW_BOTTOM - rowBottom(visualRowIdx) + lastPassDrop;
    const bounce = reduceMotion ? 0 : Math.round(Math.sin(now * 0.014) * 1.2);
    const tractorY = baseY + bounce;
    const flip = isLR ? 1 : -1;

    const activeSpriteWidthPx = phaseIdx === 3 ? COMBINE_W_PX : SPRITE_W_PX;
    const spriteVw =
      typeof window !== 'undefined' && window.innerWidth
        ? (activeSpriteWidthPx / window.innerWidth) * 100
        : 8;

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

    // Harvest swath: like trailWidthFor but anchored on the LEADING edge of the
    // combine (front of sprite in direction of travel) so soil clears from the
    // sweep side as the combine moves.
    const harvestSwathFor = (n: number): number => {
      if (passIdx > n) return 100;
      if (passIdx < n) return 0;
      const isLRPass = n % 2 === 0;
      const raw = isLRPass ? tractorX + spriteVw : 100 - tractorX;
      return raw < 0 ? 0 : raw > 100 ? 100 : raw;
    };

    // Build clip-path inset for a row given a swath (0..100) and direction.
    // grow=true: visible region grows FROM the sweep side.
    // grow=false (harvest): visible region SHRINKS — remnant on opposite side.
    const clipFor = (n: number, swath: number, grow: boolean): string => {
      const s = Math.round(swath * 10) / 10;
      const isLRRow = n % 2 === 0;
      if (grow) {
        // LR: keep left [0, s], clip right (100-s)%
        // RL: keep right [100-s, 100], clip left (100-s)%
        return isLRRow
          ? `inset(0 ${100 - s}% 0 0)`
          : `inset(0 0 0 ${100 - s}%)`;
      }
      // Harvest: remove the swept side, keep the opposite side
      return isLRRow
        ? `inset(0 0 0 ${s}%)`
        : `inset(0 ${s}% 0 0)`;
    };

    for (let n = 0; n < N_ROWS; n++) {
      // Dirt clip-path: grows during plow, full during seed/grow, shrinks during harvest.
      let dirtClip: string;
      if (phaseIdx === 0) {
        dirtClip = clipFor(n, trailWidthFor(n), true);
      } else if (phaseIdx === 3) {
        dirtClip = clipFor(n, harvestSwathFor(n), false);
      } else {
        dirtClip = 'inset(0 0 0 0)';
      }
      const dirtEl = dirtRefs.current[n];
      if (dirtEl && dirtClip !== lastDirtClip[n]) {
        lastDirtClip[n] = dirtClip;
        dirtEl.style.clipPath = dirtClip;
      }

      // Seed clip-path: 0 during plow, grows during seed, full during grow,
      // shrinks during harvest (mirrors dirt phase 3 behavior).
      let seedClip: string;
      if (phaseIdx === 0) {
        seedClip = 'inset(0 100% 0 0)';
      } else if (phaseIdx === 1) {
        seedClip = clipFor(n, trailWidthFor(n), true);
      } else if (phaseIdx === 3) {
        seedClip = clipFor(n, harvestSwathFor(n), false);
      } else {
        seedClip = 'inset(0 0 0 0)';
      }
      const seedEl = seedRefs.current[n];
      if (seedEl && seedClip !== lastSeedClip[n]) {
        lastSeedClip[n] = seedClip;
        seedEl.style.clipPath = seedClip;
      }
    }

    // Sunflowers: updated during phase 2 (grow) and phase 3 (harvest).
    // Phase 2: scale grows over localP with row+col stagger.
    // Phase 3: bloomed (1.0) until combine's cutting edge crosses each flower's
    //          x position on its row, then snaps to 0.
    if (phaseIdx === 2) {
      for (let r = 0; r < N_ROWS; r++) {
        for (let c = 0; c < FLOWERS_PER_ROW; c++) {
          const rowDelay = r * 0.04;
          const colDelay = (c / Math.max(1, FLOWERS_PER_ROW - 1)) * 0.35;
          const delay = rowDelay + colDelay;
          const span = 0.4;
          const raw = (localP - delay) / span;
          const p = Math.round((raw < 0 ? 0 : raw > 1 ? 1 : raw) * 100) / 100;
          if (p === lastFlowerP[r][c]) continue;
          lastFlowerP[r][c] = p;
          const el = flowerRefs.current[r][c];
          if (!el) continue;
          const sx = FLOWER_SCALE[c];
          el.style.transform = `scaleX(${sx}) scaleY(${p * sx})`;
          el.style.opacity = `${Math.min(1, p * 2.5)}`;
        }
      }
    } else if (phaseIdx === 3) {
      for (let r = 0; r < N_ROWS; r++) {
        const swath = harvestSwathFor(r);
        const isLRRow = r % 2 === 0;
        for (let c = 0; c < FLOWERS_PER_ROW; c++) {
          const flowerXvw = FLOWER_XS[c] + FLOWER_JITTER_X[c];
          const harvested = isLRRow ? flowerXvw < swath : flowerXvw > 100 - swath;
          const p = harvested ? 0 : 1;
          if (p === lastFlowerP[r][c]) continue;
          lastFlowerP[r][c] = p;
          const el = flowerRefs.current[r][c];
          if (!el) continue;
          const sx = FLOWER_SCALE[c];
          el.style.transform = `scaleX(${sx}) scaleY(${p * sx})`;
          el.style.opacity = `${p}`;
        }
      }
    }

    if (tractorRef.current) {
      const xq = Math.round(tractorX * 100) / 100;
      const next = `translate3d(${xq}vw, ${tractorY}px, 0) scaleX(${flip})`;
      if (next !== lastTractorTransformRef.current) {
        lastTractorTransformRef.current = next;
        tractorRef.current.style.transform = next;
      }
      // Sit between flower rows during harvest so flowers on rows closer to the
      // viewer (higher r) render in front of the combine. Outside phase 3 the
      // tractor is on top (no flowers visible at the same time).
      const desiredZ = phaseIdx === 3 ? 100 + passIdx * 10 + 5 : 10;
      if (desiredZ !== lastTractorZRef.current) {
        lastTractorZRef.current = desiredZ;
        tractorRef.current.style.zIndex = String(desiredZ);
      }
    }

    if (phaseIdx !== lastPhaseRef.current) {
      lastPhaseRef.current = phaseIdx;
      if (plowSpriteRef.current) {
        plowSpriteRef.current.style.display = phaseIdx === 0 ? 'block' : 'none';
      }
      if (seederSpriteRef.current) {
        seederSpriteRef.current.style.display = phaseIdx === 1 ? 'block' : 'none';
      }
      if (combineSpriteRef.current) {
        combineSpriteRef.current.style.display = phaseIdx === 3 ? 'block' : 'none';
      }
      if (tractorRef.current) {
        tractorRef.current.style.display = phaseIdx === 2 ? 'none' : 'block';
      }
      // Flower rows visible during phase 2 (growing) and phase 3 (being harvested).
      const flowersVisible = phaseIdx === 2 || phaseIdx === 3;
      for (let r = 0; r < N_ROWS; r++) {
        const rowEl = flowerRowRefs.current[r];
        if (rowEl) rowEl.style.display = flowersVisible ? 'block' : 'none';
      }
      // Reset cached per-flower state at phase boundaries that affect flowers.
      if (phaseIdx === 2) {
        // Entering grow: animate from 0 → 1.
        for (let r = 0; r < N_ROWS; r++) {
          for (let c = 0; c < FLOWERS_PER_ROW; c++) lastFlowerP[r][c] = -1;
        }
      } else if (phaseIdx === 3) {
        // Entering harvest: all flowers start bloomed (p=1), combine snaps them
        // back to 0 as it passes.
        for (let r = 0; r < N_ROWS; r++) {
          for (let c = 0; c < FLOWERS_PER_ROW; c++) {
            const el = flowerRefs.current[r][c];
            const sx = FLOWER_SCALE[c];
            if (el) {
              el.style.transform = `scaleX(${sx}) scaleY(${sx})`;
              el.style.opacity = '1';
            }
            lastFlowerP[r][c] = 1;
          }
        }
      } else {
        // Phases 0/1: hide flowers entirely.
        for (let r = 0; r < N_ROWS; r++) {
          for (let c = 0; c < FLOWERS_PER_ROW; c++) {
            const el = flowerRefs.current[r][c];
            if (el) {
              el.style.transform = 'scaleY(0)';
              el.style.opacity = '0';
            }
            lastFlowerP[r][c] = 0;
          }
        }
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
      {Array.from({ length: N_ROWS }, (_, n) => {
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
              left: 0,
              right: 0,
              bottom: `${bottom}px`,
              height: `${height}px`,
              background: TRAIL_BG,
              backgroundSize: TRAIL_BG_SIZE,
              boxShadow: TRAIL_SHADOW,
              clipPath: 'inset(0 100% 0 0)',
              willChange: 'clip-path',
            }}
          />
        );
      })}
      {Array.from({ length: N_ROWS }, (_, n) => {
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
              left: 0,
              right: 0,
              bottom: `${bottom}px`,
              height: `${height}px`,
              background: SEED_BG,
              backgroundSize: SEED_BG_SIZE,
              clipPath: 'inset(0 100% 0 0)',
              willChange: 'clip-path',
              zIndex: 1,
            }}
          />
        );
      })}
      {Array.from({ length: N_ROWS }, (_, r) => {
        const rowTop = rowBottom(r) + TRAIL_HEIGHTS[r];
        return (
          <div
            key={`flowers-${r}`}
            ref={(el) => {
              flowerRowRefs.current[r] = el;
            }}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: `${rowTop}px`,
              height: 0,
              pointerEvents: 'none',
              zIndex: 100 + r * 10,
              display: 'none',
            }}
          >
            {FLOWER_XS.map((x, c) => (
              <div
                key={`flower-${r}-${c}`}
                ref={(el) => {
                  flowerRefs.current[r][c] = el;
                }}
                style={{
                  position: 'absolute',
                  left: `calc(${x + FLOWER_JITTER_X[c]}vw)`,
                  bottom: `${FLOWER_JITTER_Y[c]}px`,
                  transform: 'scaleY(0)',
                  transformOrigin: '50% 100%',
                  opacity: 0,
                }}
              >
                <Sunflower size={FLOWER_SIZE} />
              </div>
            ))}
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
          zIndex: 10,
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
        <div
          ref={combineSpriteRef}
          style={{ position: 'absolute', bottom: 0, left: 0, display: 'none' }}
        >
          <CombineSprite size={TRACTOR_SIZE} />
        </div>
      </div>
      {DEV && <TractorDevPanel jumpTo={jumpTo} />}
    </div>
  );
}

function TractorDevPanel({ jumpTo }: { jumpTo: (idx: number) => void }) {
  const btn: React.CSSProperties = {
    padding: '4px 8px',
    background: '#222',
    color: '#fff',
    border: '1px solid #555',
    borderRadius: 4,
    cursor: 'pointer',
    font: '11px ui-monospace, monospace',
  };
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 8,
        right: 8,
        zIndex: 9999,
        display: 'flex',
        gap: 4,
        padding: 6,
        background: 'rgba(0,0,0,0.6)',
        borderRadius: 6,
        pointerEvents: 'auto',
        font: '11px ui-monospace, monospace',
        color: '#bbb',
      }}
    >
      <span style={{ alignSelf: 'center', marginRight: 4 }}>tractor</span>
      <button style={btn} onClick={() => jumpTo(0)} title="key: 1">▶ plow</button>
      <button style={btn} onClick={() => jumpTo(N_PLOW)} title="key: 2">🌱 seed</button>
      <button style={btn} onClick={() => jumpTo(N_PLOW + N_SEED)} title="key: 3">🌻 grow</button>
      <button style={btn} onClick={() => jumpTo(N_PLOW + N_SEED + N_GROW)} title="key: 4">🌾 harvest</button>
    </div>
  );
}
