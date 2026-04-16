import { expect, test } from '@playwright/test';

test.describe('KAN-2 Navigation and UI', () => {
  test('direct inventory access without auth redirects to login', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html', { timeout: 60000 });
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test('successful login lands on products with inventory list', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/', { timeout: 60000 });
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
  });
});
