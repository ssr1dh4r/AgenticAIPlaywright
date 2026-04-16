import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const URL = 'https://www.saucedemo.com/';
const INVALID_MSG = 'Epic sadface: Username and password do not match any user in this service';

async function openLogin(page: Page) {
  await page.goto(URL, { timeout: 60000 });
  await expect(page.locator('[data-test="username"]')).toBeVisible();
  await expect(page.locator('[data-test="password"]')).toBeVisible();
}

async function login(page: Page, username: string, password: string) {
  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="password"]').fill(password);
  await page.locator('[data-test="login-button"]').click();
}

test.describe('KAN-2 Login Authentication', () => {
  for (const user of ['standard_user', 'problem_user', 'visual_user']) {
    test(`valid login: ${user}`, async ({ page }) => {
      await openLogin(page);
      await login(page, user, 'secret_sauce');
      await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
      await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    });
  }

  for (const user of ['test_user', 'test', 'invalid_user']) {
    test(`invalid login: ${user}`, async ({ page }) => {
      await openLogin(page);
      await login(page, user, 'secret_sauce');
      await expect(page).toHaveURL(URL);
      await expect(page.locator('[data-test="error"]')).toContainText(INVALID_MSG);
    });
  }
});
