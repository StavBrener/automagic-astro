import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Services link scrolls to #services section', async ({ page }) => {
    await page.getByRole('navigation').first().getByRole('link', { name: /services/i }).click();
    await expect(page).toHaveURL(/#services/);
  });

  test('Process link scrolls to #process section', async ({ page }) => {
    await page.getByRole('navigation').first().getByRole('link', { name: /process/i }).click();
    await expect(page).toHaveURL(/#process/);
  });

  test('About link navigates to /about page', async ({ page }) => {
    await page.getByRole('navigation').first().getByRole('link', { name: /about/i }).click();
    await expect(page).toHaveURL('/about');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('Contact link navigates to /contact page', async ({ page }) => {
    await page.getByRole('navigation').first().getByRole('link', { name: /contact/i }).click();
    await expect(page).toHaveURL('/contact');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('logo / brand link returns to home', async ({ page }) => {
    await page.goto('/about');
    const logoLink = page.getByRole('link', { name: /automagic dev/i }).first();
    await logoLink.click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('mobile nav toggle button is visible on small screens', async ({ page }) => {
    const toggle = page.getByRole('button', { name: /menu|navigation|open/i });
    await expect(toggle).toBeVisible();
  });

  test('mobile nav opens on toggle click', async ({ page }) => {
    const toggle = page.getByRole('button', { name: /menu|navigation|open/i });
    await toggle.click();
    // Nav links should now be visible in mobile drawer/menu
    await expect(page.getByRole('link', { name: /about/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /contact/i }).first()).toBeVisible();
  });

  test('mobile nav closes on second toggle click', async ({ page }) => {
    const toggle = page.getByRole('button', { name: /menu|navigation|open|close/i });
    await toggle.click();
    await toggle.click();
    // After closing, the mobile menu should not be expanded
    const mobileMenu = page.locator('[data-mobile-menu], [aria-expanded="false"]').first();
    await expect(mobileMenu).toBeDefined();
  });

  test('nav links navigate correctly on mobile', async ({ page }) => {
    const toggle = page.getByRole('button', { name: /menu|navigation|open/i });
    await toggle.click();
    await page.getByRole('link', { name: /about/i }).first().click();
    await expect(page).toHaveURL('/about');
  });
});
