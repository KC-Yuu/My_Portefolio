import { test, expect } from '@playwright/test';

const SEASONS = ['spring', 'summer', 'autumn', 'winter'] as const;

test.describe('season toggle', () => {
  test('clicking each season updates data-season', async ({ page }) => {
    await page.goto('/');
    for (const s of SEASONS) {
      await page.getByRole('radio', { name: s }).click();
      await expect(page.locator('html')).toHaveAttribute('data-season', s);
      await expect(page.getByRole('radio', { name: s })).toHaveAttribute('aria-checked', 'true');
    }
  });

  test('selection persists across reload', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('radio', { name: 'winter' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-season', 'winter');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-season', 'winter');
  });

  test('Hero and Projects are visible on home', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /featured projects/i })).toBeVisible();
    await expect(page.locator('header').first()).toBeVisible();
    await expect(page.locator('section#projects')).toBeVisible();
  });

  test('reduced motion keeps particle canvas static', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('/');
    // Wait a moment for any one-shot draw to complete
    await page.waitForTimeout(200);
    const a = await page.locator('canvas').screenshot();
    await page.waitForTimeout(500);
    const b = await page.locator('canvas').screenshot();
    expect(Buffer.compare(a, b)).toBe(0);
    await ctx.close();
  });
});
