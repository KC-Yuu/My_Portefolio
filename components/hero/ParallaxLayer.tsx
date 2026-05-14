'use client';
import { useEffect, useRef } from 'react';

const FACTOR = 0.3;

export function ParallaxLayer() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY * FACTOR;
        el.style.transform = `translate3d(0, ${y}px, 0)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute inset-x-0 z-20"
      style={{
        bottom: '28%',
        height: '20%',
        transition: 'background 600ms ease',
        backgroundImage: `linear-gradient(180deg, transparent 0%, var(--foliage) 100%)`,
        opacity: 0.85,
      }}
    >
      <div
        className="pixel absolute inset-x-0 bottom-0"
        style={{
          height: 32,
          backgroundColor: 'var(--foliage)',
          maskImage:
            'radial-gradient(circle at 10% 100%, black 18px, transparent 19px), radial-gradient(circle at 30% 100%, black 26px, transparent 27px), radial-gradient(circle at 55% 100%, black 22px, transparent 23px), radial-gradient(circle at 80% 100%, black 30px, transparent 31px)',
          WebkitMaskImage:
            'radial-gradient(circle at 10% 100%, black 18px, transparent 19px), radial-gradient(circle at 30% 100%, black 26px, transparent 27px), radial-gradient(circle at 55% 100%, black 22px, transparent 23px), radial-gradient(circle at 80% 100%, black 30px, transparent 31px)',
          maskComposite: 'add',
          WebkitMaskComposite: 'source-over',
        }}
      />
    </div>
  );
}
