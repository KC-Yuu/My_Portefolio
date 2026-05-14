import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PixelFrame } from './PixelFrame';

describe('PixelFrame', () => {
  it('renders children inside a div wrapper', () => {
    render(<PixelFrame data-testid="frame"><span>inside</span></PixelFrame>);
    expect(screen.getByTestId('frame')).toBeInTheDocument();
    expect(screen.getByText('inside')).toBeInTheDocument();
  });

  it('passes through className', () => {
    render(<PixelFrame data-testid="frame" className="extra-class"><span /></PixelFrame>);
    expect(screen.getByTestId('frame').className).toMatch(/extra-class/);
  });
});
