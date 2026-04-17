/**
 * KAN-2 - SauceDemo Login Validation
 * Test Suite: Edge Cases & Security Tests
 *
 * Covers:
 *   TC-KAN2-014 — Special characters in username handled gracefully
 *   TC-KAN2-015 — SQL injection attempt handled gracefully
 *   TC-KAN2-016 — Very long username (500+ chars) handled gracefully
 *
 * Verified during exploratory testing: the application returns the standard
 * "does not match" error for all these inputs without crashing or throwing errors.
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage';
import { APP_URL, ERROR_MESSAGES, EDGE_CASE_INPUTS } from './fixtures/test-data';

test.describe('Edge Cases & Security Tests — KAN-2', () => {

  test('TC-KAN2-014: Special characters in username are handled gracefully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    // Enter special characters as username
    await loginPage.login('!@#$%^&*()', 'secret_sauce');

    // Expect: standard error — no crash or system error
    await loginPage.assertErrorMessage(ERROR_MESSAGES.invalidCredentials);
    await expect(page).toHaveURL(APP_URL);
  });

  test('TC-KAN2-015: SQL injection attempt in username is handled gracefully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    // Enter SQL injection string as username
    await loginPage.login("'; DROP TABLE users; --", 'secret_sauce');

    // Expect: standard error — application is not vulnerable to SQL injection
    await loginPage.assertErrorMessage(ERROR_MESSAGES.invalidCredentials);
    await expect(page).toHaveURL(APP_URL);
  });

  test('TC-KAN2-016: Very long username (500 chars) is handled gracefully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    const longUsername = 'a'.repeat(500);

    // Enter very long string as username
    await loginPage.login(longUsername, 'secret_sauce');

    // Expect: standard error — no performance issue or crash
    await loginPage.assertErrorMessage(ERROR_MESSAGES.invalidCredentials);
    await expect(page).toHaveURL(APP_URL);
  });

  // Data-driven edge case test using the EDGE_CASE_INPUTS constant
  for (const { label, username } of EDGE_CASE_INPUTS) {
    test(`Edge case — ${label} username is rejected without errors`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();

      await loginPage.login(username, 'secret_sauce');

      // Expect: application handles gracefully — no crash, correct error shown
      await loginPage.assertErrorMessage(ERROR_MESSAGES.invalidCredentials);
      await expect(page).toHaveURL(APP_URL);
    });
  }

});
