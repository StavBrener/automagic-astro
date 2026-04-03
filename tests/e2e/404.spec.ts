import { test, expect } from '@playwright/test';

test.describe('404 page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/nonexistent-page-xyz', { waitUntil: 'domcontentloaded' });
  });

  test('returns a page (not a blank error)', async ({ page }) => {
    // Should not be an empty or error page
    const body = await page.locator('body').textContent();
    expect(body?.trim().length).toBeGreaterThan(10);
  });

  test('custom 404 page renders with "Page not found" heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /page not found/i })).toBeVisible();
  });

  test('displays a 404 visual indicator', async ({ page }) => {
    // The page should show "404" text visually
    const text404 = page.getByText('404');
    await expect(text404).toBeVisible();
  });

  test('has a link back to the homepage', async ({ page }) => {
    const homeLink = page.getByRole('link', { name: /back to home|home/i });
    await expect(homeLink).toBeVisible();
    await homeLink.click();
    await expect(page).toHaveURL('/');
  });

  test('has a link to the contact page', async ({ page }) => {
    const contactLink = page.getByRole('link', { name: /contact/i }).first();
    await expect(contactLink).toBeVisible();
  });

  test('has noindex meta tag', async ({ page }) => {
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', /noindex/i);
  });

  test('navigation links are accessible from 404 page', async ({ page }) => {
    // Quick nav links: Services, Process, About
    await expect(page.getByRole('link', { name: /services/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /about/i })).toBeVisible();
  });
});

test.describe('404 — edge cases', () => {
  const notFoundPaths = [
    '/does-not-exist',
    '/about/nested/path',
    '/contact/unknown',
    '/images/missing-file.jpg',
  ];

  for (const path of notFoundPaths) {
    test(`shows custom 404 for ${path}`, async ({ page }) => {
      const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
      // Status may be 404 or 200 depending on Netlify SPA redirect config
      // The key assertion is that the custom 404 UI renders
      const heading = page.getByRole('heading', { name: /page not found/i });
      await expect(heading).toBeVisible({ timeout: 5000 });
    });
  }
});
