import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SeasonProvider } from './SeasonProvider';
import { SeasonToggle } from './SeasonToggle';
import type { Season } from './season';

function setup(initial: Season = 'spring') {
  return render(
    <SeasonProvider initial={initial}>
      <SeasonToggle />
    </SeasonProvider>
  );
}

describe('SeasonToggle', () => {
  it('renders a radiogroup with one radio per season; aria-checked reflects active', () => {
    setup('autumn');
    const group = screen.getByRole('radiogroup', { name: /change season/i });
    expect(group).toBeInTheDocument();
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(4);
    expect(screen.getByRole('radio', { name: /autumn/i }))
      .toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: /spring/i }))
      .toHaveAttribute('aria-checked', 'false');
  });

  it('roving tabindex: only the active radio is in the tab sequence', () => {
    setup('summer');
    expect(screen.getByRole('radio', { name: /summer/i })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('radio', { name: /spring/i })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('radio', { name: /autumn/i })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('radio', { name: /winter/i })).toHaveAttribute('tabindex', '-1');
  });

  it('clicking a radio updates active state and html data-season', async () => {
    const user = userEvent.setup();
    setup('spring');
    await user.click(screen.getByRole('radio', { name: /winter/i }));
    expect(document.documentElement.dataset.season).toBe('winter');
    expect(screen.getByRole('radio', { name: /winter/i })).toHaveAttribute('aria-checked', 'true');
  });

  it('ArrowRight moves focus AND activates the next season', async () => {
    const user = userEvent.setup();
    setup('spring');
    screen.getByRole('radio', { name: /spring/i }).focus();
    await user.keyboard('{ArrowRight}');
    const summer = screen.getByRole('radio', { name: /summer/i });
    expect(summer).toHaveFocus();
    expect(summer).toHaveAttribute('aria-checked', 'true');
    expect(document.documentElement.dataset.season).toBe('summer');
  });

  it('ArrowLeft wraps backward from spring to winter and activates', async () => {
    const user = userEvent.setup();
    setup('spring');
    screen.getByRole('radio', { name: /spring/i }).focus();
    await user.keyboard('{ArrowLeft}');
    const winter = screen.getByRole('radio', { name: /winter/i });
    expect(winter).toHaveFocus();
    expect(winter).toHaveAttribute('aria-checked', 'true');
  });

  it('Home jumps to spring and End jumps to winter, both activate', async () => {
    const user = userEvent.setup();
    setup('autumn');
    screen.getByRole('radio', { name: /autumn/i }).focus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('radio', { name: /spring/i })).toHaveFocus();
    expect(document.documentElement.dataset.season).toBe('spring');
    await user.keyboard('{End}');
    expect(screen.getByRole('radio', { name: /winter/i })).toHaveFocus();
    expect(document.documentElement.dataset.season).toBe('winter');
  });
});
