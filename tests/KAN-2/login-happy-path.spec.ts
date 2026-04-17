// spec: specs/KAN-2/KAN-2_test_plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Happy Path Login Tests', () => {
  test('TC-KAN2-001: Successful login with standard_user', async ({ page }) => {
    // Navigate to https://www.saucedemo.com/ - expect: Login page loads successfully
    await page.goto('https://www.saucedemo.com/');

    // expect: Username field is visible
    await expect(page.locator('[data-test="username"]')).toBeVisible();

    // expect: Password field is visible  
    await expect(page.locator('[data-test="password"]')).toBeVisible();

    // expect: Login button is visible and enabled
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();

    // Enter 'standard_user' in username field - expect: Username field accepts the input
    await page.locator('[data-test="username"]').fill('standard_user');

    // Enter 'secret_sauce' in password field - expect: Password field accepts the input (masked)
    await page.locator('[data-test="password"]').fill('secret_sauce');

    // Click Login button - expect: User is redirected to inventory page and URL changes to '/inventory.html'
    await page.locator('[data-test="login-button"]').click();

    // expect: Products page displays correctly with Products heading
    await expect(page.locator('[data-test="title"]')).toBeVisible();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('TC-KAN2-002: Successful login with problem_user', async ({ page }) => {
    // Navigate to https://www.saucedemo.com/ for TC-KAN2-002: Login with problem_user
    await page.goto('https://www.saucedemo.com/');

    // Enter 'problem_user' in username field - expect: Username field accepts the input
    await page.locator('[data-test="username"]').fill('problem_user');

    // Enter 'secret_sauce' in password field - expect: Password field accepts the input
    await page.locator('[data-test="password"]').fill('secret_sauce');

    // Click Login button - expect: User is successfully logged in and redirected to inventory page
    await page.locator('[data-test="login-button"]').click();

    // expect: Redirected to inventory page for problem_user
    await expect(page.locator('[data-test="title"]')).toBeVisible();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('TC-KAN2-003: Successful login with visual_user', async ({ page }) => {
    // Navigate to https://www.saucedemo.com/ for TC-KAN2-003: Login with visual_user  
    await page.goto('https://www.saucedemo.com/');

    // Enter 'visual_user' in username field - expect: Username field accepts the input
    await page.locator('[data-test="username"]').fill('visual_user');

    // Enter 'secret_sauce' in password field - expect: Password field accepts the input
    await page.locator('[data-test="password"]').fill('secret_sauce');

    // Click Login button - expect: User is successfully logged in and redirected to inventory page
    await page.locator('[data-test="login-button"]').click();

    // expect: Redirected to inventory page for visual_user
    await expect(page.locator('[data-test="title"]')).toBeVisible();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });
});