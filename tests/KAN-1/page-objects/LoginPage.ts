import { Page } from '@playwright/test';

/**
 * LoginPage — Single Responsibility: handles all login page interactions.
 * Following SRP from SOLID principles.
 */
export class LoginPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.fill('[data-test="username"]', username);
    await this.page.fill('[data-test="password"]', password);
    await this.page.click('[data-test="login-button"]');
  }

  async getErrorMessage(): Promise<string> {
    return (await this.page.locator('[data-test="error"]').textContent()) ?? '';
  }

  async isOnLoginPage(): Promise<boolean> {
    return this.page.url().endsWith('/');
  }
}
