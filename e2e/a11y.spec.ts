import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const SEASONS = ['spring', 'summer', 'autumn', 'winter'] as const;

for (const s of SEASONS) {
  test(`no critical axe violations on ${s}`, async ({ page }) => {
    await page.goto('/');
    await page.getByRole('radio', { name: s }).click();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    const critical = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
  });
}
