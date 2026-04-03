import { test, expect } from '@playwright/test';

test.describe('Contact form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('contact page loads and has a heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('form has required fields: name, email, message', async ({ page }) => {
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/message/i)).toBeVisible();
  });

  test('form has submit button', async ({ page }) => {
    const submit = page.getByRole('button', { name: /send|submit/i });
    await expect(submit).toBeVisible();
  });

  test('form has correct netlify attributes', async ({ page }) => {
    const form = page.locator('form[data-netlify="true"]');
    await expect(form).toHaveCount(1);
    await expect(form).toHaveAttribute('method', 'post');
    await expect(form).toHaveAttribute('action', '/thank-you');
    await expect(form).toHaveAttribute('name', 'contact');
  });

  test('honeypot field is hidden', async ({ page }) => {
    // Netlify honeypot field should exist but not be visible to users
    const honeypot = page.locator('input[name="bot-field"], [aria-hidden="true"] input, .hidden input, p.hidden, [style*="display:none"] input').first();
    // The honeypot container should not be visible
    const botField = page.locator('[style*="display: none"] input, .hidden input').first();
    // Just verify it doesn't appear as a visible form field to users
    const visibleInputs = page.locator('input:visible');
    const inputNames: string[] = [];
    for (const input of await visibleInputs.all()) {
      const name = await input.getAttribute('name');
      if (name) inputNames.push(name);
    }
    expect(inputNames).not.toContain('bot-field');
  });

  test('empty form submission shows validation errors', async ({ page }) => {
    await page.getByRole('button', { name: /send|submit/i }).click();
    // HTML5 required field validation should prevent submission
    // and show validation messages
    const nameField = page.getByLabel(/name/i);
    const validationMessage = await nameField.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).toBeTruthy();
  });

  test('invalid email shows validation error', async ({ page }) => {
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('not-an-email');
    await page.getByRole('button', { name: /send|submit/i }).click();
    const emailField = page.getByLabel(/email/i);
    const validationMessage = await emailField.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).toBeTruthy();
  });

  test('valid form fill shows all fields populated', async ({ page }) => {
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/message/i).fill('This is a test message for QA validation.');

    await expect(page.getByLabel(/name/i)).toHaveValue('Test User');
    await expect(page.getByLabel(/email/i)).toHaveValue('test@example.com');
    await expect(page.getByLabel(/message/i)).toHaveValue(
      'This is a test message for QA validation.'
    );
  });
});

test.describe('Thank-you page', () => {
  test('thank-you page loads with success message', async ({ page }) => {
    await page.goto('/thank-you');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/thank you|message received/i);
  });

  test('thank-you page has link back to home', async ({ page }) => {
    await page.goto('/thank-you');
    const homeLink = page.getByRole('link', { name: /back to home|home/i });
    await expect(homeLink).toBeVisible();
    await homeLink.click();
    await expect(page).toHaveURL('/');
  });

  test('thank-you page has noindex meta tag', async ({ page }) => {
    await page.goto('/thank-you');
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', /noindex/i);
  });
});
