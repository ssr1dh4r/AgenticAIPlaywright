import { expect, test } from '@playwright/test';

const URL = 'https://www.saucedemo.com/';

test.describe('KAN-2 Form Validation', () => {
  test('empty username shows required message', async ({ page }) => {
    await page.goto(URL, { timeout: 60000 });
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Username is required');
  });

  test('empty password shows required message', async ({ page }) => {
    await page.goto(URL, { timeout: 60000 });
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Password is required');
  });

  test('password input remains masked', async ({ page }) => {
    await page.goto(URL, { timeout: 60000 });
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await expect(page.locator('[data-test="password"]')).toHaveAttribute('type', 'password');
  });
});
