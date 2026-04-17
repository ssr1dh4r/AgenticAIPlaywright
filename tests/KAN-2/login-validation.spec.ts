/**
 * KAN-2 - SauceDemo Login Validation
 * Test Suite: UI Validation Tests
 *
 * Covers:
 *   TC-KAN2-007 — Empty username shows "Username is required"
 *   TC-KAN2-008 — Empty password shows "Password is required"
 *   TC-KAN2-009 — Both empty shows "Username is required" (username checked first)
 *   TC-KAN2-011 — Error dismiss button clears the error banner
 *   TC-KAN2-012 — Helper text (accepted usernames + password) is visible on page
 *   TC-KAN2-013 — Input field attributes: placeholders, password masking, button enabled
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage';
import { APP_URL, ERROR_MESSAGES, UI_TEXT } from './fixtures/test-data';

test.describe('UI Validation Tests — KAN-2', () => {

  test('TC-KAN2-007: Empty username shows "Username is required"', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    // Leave username empty, enter password only
    await loginPage.fillPassword('secret_sauce');
    await loginPage.clickLoginButton();

    // Expect: "Username is required" error
    await loginPage.assertErrorMessage(ERROR_MESSAGES.usernameRequired);

    // Expect: still on login page
    await expect(page).toHaveURL(APP_URL);
  });

  test('TC-KAN2-008: Empty password shows "Password is required"', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    // Enter username only, leave password empty
    await loginPage.fillUsername('standard_user');
    await loginPage.clickLoginButton();

    // Expect: "Password is required" error
    await loginPage.assertErrorMessage(ERROR_MESSAGES.passwordRequired);

    // Expect: still on login page
    await expect(page).toHaveURL(APP_URL);
  });

  test('TC-KAN2-009: Both fields empty — username is validated first', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    // Leave both fields empty and click login
    await loginPage.clickLoginButton();

    // Expect: username validation fires first
    await loginPage.assertErrorMessage(ERROR_MESSAGES.usernameRequired);

    // Expect: still on login page
    await expect(page).toHaveURL(APP_URL);
  });

  test('TC-KAN2-011: Error dismiss button clears the error banner', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    // Trigger an error first
    await loginPage.login('invalid_user', 'secret_sauce');
    await expect(page.locator('[data-test="error"]')).toBeVisible();

    // Click dismiss (X) button
    await loginPage.dismissError();

    // Expect: error banner is hidden
    await expect(page.locator('[data-test="error"]')).not.toBeVisible();

    // Expect: form is ready for input again
    await expect(page.locator('[data-test="username"]')).toBeVisible();
    await expect(page.locator('[data-test="login-button"]')).toBeEnabled();
  });

  test('TC-KAN2-012: Helper text is visible on the login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    // Expect: "Accepted usernames are:" heading visible
    await expect(page.getByRole('heading', { name: UI_TEXT.acceptedUsernamesHeading })).toBeVisible();

    // Expect: "Password for all users:" heading visible
    await expect(page.getByRole('heading', { name: UI_TEXT.passwordHeading })).toBeVisible();

    // Expect: at least one valid username (standard_user) is listed
    await expect(page.getByText('standard_user')).toBeVisible();

    // Expect: the shared password is listed
    await expect(page.getByText('secret_sauce')).toBeVisible();
  });

  test('TC-KAN2-013: Input field attributes are correct', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    // Username placeholder
    expect(await loginPage.getUsernamePlaceholder()).toBe(UI_TEXT.usernamePlaceholder);

    // Password placeholder
    expect(await loginPage.getPasswordPlaceholder()).toBe(UI_TEXT.passwordPlaceholder);

    // Password field masks characters (type="password")
    expect(await loginPage.isPasswordMasked()).toBe(true);

    // Login button is enabled by default
    expect(await loginPage.isLoginButtonEnabled()).toBe(true);
  });

});
