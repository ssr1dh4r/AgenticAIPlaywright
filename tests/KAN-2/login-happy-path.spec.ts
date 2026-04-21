import { test, expect } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage';
import { VALID_USERS, INVENTORY_PATH } from './fixtures/test-data';

/**
 * KAN-2: Login Happy Path Tests
 * AC1: Valid user login scenarios
 * Tests: TC-KAN2-001, TC-KAN2-002, TC-KAN2-003
 */

test.describe('KAN-2: Login Happy Path - AC1 Valid Logins', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  for (const { username, password, testId } of VALID_USERS) {
    test(`${testId}: Successful login with ${username}`, async ({ page }) => {
      // Act: Login with valid credentials
      await loginPage.login(username, password);

      // Assert: Redirected to inventory page
      await loginPage.assertOnInventoryPage();
      expect(await loginPage.isOnInventoryPage()).toBe(true);
      expect(await loginPage.isErrorVisible()).toBe(false);
    });
  }
});
