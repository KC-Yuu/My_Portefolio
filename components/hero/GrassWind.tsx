'use client';
import { useEffect } from 'react';

const RADIUS_PX = 220;
const ANGLE_MAX = 32;
const HORIZ_GAIN = 0.95;
const VERT_GAIN = 0.75;
// Pointer velocity low-pass: higher = slower to track sudden direction changes.
const VELOCITY_SMOOTH = 0.86;
// Idle decay applied each tick once cursor stops moving.
const VELOCITY_DECAY = 0.90;
// Per-blade lerp toward target angle: gives each blade its own inertia,
// so direction reversals can't snap blades flip-flop.
const BLADE_LERP = 0.18;
const SETTLE_EPSILON = 0.08;
const TICK_MS = 33;

interface BladeRef {
  el: HTMLElement;
  x: number;
  y: number;
  angle: number;
}

export function GrassWind() {
  useEffect(() => {
    let blades: BladeRef[] = [];
    let pointerX = -99999;
    let pointerY = -99999;
    let lastPointerX = pointerX;
    let lastPointerY = pointerY;
    let vx = 0;
    let vy = 0;
    let raf = 0;
    let last = 0;

    function cacheBlades() {
      const els = document.querySelectorAll<HTMLElement>('.blade');
      const prev = new Map(blades.map((b) => [b.el, b.angle] as const));
      blades = Array.from(els).map((el) => {
        const r = el.getBoundingClientRect();
        return {
          el,
          x: (r.left + r.right) / 2,
          y: r.bottom,
          angle: prev.get(el) ?? 0,
        };
      });
    }

    function onMove(e: PointerEvent) {
      pointerX = e.clientX;
      pointerY = e.clientY;
    }

    function tick(now: number) {
      raf = requestAnimationFrame(tick);
      if (now - last < TICK_MS) return;
      last = now;

      if (lastPointerX > -9000 && pointerX > -9000) {
        const dx = pointerX - lastPointerX;
        const dy = pointerY - lastPointerY;
        vx = vx * VELOCITY_SMOOTH + dx * (1 - VELOCITY_SMOOTH);
        vy = vy * VELOCITY_SMOOTH + dy * (1 - VELOCITY_SMOOTH);
      }
      lastPointerX = pointerX;
      lastPointerY = pointerY;

      // Idle decay so blades return when cursor stops or leaves.
      vx *= VELOCITY_DECAY;
      vy *= VELOCITY_DECAY;

      for (const b of blades) {
        const ddx = b.x - pointerX;
        const ddy = b.y - pointerY;
        const dist = Math.hypot(ddx, ddy);
        const prox = Math.max(0, 1 - dist / RADIUS_PX);

        let target = 0;
        if (prox > 0) {
          const horiz = vx * prox * HORIZ_GAIN;
          // Cursor sweeping down (vy > 0) pushes blades outward from cursor X axis.
          const vert = vy * Math.sign(ddx) * prox * VERT_GAIN;
          target = horiz + vert;
          if (target > ANGLE_MAX) target = ANGLE_MAX;
          else if (target < -ANGLE_MAX) target = -ANGLE_MAX;
        }

        b.angle += (target - b.angle) * BLADE_LERP;

        if (Math.abs(b.angle) < SETTLE_EPSILON && Math.abs(target) < SETTLE_EPSILON) {
          b.angle = 0;
          b.el.style.removeProperty('--blade-wind');
        } else {
          b.el.style.setProperty('--blade-wind', `${b.angle.toFixed(2)}deg`);
        }
      }
    }

    const startTimer = window.setTimeout(() => {
      cacheBlades();
      window.addEventListener('pointermove', onMove, { passive: true });
      raf = requestAnimationFrame(tick);
    }, 500);
    const ro = new ResizeObserver(cacheBlades);
    ro.observe(document.body);

    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      ro.disconnect();
      blades.forEach((b) => b.el.style.removeProperty('--blade-wind'));
    };
  }, []);

  return null;
}
