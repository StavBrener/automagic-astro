import { test, expect } from '@playwright/test';

test.describe('Footer links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('footer is visible on the page', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('footer shows Automagic Dev brand name', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer.getByText(/automagic dev/i)).toBeVisible();
  });

  test('footer Services link resolves without error', async ({ page }) => {
    const footer = page.locator('footer');
    const link = footer.getByRole('link', { name: /^services$/i });
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    expect(href).toBe('/#services');
  });

  test('footer Process link resolves without error', async ({ page }) => {
    const footer = page.locator('footer');
    const link = footer.getByRole('link', { name: /^process$/i });
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    expect(href).toBe('/#process');
  });

  test('footer About link navigates to /about', async ({ page }) => {
    const footer = page.locator('footer');
    const link = footer.getByRole('link', { name: /^about$/i });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL('/about');
    await expect(page).not.toHaveURL(/404/);
  });

  test('footer Contact link navigates to /contact', async ({ page }) => {
    const footer = page.locator('footer');
    const link = footer.getByRole('link', { name: /^contact$/i });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL('/contact');
    await expect(page).not.toHaveURL(/404/);
  });

  test('footer Privacy Policy link navigates to /privacy-policy', async ({ page }) => {
    const footer = page.locator('footer');
    const link = footer.getByRole('link', { name: /privacy policy/i });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL('/privacy-policy');
    await expect(page).not.toHaveURL(/404/);
  });

  test('footer GitHub social link is present and has correct href', async ({ page }) => {
    const footer = page.locator('footer');
    const githubLink = footer.getByRole('link', { name: /github/i });
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute('href', /github\.com/);
    await expect(githubLink).toHaveAttribute('target', '_blank');
    await expect(githubLink).toHaveAttribute('rel', /noopener/);
  });

  test('footer Twitter/X social link is present and has correct href', async ({ page }) => {
    const footer = page.locator('footer');
    const twitterLink = footer.getByRole('link', { name: /twitter|x$/i });
    await expect(twitterLink).toBeVisible();
    await expect(twitterLink).toHaveAttribute('href', /x\.com|twitter\.com/);
    await expect(twitterLink).toHaveAttribute('target', '_blank');
    await expect(twitterLink).toHaveAttribute('rel', /noopener/);
  });

  test('footer copyright text is present', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer.getByText(/automagic dev/i)).toBeVisible();
    await expect(footer.getByText(/built entirely by ai agents/i)).toBeVisible();
  });

  test('all footer internal links do not 404', async ({ page, request }) => {
    const footer = page.locator('footer');
    const links = await footer.getByRole('link').all();

    for (const link of links) {
      const href = await link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('/#')) {
        continue; // skip external links and hash anchors
      }
      // Internal link — verify it responds without 404
      const response = await request.get(href);
      expect(response.status(), `Expected ${href} to not return 404`).not.toBe(404);
    }
  });
});
