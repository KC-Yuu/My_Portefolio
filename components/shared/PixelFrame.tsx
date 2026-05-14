import type { HTMLAttributes, ReactNode } from 'react';

export interface PixelFrameProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function PixelFrame({ children, className = '', style, ...rest }: PixelFrameProps) {
  return (
    <div
      {...rest}
      className={`relative ${className}`}
      style={{
        boxShadow: [
          '0 -4px 0 0 var(--ink)',
          '0 4px 0 0 var(--ink)',
          '-4px 0 0 0 var(--ink)',
          '4px 0 0 0 var(--ink)',
          'inset 0 0 0 4px var(--paper)',
        ].join(','),
        background: 'var(--paper)',
        ...style,
      }}
    >
      <span aria-hidden="true" className="pixel absolute -top-1 -left-1 w-2 h-2" style={{ background: 'var(--accent)' }} />
      <span aria-hidden="true" className="pixel absolute -top-1 -right-1 w-2 h-2" style={{ background: 'var(--accent)' }} />
      <span aria-hidden="true" className="pixel absolute -bottom-1 -left-1 w-2 h-2" style={{ background: 'var(--accent)' }} />
      <span aria-hidden="true" className="pixel absolute -bottom-1 -right-1 w-2 h-2" style={{ background: 'var(--accent)' }} />
      {children}
    </div>
  );
}
