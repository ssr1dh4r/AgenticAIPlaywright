import { Page, expect } from '@playwright/test';
import { APP_URL, INVENTORY_URL_PATTERN } from '../fixtures/test-data';

/**
 * LoginPage — Single Responsibility: all interactions with the SauceDemo login page.
 * Follows SOLID SRP principle — this class only handles login page concerns.
 *
 * Locators verified during exploratory testing (2026-04-17):
 *   Username:       [data-test="username"]
 *   Password:       [data-test="password"]
 *   Login button:   [data-test="login-button"]
 *   Error message:  [data-test="error"]
 *   Error close:    [data-test="error-button"]
 */
export class LoginPage {
  private readonly page: Page;

  // Stable locators discovered during exploratory testing
  private readonly usernameLocator  = '[data-test="username"]';
  private readonly passwordLocator  = '[data-test="password"]';
  private readonly loginBtnLocator  = '[data-test="login-button"]';
  private readonly errorLocator     = '[data-test="error"]';
  private readonly errorBtnLocator  = '[data-test="error-button"]';
  private readonly titleLocator     = '[data-test="title"]';

  constructor(page: Page) {
    this.page = page;
  }

  /** Navigate to the SauceDemo login page */
  async navigate(): Promise<void> {
    await this.page.goto(APP_URL);
  }

  /** Fill the username input field */
  async fillUsername(username: string): Promise<void> {
    await this.page.locator(this.usernameLocator).fill(username);
  }

  /** Fill the password input field */
  async fillPassword(password: string): Promise<void> {
    await this.page.locator(this.passwordLocator).fill(password);
  }

  /** Click the Login button */
  async clickLoginButton(): Promise<void> {
    await this.page.locator(this.loginBtnLocator).click();
  }

  /** Combined: fill credentials and click login */
  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }

  /** Returns the visible error message text */
  async getErrorMessage(): Promise<string> {
    return (await this.page.locator(this.errorLocator).textContent()) ?? '';
  }

  /** Returns true if the error banner is currently visible */
  async isErrorVisible(): Promise<boolean> {
    return this.page.locator(this.errorLocator).isVisible();
  }

  /** Clicks the X button to dismiss the error banner */
  async dismissError(): Promise<void> {
    await this.page.locator(this.errorBtnLocator).click();
  }

  /** Returns true if the current URL is the login page root */
  async isOnLoginPage(): Promise<boolean> {
    return this.page.url() === APP_URL;
  }

  /** Returns true if the current URL contains /inventory.html */
  async isOnInventoryPage(): Promise<boolean> {
    return INVENTORY_URL_PATTERN.test(this.page.url());
  }

  /** Returns the placeholder attribute of the username field */
  async getUsernamePlaceholder(): Promise<string | null> {
    return this.page.locator(this.usernameLocator).getAttribute('placeholder');
  }

  /** Returns the placeholder attribute of the password field */
  async getPasswordPlaceholder(): Promise<string | null> {
    return this.page.locator(this.passwordLocator).getAttribute('placeholder');
  }

  /** Returns true if the password field masks input (type="password") */
  async isPasswordMasked(): Promise<boolean> {
    const type = await this.page.locator(this.passwordLocator).getAttribute('type');
    return type === 'password';
  }

  /** Returns true if the login button is enabled */
  async isLoginButtonEnabled(): Promise<boolean> {
    return this.page.locator(this.loginBtnLocator).isEnabled();
  }

  /** Asserts the page is on the inventory page */
  async assertOnInventoryPage(): Promise<void> {
    await expect(this.page).toHaveURL(INVENTORY_URL_PATTERN);
    await expect(this.page.locator(this.titleLocator)).toBeVisible();
  }

  /** Asserts the error message contains the expected text */
  async assertErrorMessage(expectedText: string): Promise<void> {
    await expect(this.page.locator(this.errorLocator)).toBeVisible();
    await expect(this.page.locator(this.errorLocator)).toContainText(expectedText);
  }
}
