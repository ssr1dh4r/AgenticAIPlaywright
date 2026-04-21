import { test, expect } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage';
import { EDGE_CASE_INPUTS, ERROR_MESSAGES } from './fixtures/test-data';

/**
 * KAN-2: Login Edge Cases & Security Tests
 * Special characters, SQL injection, long strings
 * Tests: TC-KAN2-014, TC-KAN2-015, TC-KAN2-016
 */

test.describe('KAN-2: Login Edge Cases & Security Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('TC-KAN2-014: Special characters in username are handled gracefully', async () => {
    // Act: Login with special characters
    await loginPage.login(EDGE_CASE_INPUTS.SPECIAL_CHARS, 'secret_sauce');

    // Assert: No crash, proper error displayed
    expect(await loginPage.isOnLoginPage()).toBe(true);
    await loginPage.assertErrorMessage(ERROR_MESSAGES.CREDENTIALS_MISMATCH);
    expect(await loginPage.isOnInventoryPage()).toBe(false);
  });

  test('TC-KAN2-015: SQL injection attempt is blocked and does not grant access', async () => {
    // Act: Attempt SQL injection via username field
    await loginPage.login(EDGE_CASE_INPUTS.SQL_INJECTION, 'secret_sauce');

    // Assert: Not redirected to inventory — injection is blocked
    expect(await loginPage.isOnLoginPage()).toBe(true);
    expect(await loginPage.isOnInventoryPage()).toBe(false);
    await loginPage.assertErrorMessage(ERROR_MESSAGES.CREDENTIALS_MISMATCH);
  });

  test('TC-KAN2-016: Very long string (500 chars) is handled without layout issues', async ({ page }) => {
    // Act: Submit very long username and password
    await loginPage.login(EDGE_CASE_INPUTS.LONG_STRING, EDGE_CASE_INPUTS.LONG_STRING);

    // Assert: No crash, error shown, no horizontal overflow
    expect(await loginPage.isOnInventoryPage()).toBe(false);
    expect(await loginPage.isErrorVisible()).toBe(true);

    // Verify no layout overflow
    const noOverflow = await page.evaluate(
      () => document.body.scrollWidth <= window.innerWidth + 10
    );
    expect(noOverflow).toBe(true);
  });
});
