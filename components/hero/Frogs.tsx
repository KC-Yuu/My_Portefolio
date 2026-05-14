'use client';
import { useEffect } from 'react';
import { subscribeSpriteDraw } from './spriteCanvas';
import { useSeason } from '@/components/season/useSeason';

const PAD_COUNT = 3;
const SIT_OFFSET_Y_PX = -10;
const FROG_HALF_WIDTH = 15;
const SIT_DURATION_MS = 4200;
const SIT_VARIANCE_MS = 1800;
const JUMP_DURATION_MS = 700;
const JUMP_HEIGHT_PX = 36;
const FROG_SIZE = 22;
const PX = FROG_SIZE / 6;

type Rect = readonly [number, number, number, number];

const BODY: ReadonlyArray<Rect> = [
  [2, 0, 4, 1], [1, 1, 6, 1], [0, 2, 8, 1], [0, 3, 8, 1],
  [1, 4, 6, 1], [2, 5, 1, 1], [5, 5, 1, 1],
];
const HIGHLIGHT: ReadonlyArray<Rect> = [
  [3, 3, 2, 1], [4, 4, 1, 1],
];
const EYE_WHITE: ReadonlyArray<Rect> = [
  [2, 1, 1, 1], [5, 1, 1, 1],
];
const EYE_PUPIL: ReadonlyArray<Rect> = [
  [2, 2, 1, 1], [5, 2, 1, 1],
];

export function Frogs() {
  const { season } = useSeason();

  useEffect(() => {
    if (season !== 'summer') return;

    const padCache: Array<SVGGraphicsElement | null> = new Array(PAD_COUNT).fill(null);
    for (let i = 0; i < PAD_COUNT; i++) {
      padCache[i] = document.querySelector<SVGGraphicsElement>(`[data-frog-pad="${i}"]`);
    }
    const padPositions: Array<{ x: number; y: number } | null> =
      new Array(PAD_COUNT).fill(null);
    function recomputePadPositions() {
      for (let i = 0; i < PAD_COUNT; i++) {
        const padEl = padCache[i];
        if (!padEl) {
          padPositions[i] = null;
          continue;
        }
        const r = padEl.getBoundingClientRect();
        padPositions[i] = {
          x: r.left + r.width / 2,
          y: r.top + r.height / 2 + SIT_OFFSET_Y_PX,
        };
      }
    }
    recomputePadPositions();
    window.addEventListener('resize', recomputePadPositions);
    window.addEventListener('scroll', recomputePadPositions, { passive: true });

    function padPx(idx: number): { x: number; y: number } | null {
      return padPositions[idx];
    }

    let currentIdx = 0;
    let targetIdx = 1;
    let phase: 'sit' | 'jump' = 'sit';
    let phaseStart = performance.now();
    let sitDuration = SIT_DURATION_MS + Math.random() * SIT_VARIANCE_MS;
    let jumpSource: { x: number; y: number } | null = null;
    let facing: 1 | -1 = 1;
    let frogX = 0, frogY = 0;
    let shadowX = 0, shadowY = 0, shadowH = 0;
    let renderShadow = false;
    let lastFrogX = NaN, lastFrogY = NaN, lastFacing = 0;
    let lastShadowState = '';
    let lastDirty: { x: number; y: number; w: number; h: number } | null = null;

    function pickNext(): number {
      let idx = Math.floor(Math.random() * PAD_COUNT);
      while (idx === currentIdx) idx = Math.floor(Math.random() * PAD_COUNT);
      return idx;
    }

    function drawScene(ctx: CanvasRenderingContext2D) {
      const sw = 8 * PX;
      const sh = 6 * PX;
      let dx = frogX;
      let dy = frogY;
      let dw = sw;
      let dh = sh;
      if (renderShadow && shadowH > 0) {
        const t = Math.min(1, shadowH / JUMP_HEIGHT_PX);
        const scale = 0.5 + t * 0.8;
        const sx = shadowX - 14 * scale;
        const sy = shadowY - 4 * scale;
        const sw2 = 28 * scale;
        const sh2 = 8 * scale;
        const x1 = Math.min(dx, sx);
        const y1 = Math.min(dy, sy);
        const x2 = Math.max(dx + dw, sx + sw2);
        const y2 = Math.max(dy + dh, sy + sh2);
        dx = x1; dy = y1; dw = x2 - x1; dh = y2 - y1;
      }
      const pad = 2;
      dx -= pad; dy -= pad; dw += 2 * pad; dh += 2 * pad;

      if (lastDirty) ctx.clearRect(lastDirty.x, lastDirty.y, lastDirty.w, lastDirty.h);
      ctx.clearRect(dx, dy, dw, dh);
      lastDirty = { x: dx, y: dy, w: dw, h: dh };

      if (renderShadow && shadowH > 0) {
        const t = Math.min(1, shadowH / JUMP_HEIGHT_PX);
        const scale = 0.5 + t * 0.8;
        const opacity = 0.55 - t * 0.4;
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(shadowX, shadowY, 14 * scale, 4 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      const ox = frogX;
      const oy = frogY;
      ctx.save();
      if (facing === -1) {
        const cx = ox + (8 * PX) / 2;
        ctx.translate(cx, 0);
        ctx.scale(-1, 1);
        ctx.translate(-cx, 0);
      }
      ctx.fillStyle = '#4a8b3a';
      for (const [x, y, w, h] of BODY) ctx.fillRect(ox + x * PX, oy + y * PX, w * PX, h * PX);
      ctx.fillStyle = '#6dbb4a';
      for (const [x, y, w, h] of HIGHLIGHT) ctx.fillRect(ox + x * PX, oy + y * PX, w * PX, h * PX);
      ctx.fillStyle = '#fffaf0';
      for (const [x, y, w, h] of EYE_WHITE) ctx.fillRect(ox + x * PX, oy + y * PX, w * PX, h * PX);
      ctx.fillStyle = '#1a1a1a';
      for (const [x, y, w, h] of EYE_PUPIL) ctx.fillRect(ox + x * PX, oy + y * PX, w * PX, h * PX);
      ctx.restore();
    }

    let lastFrame = 0;

    function tick(ctx: CanvasRenderingContext2D, _canvas: HTMLCanvasElement, now: number) {
      const frameMs = phase === 'jump' ? 33 : 1000;
      if (now - lastFrame < frameMs) return;
      lastFrame = now;
      const elapsed = now - phaseStart;

      if (phase === 'sit') {
        renderShadow = false;
        const p = padPx(currentIdx);
        if (p) { frogX = p.x - FROG_HALF_WIDTH; frogY = p.y; }
        if (elapsed > sitDuration) {
          targetIdx = pickNext();
          jumpSource = padPx(currentIdx);
          const to = padPx(targetIdx);
          if (jumpSource && to) facing = to.x >= jumpSource.x ? 1 : -1;
          phase = 'jump';
          phaseStart = now;
        }
      } else {
        const progress = Math.min(1, elapsed / JUMP_DURATION_MS);
        const from = jumpSource;
        const to = padPx(targetIdx);
        if (from && to) {
          const x = from.x + (to.x - from.x) * progress;
          const lineY = from.y + (to.y - from.y) * progress;
          const arc = -4 * JUMP_HEIGHT_PX * progress * (progress - 1);
          frogX = x - FROG_HALF_WIDTH;
          frogY = lineY - arc;
          shadowX = x;
          shadowY = lineY;
          shadowH = arc;
          renderShadow = true;
        }
        if (progress >= 1) {
          currentIdx = targetIdx;
          jumpSource = null;
          phase = 'sit';
          phaseStart = now;
          sitDuration = SIT_DURATION_MS + Math.random() * SIT_VARIANCE_MS;
        }
      }

      const shadowState = renderShadow ? `${shadowX.toFixed(1)}|${shadowY.toFixed(1)}|${shadowH.toFixed(1)}` : '';
      const dx = Math.abs(frogX - lastFrogX);
      const dy = Math.abs(frogY - lastFrogY);
      if (
        Number.isNaN(lastFrogX) ||
        dx > 0.4 || dy > 0.4 ||
        facing !== lastFacing ||
        shadowState !== lastShadowState
      ) {
        drawScene(ctx);
        lastFrogX = frogX;
        lastFrogY = frogY;
        lastFacing = facing;
        lastShadowState = shadowState;
      }
    }

    let unsubscribe: (() => void) | null = null;
    const startTimer = window.setTimeout(() => {
      unsubscribe = subscribeSpriteDraw(tick);
    }, 600);

    return () => {
      clearTimeout(startTimer);
      if (unsubscribe) unsubscribe();
      window.removeEventListener('resize', recomputePadPositions);
      window.removeEventListener('scroll', recomputePadPositions);
    };
  }, [season]);

  return null;
}
