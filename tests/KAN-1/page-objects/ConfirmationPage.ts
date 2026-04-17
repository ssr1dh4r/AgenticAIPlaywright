import { Page } from '@playwright/test';

/**
 * ConfirmationPage — Single Responsibility: handles order confirmation page interactions.
 */
export class ConfirmationPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForURL('**/checkout-complete.html');
  }

  async getHeaderText(): Promise<string> {
    return (await this.page.locator('[data-test="complete-header"]').textContent()) ?? '';
  }

  async getBodyText(): Promise<string> {
    return (await this.page.locator('[data-test="complete-text"]').textContent()) ?? '';
  }

  async isPonyImageVisible(): Promise<boolean> {
    return this.page.locator('[data-test="pony-express"]').isVisible();
  }

  async isBackHomeButtonVisible(): Promise<boolean> {
    return this.page.locator('[data-test="back-to-products"]').isVisible();
  }

  async clickBackHome(): Promise<void> {
    await this.page.click('[data-test="back-to-products"]');
  }
}
