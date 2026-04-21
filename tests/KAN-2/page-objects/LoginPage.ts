import { Page, expect } from '@playwright/test';
import { APP_URL, INVENTORY_PATH } from '../fixtures/test-data';

/**
 * KAN-2: LoginPage Page Object
 * Follows SOLID/SRP principle — encapsulates all login page interactions
 * Locators use stable data-test attributes discovered during exploratory testing
 */
export class LoginPage {
  private readonly page: Page;

  // Stable locators confirmed during exploratory testing
  private readonly usernameInput = '[data-test="username"]';
  private readonly passwordInput = '[data-test="password"]';
  private readonly loginButton   = '[data-test="login-button"]';
  private readonly errorMessage  = '[data-test="error"]';
  private readonly errorDismiss  = '[data-test="error-button"]';

  constructor(page: Page) {
    this.page = page;
  }

  /** Navigate to the SauceDemo login page */
  async navigate(): Promise<void> {
    await this.page.goto(APP_URL);
    await this.page.waitForLoadState('networkidle');
  }

  /** Fill username field */
  async fillUsername(username: string): Promise<void> {
    await this.page.locator(this.usernameInput).fill(username);
  }

  /** Fill password field */
  async fillPassword(password: string): Promise<void> {
    await this.page.locator(this.passwordInput).fill(password);
  }

  /** Click the login button */
  async clickLoginButton(): Promise<void> {
    await this.page.locator(this.loginButton).click();
  }

  /** Perform a full login with the given credentials */
  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }

  /** Get the current error message text */
  async getErrorMessage(): Promise<string> {
    return (await this.page.locator(this.errorMessage).textContent() ?? '').trim();
  }

  /** Check if an error message is visible */
  async isErrorVisible(): Promise<boolean> {
    return this.page.locator(this.errorMessage).isVisible();
  }

  /** Click the X button to dismiss the error message */
  async dismissError(): Promise<void> {
    await this.page.locator(this.errorDismiss).click();
  }

  /** Check whether the current page is the login page */
  async isOnLoginPage(): Promise<boolean> {
    return this.page.url() === `${APP_URL}/` || this.page.url() === APP_URL;
  }

  /** Check whether the current page is the inventory page */
  async isOnInventoryPage(): Promise<boolean> {
    return this.page.url().includes(INVENTORY_PATH);
  }

  /** Assert that the user is on the inventory page */
  async assertOnInventoryPage(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(INVENTORY_PATH));
  }

  /** Assert a specific error message is displayed */
  async assertErrorMessage(expectedMessage: string): Promise<void> {
    await expect(this.page.locator(this.errorMessage)).toBeVisible();
    await expect(this.page.locator(this.errorMessage)).toContainText(expectedMessage);
  }

  /** Get the username field placeholder text */
  async getUsernamePlaceholder(): Promise<string | null> {
    return this.page.locator(this.usernameInput).getAttribute('placeholder');
  }

  /** Get the password field placeholder text */
  async getPasswordPlaceholder(): Promise<string | null> {
    return this.page.locator(this.passwordInput).getAttribute('placeholder');
  }

  /** Get the password input type attribute */
  async getPasswordInputType(): Promise<string | null> {
    return this.page.locator(this.passwordInput).getAttribute('type');
  }

  /** Check if the login button is enabled */
  async isLoginButtonEnabled(): Promise<boolean> {
    return this.page.locator(this.loginButton).isEnabled();
  }
}
