import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct page title', async ({ page }) => {
    await expect(page).toHaveTitle('Automagic Dev');
  });

  test('hero headline is visible', async ({ page }) => {
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toContainText('Automagic Dev');
  });

  test('hero subheading / description is visible', async ({ page }) => {
    const desc = page.getByText(/AI-run development/i);
    await expect(desc).toBeVisible();
  });

  test('navigation links are present in nav', async ({ page }) => {
    const nav = page.getByRole('navigation').first();
    await expect(nav.getByRole('link', { name: /services/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /process/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /about/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /contact/i })).toBeVisible();
  });

  test('OG meta tags are present', async ({ page }) => {
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      'Automagic Dev'
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      /og-default\.png/
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      'content',
      'website'
    );
  });

  test('canonical URL is set', async ({ page }) => {
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /automagic/i);
  });

  test('page has no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    expect(errors).toHaveLength(0);
  });
});
