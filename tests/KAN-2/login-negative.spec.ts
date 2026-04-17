// spec: specs/KAN-2/KAN-2_test_plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Invalid Credentials Tests', () => {
  test('TC-KAN2-004: Login failure with invalid username', async ({ page }) => {
    // Navigate to https://www.saucedemo.com/ for TC-KAN2-004: Login failure with invalid username
    await page.goto('https://www.saucedemo.com/');

    // Enter 'invalid_user' in username field - expect: Username field accepts the input
    await page.locator('[data-test="username"]').fill('invalid_user');

    // Enter 'secret_sauce' in password field - expect: Password field accepts the input
    await page.locator('[data-test="password"]').fill('secret_sauce');

    // Click Login button - expect: Error message appears: 'Epic sadface: Username and password do not match any user in this service'
    await page.locator('[data-test="login-button"]').click();

    // expect: Error message appears: 'Epic sadface: Username and password do not match any user in this service'
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Username and password do not match any user in this service');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('TC-KAN2-005: Login failure with test user', async ({ page }) => {
    // Navigate to https://www.saucedemo.com/
    await page.goto('https://www.saucedemo.com/');

    // Enter 'test' in username field
    await page.locator('[data-test="username"]').fill('test');

    // Enter 'secret_sauce' in password field
    await page.locator('[data-test="password"]').fill('secret_sauce');

    // Click Login button
    await page.locator('[data-test="login-button"]').click();

    // expect: Error message appears
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Username and password do not match any user in this service');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('TC-KAN2-006: Login failure with both invalid credentials', async ({ page }) => {
    // Navigate to https://www.saucedemo.com/ for TC-KAN2-006: Login failure with both invalid credentials
    await page.goto('https://www.saucedemo.com/');

    // Enter 'test_user' in username field - expect: Username field accepts the input
    await page.locator('[data-test="username"]').fill('test_user');

    // Enter 'wrong_password' in password field - expect: Password field accepts the input
    await page.locator('[data-test="password"]').fill('wrong_password');

    // Click Login button - expect: Error message appears: 'Epic sadface: Username and password do not match any user in this service'
    await page.locator('[data-test="login-button"]').click();

    // expect: Same error message appears for both invalid credentials
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Username and password do not match any user in this service');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('TC-KAN2-010: Locked out user login attempt', async ({ page }) => {
    // Navigate to https://www.saucedemo.com/ for TC-KAN2-010: Locked out user login attempt
    await page.goto('https://www.saucedemo.com/');

    // Enter 'locked_out_user' in username field - expect: Username field accepts the input
    await page.locator('[data-test="username"]').fill('locked_out_user');

    // Enter 'secret_sauce' in password field - expect: Password field accepts the input
    await page.locator('[data-test="password"]').fill('secret_sauce');

    // Click Login button - expect: Specific error message appears: 'Epic sadface: Sorry, this user has been locked out.'
    await page.locator('[data-test="login-button"]').click();

    // expect: Specific error message appears: 'Epic sadface: Sorry, this user has been locked out.'
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Sorry, this user has been locked out.');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });
});