import { test, expect } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage';
import { ERROR_MESSAGES, UI_TEXT } from './fixtures/test-data';

/**
 * KAN-2: Login Validation & UI Tests
 * Field validations, error dismissal, placeholder text, password masking
 * Tests: TC-KAN2-007, TC-KAN2-008, TC-KAN2-009, TC-KAN2-011, TC-KAN2-012, TC-KAN2-013
 */

test.describe('KAN-2: Login Field Validation & UI Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('TC-KAN2-007: Empty username shows username required error', async () => {
    // Act: Submit with only password filled
    await loginPage.fillPassword('secret_sauce');
    await loginPage.clickLoginButton();

    // Assert: Username required error displayed
    await loginPage.assertErrorMessage(ERROR_MESSAGES.USERNAME_REQUIRED);
    expect(await loginPage.isOnLoginPage()).toBe(true);
  });

  test('TC-KAN2-008: Empty password shows password required error', async () => {
    // Act: Submit with only username filled
    await loginPage.fillUsername('standard_user');
    await loginPage.clickLoginButton();

    // Assert: Password required error displayed
    await loginPage.assertErrorMessage(ERROR_MESSAGES.PASSWORD_REQUIRED);
    expect(await loginPage.isOnLoginPage()).toBe(true);
  });

  test('TC-KAN2-009: Both fields empty shows username required error', async () => {
    // Act: Submit with both fields empty
    await loginPage.clickLoginButton();

    // Assert: Username required error (takes priority)
    await loginPage.assertErrorMessage(ERROR_MESSAGES.USERNAME_REQUIRED);
    expect(await loginPage.isOnLoginPage()).toBe(true);
  });

  test('TC-KAN2-011: Error message can be dismissed with X button', async () => {
    // Arrange: Trigger an error
    await loginPage.login('invalid_user', 'secret_sauce');
    expect(await loginPage.isErrorVisible()).toBe(true);

    // Act: Dismiss the error
    await loginPage.dismissError();

    // Assert: Error is gone
    expect(await loginPage.isErrorVisible()).toBe(false);
    expect(await loginPage.isLoginButtonEnabled()).toBe(true);
  });

  test('TC-KAN2-012: Login form displays correct placeholder text', async () => {
    // Assert: Correct placeholders
    expect(await loginPage.getUsernamePlaceholder()).toBe(UI_TEXT.USERNAME_PLACEHOLDER);
    expect(await loginPage.getPasswordPlaceholder()).toBe(UI_TEXT.PASSWORD_PLACEHOLDER);
  });

  test('TC-KAN2-013: Password field is masked (type=password)', async () => {
    // Assert: Password field uses type=password for masking
    expect(await loginPage.getPasswordInputType()).toBe('password');
  });
});
