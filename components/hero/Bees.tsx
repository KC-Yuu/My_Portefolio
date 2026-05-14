'use client';
import { useEffect } from 'react';
import { useSeason } from '@/components/season/useSeason';
import { subscribeSpriteDraw } from './spriteCanvas';
import {
  FLOWER_FIELD,
  FLOWER_BLOOM_Y_VH,
  FLOWER_HOVER_Y_VH,
} from '@/config/flowerField';

interface BeeState {
  x: number;
  y: number;
  targetIdx: number;
  phase: 'fly' | 'butine';
  phaseUntil: number;
  facing: 1 | -1;
}

const BEE_COUNT = 3;
const FLY_SPEED_VW_PER_SEC = 14;
const FLY_SPEED_VH_PER_SEC = 18;
const BUTINE_MS_MIN = 1800;
const BUTINE_MS_MAX = 3500;
const ARRIVE_EPSILON = 0.4;
const BEE_SIZE = 9;
const BEE_PX = BEE_SIZE / 4;

type Rect = readonly [number, number, number, number];

const A_WINGS: ReadonlyArray<Rect> = [[1, 0, 2, 1], [4, 0, 2, 1]];
const B_WINGS: ReadonlyArray<Rect> = [[1, 1, 1, 1], [5, 1, 1, 1]];
const BODY_YELLOW: ReadonlyArray<Rect> = [[1, 1, 5, 2], [2, 3, 3, 1]];
const BODY_BLACK: ReadonlyArray<Rect> = [[2, 1, 1, 2], [4, 1, 1, 2], [5, 1, 1, 1]];

function pickRandom<T>(arr: ReadonlyArray<T>): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function Bees() {
  const { season } = useSeason();

  useEffect(() => {
    if (season !== 'summer') return;
    if (FLOWER_FIELD.length < BEE_COUNT) return;

    const claimed = new Set<number>();

    function claimFlower(exclude?: number): number {
      const available: number[] = [];
      for (let i = 0; i < FLOWER_FIELD.length; i++) {
        if (claimed.has(i)) continue;
        if (i === exclude) continue;
        available.push(i);
      }
      if (available.length === 0) return -1;
      const idx = pickRandom(available);
      claimed.add(idx);
      return idx;
    }

    const bees: BeeState[] = [];
    for (let i = 0; i < BEE_COUNT; i++) {
      const idx = claimFlower();
      const start = FLOWER_FIELD[idx] ?? FLOWER_FIELD[0];
      bees.push({
        x: start.xVw,
        y: FLOWER_HOVER_Y_VH,
        targetIdx: idx,
        phase: 'fly',
        phaseUntil: 0,
        facing: 1,
      });
    }

    function drawBee(
      ctx: CanvasRenderingContext2D,
      beeX: number,
      beeY: number,
      facing: 1 | -1,
      wingFrame: 0 | 1,
    ) {
      ctx.save();
      if (facing === -1) {
        const cx = beeX + (7 * BEE_PX) / 2;
        ctx.translate(cx, 0);
        ctx.scale(-1, 1);
        ctx.translate(-cx, 0);
      }
      ctx.fillStyle = 'rgba(225, 240, 250, 0.85)';
      const wings = wingFrame === 0 ? A_WINGS : B_WINGS;
      for (const [x, y, w, h] of wings) ctx.fillRect(beeX + x * BEE_PX, beeY + y * BEE_PX, w * BEE_PX, h * BEE_PX);
      ctx.fillStyle = '#ffd93d';
      for (const [x, y, w, h] of BODY_YELLOW) ctx.fillRect(beeX + x * BEE_PX, beeY + y * BEE_PX, w * BEE_PX, h * BEE_PX);
      ctx.fillStyle = '#1a1a1a';
      for (const [x, y, w, h] of BODY_BLACK) ctx.fillRect(beeX + x * BEE_PX, beeY + y * BEE_PX, w * BEE_PX, h * BEE_PX);
      ctx.restore();
    }

    const lastDirty: Array<{ x: number; y: number; w: number; h: number } | null> =
      bees.map(() => null);
    const bw = 7 * BEE_PX;
    const bh = 4 * BEE_PX;
    const PAD = 2;

    function drawScene(ctx: CanvasRenderingContext2D, now: number) {
      const wingFrame: 0 | 1 = Math.floor(now / 160) % 2 === 0 ? 0 : 1;
      const vw = window.innerWidth / 100;
      const vh = window.innerHeight / 100;
      for (let i = 0; i < bees.length; i++) {
        const b = bees[i];
        const px = b.x * vw;
        const py = b.y * vh;
        const prev = lastDirty[i];
        if (prev) ctx.clearRect(prev.x, prev.y, prev.w, prev.h);
        const dx = px - PAD;
        const dy = py - PAD;
        const dw = bw + 2 * PAD;
        const dh = bh + 2 * PAD;
        ctx.clearRect(dx, dy, dw, dh);
        lastDirty[i] = { x: dx, y: dy, w: dw, h: dh };
        drawBee(ctx, px, py, b.facing, wingFrame);
      }
    }

    let lastTime = performance.now();
    let lastFrame = 0;
    const FRAME_MS_FLY = 45;
    const FRAME_MS_IDLE = 150;
    const lastDrawn = bees.map(() => ({ x: NaN, y: NaN, f: 0 as 1 | -1 | 0, wing: -1 }));

    function tick(ctx: CanvasRenderingContext2D, _canvas: HTMLCanvasElement, now: number) {
      const allButine = bees.every((b) => b.phase === 'butine');
      const frameMs = allButine ? FRAME_MS_IDLE : FRAME_MS_FLY;
      if (now - lastFrame < frameMs) return;
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;
      lastFrame = now;

      for (let i = 0; i < bees.length; i++) {
        const b = bees[i];
        if (b.targetIdx < 0) {
          const next = claimFlower();
          if (next >= 0) { b.targetIdx = next; b.phase = 'fly'; }
        }
        const flower = b.targetIdx >= 0 ? FLOWER_FIELD[b.targetIdx] : null;

        if (b.phase === 'fly' && flower) {
          const dx = flower.xVw - b.x;
          if (Math.abs(dx) > ARRIVE_EPSILON) b.facing = dx >= 0 ? 1 : -1;
          const stepX = FLY_SPEED_VW_PER_SEC * dt;
          b.x += Math.sign(dx) * Math.min(Math.abs(dx), stepX);

          const APPROACH_VW = 14;
          const proxX = Math.max(0, Math.min(1, 1 - Math.abs(dx) / APPROACH_VW));
          const eased = proxX * proxX * (3 - 2 * proxX);
          const targetY = FLOWER_HOVER_Y_VH + (FLOWER_BLOOM_Y_VH - FLOWER_HOVER_Y_VH) * eased;
          const dy = targetY - b.y;
          const stepY = FLY_SPEED_VH_PER_SEC * dt;
          b.y += Math.sign(dy) * Math.min(Math.abs(dy), stepY);

          b.y += Math.sin(now / 110 + i) * 0.04;

          if (
            Math.abs(dx) < ARRIVE_EPSILON &&
            Math.abs(b.y - FLOWER_BLOOM_Y_VH) < ARRIVE_EPSILON
          ) {
            b.phase = 'butine';
            b.phaseUntil = now + BUTINE_MS_MIN + Math.random() * (BUTINE_MS_MAX - BUTINE_MS_MIN);
          }
        } else if (b.phase === 'butine') {
          const t = now / 180;
          b.y = FLOWER_BLOOM_Y_VH + Math.sin(t) * 0.4;
          if (now > b.phaseUntil) {
            const prev = b.targetIdx;
            claimed.delete(prev);
            const next = claimFlower(prev);
            if (next >= 0) { b.targetIdx = next; b.phase = 'fly'; }
            else { b.targetIdx = -1; b.phase = 'fly'; }
          }
        }
      }

      const wingFrame: 0 | 1 = Math.floor(now / 160) % 2 === 0 ? 0 : 1;
      const vw = window.innerWidth / 100;
      const vh = window.innerHeight / 100;
      let needsDraw = false;
      for (let i = 0; i < bees.length; i++) {
        const b = bees[i];
        const xPx = b.x * vw;
        const yPx = b.y * vh;
        const last = lastDrawn[i];
        if (
          Number.isNaN(last.x) ||
          Math.abs(last.x - xPx) > 0.4 ||
          Math.abs(last.y - yPx) > 0.4 ||
          last.f !== b.facing ||
          last.wing !== wingFrame
        ) {
          needsDraw = true;
          last.x = xPx; last.y = yPx; last.f = b.facing; last.wing = wingFrame;
        }
      }
      if (needsDraw) drawScene(ctx, now);
    }

    let unsubscribe: (() => void) | null = null;
    const startTimer = window.setTimeout(() => {
      unsubscribe = subscribeSpriteDraw(tick);
    }, 700);
    return () => {
      clearTimeout(startTimer);
      if (unsubscribe) unsubscribe();
    };
  }, [season]);

  return null;
}
