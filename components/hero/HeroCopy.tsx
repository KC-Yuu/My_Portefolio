import { site } from '@/config/site';

export function HeroCopy() {
  return (
    <div className="relative z-50 flex flex-col items-start gap-3 max-w-2xl pointer-events-auto">
      <p className="pixel pixel-font text-sm uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
        {site.title}
      </p>
      <h1
        className="pixel-font pixel text-5xl md:text-7xl leading-tight"
        style={{ color: 'var(--ink)' }}
      >
        {site.name}
      </h1>
      <p className="text-base md:text-lg" style={{ color: 'var(--ink)' }}>
        {site.tagline}
      </p>
    </div>
  );
}
