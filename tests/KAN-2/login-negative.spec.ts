import { test, expect } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage';
import { INVALID_USERS, LOCKED_USER, ERROR_MESSAGES } from './fixtures/test-data';

/**
 * KAN-2: Login Negative Tests
 * AC2: Invalid credentials, locked user
 * Tests: TC-KAN2-004, TC-KAN2-005, TC-KAN2-006, TC-KAN2-010
 */

test.describe('KAN-2: Login Negative Tests - AC2 Invalid Logins', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  for (const { username, password, testId } of INVALID_USERS) {
    test(`${testId}: Invalid login with ${username} shows error`, async () => {
      // Act: Attempt login with invalid credentials
      await loginPage.login(username, password);

      // Assert: Still on login page with correct error
      expect(await loginPage.isOnLoginPage()).toBe(true);
      await loginPage.assertErrorMessage(ERROR_MESSAGES.CREDENTIALS_MISMATCH);
    });
  }

  test(`${LOCKED_USER.testId}: Locked user cannot login`, async () => {
    // Act: Attempt login with locked user credentials
    await loginPage.login(LOCKED_USER.username, LOCKED_USER.password);

    // Assert: Still on login page with locked out error
    expect(await loginPage.isOnLoginPage()).toBe(true);
    await loginPage.assertErrorMessage(ERROR_MESSAGES.LOCKED_OUT);
  });
});
