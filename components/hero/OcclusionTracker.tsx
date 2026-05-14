'use client';
import { useEffect } from 'react';
import { subscribeAnimationFrame } from './useAnimationFrame';

const TICK_MS = 100;
const MAX_OCCLUSION = 0.97;
// Sun sprite viewBox is 32x32; disc occupies cols 9..22, rows 9..22 (radius 7 / 32).
const DISC_RADIUS_FRAC = 7 / 32;
// Sample window around each ray's emergence point (directional, per-ray).
const SAMPLE_SIZE_PX = 56;
// Weight: how much global sun-bbox overlap contributes to every ray's occlusion.
// Ensures clouds touching ANY part of the sun (above/below/sides) trigger fade.
const GLOBAL_WEIGHT = 0.55;
// Curve shapes response: lower = earlier reaction, near-full coverage hides ray.
const CURVE = 1.0;

interface Rect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

function rectOverlap(a: Rect, b: DOMRect): number {
  const ox = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const oy = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return ox * oy;
}

export function OcclusionTracker() {
  useEffect(() => {
    let last = 0;

    let sun = document.querySelector<HTMLElement>('[data-sun-target]');
    let rays = document.querySelectorAll<HTMLElement>('[data-ray]');
    let clouds = document.querySelectorAll<HTMLElement>('[data-cloud]');
    let backlight = document.querySelector<HTMLElement>('[data-sun-backlight]');
    let lastRefresh = 0;
    const REFRESH_MS = 2000;

    function clearRays() {
      rays.forEach((el) => {
        el.style.opacity = '';
      });
      if (backlight) backlight.style.opacity = '0';
    }

    function tick(now: number) {
      if (now - last < TICK_MS) return;
      last = now;

      if (now - lastRefresh > REFRESH_MS) {
        sun = document.querySelector<HTMLElement>('[data-sun-target]');
        rays = document.querySelectorAll<HTMLElement>('[data-ray]');
        clouds = document.querySelectorAll<HTMLElement>('[data-cloud]');
        backlight = document.querySelector<HTMLElement>('[data-sun-backlight]');
        lastRefresh = now;
      }

      if (!sun || rays.length === 0) {
        clearRays();
        return;
      }

      const sunRect = sun.getBoundingClientRect();
      const cx = (sunRect.left + sunRect.right) / 2;
      const cy = (sunRect.top + sunRect.bottom) / 2;
      const radius = sunRect.width * DISC_RADIUS_FRAC;
      const sunBbox: Rect = {
        left: sunRect.left,
        right: sunRect.right,
        top: sunRect.top,
        bottom: sunRect.bottom,
      };
      const sunArea = sunRect.width * sunRect.height;

      const cloudRects: DOMRect[] = [];
      clouds.forEach((c) => cloudRects.push(c.getBoundingClientRect()));

      // Global occlusion: any cloud touching sun bbox (rays area too).
      let globalOverlap = 0;
      for (const cr of cloudRects) globalOverlap += rectOverlap(sunBbox, cr);
      const globalRaw = sunArea > 0 ? Math.min(1, globalOverlap / sunArea) : 0;

      if (backlight) {
        const glow = Math.min(1, globalRaw * 3.0);
        backlight.style.opacity = glow.toFixed(3);
      }

      const sampleArea = SAMPLE_SIZE_PX * SAMPLE_SIZE_PX;

      rays.forEach((rayEl) => {
        const angleDeg = Number(rayEl.dataset.rayAngle ?? '0');
        const rad = (angleDeg * Math.PI) / 180;
        // CSS rotate: vector (0,1) → (-sin α, cos α) in screen space (x right, y down).
        const dx = -Math.sin(rad);
        const dy = Math.cos(rad);
        const ex = cx + dx * radius;
        const ey = cy + dy * radius;

        const sample: Rect = {
          left: ex - SAMPLE_SIZE_PX / 2,
          right: ex + SAMPLE_SIZE_PX / 2,
          top: ey - SAMPLE_SIZE_PX / 2,
          bottom: ey + SAMPLE_SIZE_PX / 2,
        };

        let overlap = 0;
        for (const cr of cloudRects) overlap += rectOverlap(sample, cr);

        const local = Math.min(1, overlap / sampleArea);
        const combined = Math.min(1, local + globalRaw * GLOBAL_WEIGHT);
        const shaped = Math.min(MAX_OCCLUSION, Math.pow(combined, CURVE));
        rayEl.style.opacity = (1 - shaped).toFixed(3);
      });
    }

    let unsubscribe: (() => void) | null = null;
    const startTimer = window.setTimeout(() => {
      unsubscribe = subscribeAnimationFrame(tick);
    }, 400);
    return () => {
      clearTimeout(startTimer);
      if (unsubscribe) unsubscribe();
      clearRays();
    };
  }, []);

  return null;
}
