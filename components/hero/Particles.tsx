'use client';
import { useEffect, useRef } from 'react';
import { useSeason } from '@/components/season/useSeason';
import type { Season } from '@/components/season/season';
import { SEASON_META, type ParticleConfig } from '@/config/seasons';

const PARTICLE_COLORS: Record<Season, string> = {
  spring: '#ffb7d5',
  summer: '#fff5a8',
  autumn: '#e76f51',
  winter: '#ffffff',
};

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  rot: number; vrot: number;
}

function rand([a, b]: [number, number]) { return a + Math.random() * (b - a); }

export function Particles() {
  const { season } = useSeason();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = 1;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const cfg = SEASON_META[season].particles;
    const color = PARTICLE_COLORS[season];
    const particles: Particle[] = Array.from({ length: cfg.count }, () => makeParticle(cfg, canvas.clientWidth, canvas.clientHeight));

    let raf = 0;
    let running = !reduced;
    let lastFrame = 0;
    const FRAME_MS = 60;

    function step(now: number) {
      if (running) raf = requestAnimationFrame(step);
      if (!ctx || !canvas) return;
      if (now - lastFrame < FRAME_MS) return;
      lastFrame = now;
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      ctx.fillStyle = color;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (cfg.rotate) p.rot += p.vrot;

        const off = (p.y > canvas.clientHeight + 10) || (p.y < -10) || (p.x < -10) || (p.x > canvas.clientWidth + 10);
        if (off) Object.assign(p, makeParticle(cfg, canvas.clientWidth, canvas.clientHeight, true));

        if (cfg.rotate) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        } else {
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
      }
    }

    if (running) raf = requestAnimationFrame(step);

    function onVisibility() {
      running = document.visibilityState === 'visible' && !reduced;
      if (running && !raf) raf = requestAnimationFrame(step);
    }
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [season]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 z-10 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

function makeParticle(cfg: ParticleConfig, w: number, h: number, recycle = false): Particle {
  const upward = cfg.upward;
  return {
    x: Math.random() * w,
    y: recycle ? (upward ? h + 5 : -5) : Math.random() * h,
    vx: rand(cfg.velX),
    vy: rand(cfg.velY),
    size: rand(cfg.size),
    rot: Math.random() * Math.PI * 2,
    vrot: cfg.rotate ? (Math.random() - 0.5) * 0.05 : 0,
  };
}
