import { describe, it, expect, beforeEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SeasonProvider } from './SeasonProvider';
import { useSeason } from './useSeason';

function Probe() {
  const { season, setSeason } = useSeason();
  return (
    <div>
      <span data-testid="value">{season}</span>
      <button onClick={() => setSeason('winter')}>winter</button>
    </div>
  );
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-season');
});

describe('SeasonProvider', () => {
  it('writes data-season on <html> on mount', () => {
    render(<SeasonProvider initial="autumn"><Probe /></SeasonProvider>);
    expect(document.documentElement.dataset.season).toBe('autumn');
    expect(screen.getByTestId('value')).toHaveTextContent('autumn');
  });

  it('prefers localStorage value over initial prop when valid', () => {
    localStorage.setItem('season', 'summer');
    render(<SeasonProvider initial="spring"><Probe /></SeasonProvider>);
    expect(screen.getByTestId('value')).toHaveTextContent('summer');
    expect(document.documentElement.dataset.season).toBe('summer');
  });

  it('ignores invalid localStorage value and falls back to initial', () => {
    localStorage.setItem('season', 'fall');
    render(<SeasonProvider initial="spring"><Probe /></SeasonProvider>);
    expect(screen.getByTestId('value')).toHaveTextContent('spring');
  });

  it('setSeason updates the attribute and persists', async () => {
    const user = userEvent.setup();
    render(<SeasonProvider initial="spring"><Probe /></SeasonProvider>);
    await act(async () => { await user.click(screen.getByText('winter')); });
    expect(document.documentElement.dataset.season).toBe('winter');
    expect(localStorage.getItem('season')).toBe('winter');
  });
});
