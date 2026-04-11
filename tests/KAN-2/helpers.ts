// Helper functions and Page Object Model for SauceDemo Login Tests
// spec: specs/KAN-2-test-plan.md

import { Page, expect } from '@playwright/test';

// URLs
export const SAUCE_DEMO_URL = 'https://www.saucedemo.com';
export const INVENTORY_URL = `${SAUCE_DEMO_URL}/inventory.html`;

// Test credentials
export const TEST_USERS = {
  standard_user: 'standard_user',
  locked_out_user: 'locked_out_user',
  problem_user: 'problem_user',
  performance_glitch_user: 'performance_glitch_user',
};

export const INVALID_USERS = {
  invalid_user: 'invalid_user',
};

export const TEST_PASSWORD = 'secret_sauce';

// Selectors for login page elements (using data-testid for stability)
export const LOGIN_SELECTORS = {
  username: '[data-test="username"]',
  password: '[data-test="password"]',
  loginButton: '[data-test="login-button"]',
  errorMessage: '[data-test="error"]',
  errorCloseButton: '[data-test="error-button"]',
  errorContainer: '[data-test="error-container"]',
  inventoryList: '[data-test="inventory-list"]',
  inventoryItem: '[data-test="inventory-item"]',
  pageTitle: '.login_logo, [class*="login_logo"]',
} as const;

// Page Object Model for Login Page
export class LoginPage {
  constructor(private page: Page) {}

  /**
   * Navigate to the SauceDemo login page
   */
  async navigate(): Promise<void> {
    await this.page.goto(SAUCE_DEMO_URL);
    await this.waitForPageLoad();
  }

  /**
   * Wait for login page to fully load
   */
  private async waitForPageLoad(): Promise<void> {
    await this.page.locator(LOGIN_SELECTORS.username).waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Enter username in the username field
   */
  async enterUsername(username: string): Promise<void> {
    await this.page.locator(LOGIN_SELECTORS.username).fill(username);
  }

  /**
   * Enter password in the password field
   */
  async enterPassword(password: string): Promise<void> {
    await this.page.locator(LOGIN_SELECTORS.password).fill(password);
  }

  /**
   * Click the login button
   */
  async clickLoginButton(): Promise<void> {
    await this.page.locator(LOGIN_SELECTORS.loginButton).click();
  }

  /**
   * Perform complete login with username and password
   */
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string | null> {
    const errorLocator = this.page.locator(LOGIN_SELECTORS.errorMessage);
    if (await errorLocator.isVisible()) {
      return await errorLocator.textContent();
    }
    return null;
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    try {
      return await this.page.locator(LOGIN_SELECTORS.errorMessage).isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  /**
   * Close the error message using the close button
   */
  async closeErrorMessage(): Promise<void> {
    await this.page.locator(LOGIN_SELECTORS.errorCloseButton).click();
  }

  /**
   * Get the value of the username field
   */
  async getUsernameFieldValue(): Promise<string> {
    return await this.page.locator(LOGIN_SELECTORS.username).inputValue();
  }

  /**
   * Get the value of the password field
   */
  async getPasswordFieldValue(): Promise<string> {
    return await this.page.locator(LOGIN_SELECTORS.password).inputValue();
  }

  /**
   * Clear the username field
   */
  async clearUsernameField(): Promise<void> {
    await this.page.locator(LOGIN_SELECTORS.username).clear();
  }

  /**
   * Clear the password field
   */
  async clearPasswordField(): Promise<void> {
    await this.page.locator(LOGIN_SELECTORS.password).clear();
  }

  /**
   * Clear all form fields
   */
  async clearAllFields(): Promise<void> {
    await this.clearUsernameField();
    await this.clearPasswordField();
  }

  /**
   * Check if username field is visible
   */
  async isUsernameFieldVisible(): Promise<boolean> {
    return await this.page.locator(LOGIN_SELECTORS.username).isVisible();
  }

  /**
   * Check if password field is visible
   */
  async isPasswordFieldVisible(): Promise<boolean> {
    return await this.page.locator(LOGIN_SELECTORS.password).isVisible();
  }

  /**
   * Check if login button is visible
   */
  async isLoginButtonVisible(): Promise<boolean> {
    return await this.page.locator(LOGIN_SELECTORS.loginButton).isVisible();
  }

  /**
   * Focus on username field
   */
  async focusUsernameField(): Promise<void> {
    await this.page.locator(LOGIN_SELECTORS.username).focus();
  }

  /**
   * Focus on password field
   */
  async focusPasswordField(): Promise<void> {
    await this.page.locator(LOGIN_SELECTORS.password).focus();
  }

  /**
   * Verify login page structure
   */
  async verifyLoginPageStructure(): Promise<void> {
    await expect(this.page).toHaveTitle('Swag Labs');
    await expect(this.page.locator(LOGIN_SELECTORS.username)).toBeVisible();
    await expect(this.page.locator(LOGIN_SELECTORS.password)).toBeVisible();
    await expect(this.page.locator(LOGIN_SELECTORS.loginButton)).toBeVisible();
  }

  /**
   * Verify inventory page is loaded after successful login
   */
  async verifyInventoryPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(INVENTORY_URL);
  }

  /**
   * Get inventory item count
   */
  async getInventoryItemCount(): Promise<number> {
    return await this.page.locator(LOGIN_SELECTORS.inventoryItem).count();
  }

  /**
   * Get page URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Wait for URL to change to inventory page
   */
  async waitForInventoryPageLoad(): Promise<void> {
    await this.page.waitForURL(INVENTORY_URL);
  }
}

// Assertion helpers
export async function assertError(page: Page, expectedErrorMessage: string): Promise<void> {
  const errorElement = page.locator(LOGIN_SELECTORS.errorMessage);
  await expect(errorElement).toBeVisible();
  const actualError = await errorElement.textContent();
  expect(actualError).toContain(expectedErrorMessage);
}

export async function assertNoError(page: Page): Promise<void> {
  try {
    await expect(page.locator(LOGIN_SELECTORS.errorMessage)).not.toBeVisible({ timeout: 2000 });
  } catch {
    // Expected - error should not be visible
  }
}

export async function assertLoginPageUrl(page: Page): Promise<void> {
  await expect(page).toHaveURL(SAUCE_DEMO_URL + '/');
}

export async function assertInventoryPageUrl(page: Page): Promise<void> {
  await expect(page).toHaveURL(INVENTORY_URL);
}
