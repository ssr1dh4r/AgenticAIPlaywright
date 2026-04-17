import { Page } from '@playwright/test';

/**
 * CheckoutInfoPage — Single Responsibility: handles checkout information form (step 1).
 */
export class CheckoutInfoPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForURL('**/checkout-step-one.html');
  }

  async fillForm(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.page.fill('[data-test="firstName"]', firstName);
    await this.page.fill('[data-test="lastName"]', lastName);
    await this.page.fill('[data-test="postalCode"]', postalCode);
  }

  async clickContinue(): Promise<void> {
    await this.page.click('[data-test="continue"]');
  }

  async clickCancel(): Promise<void> {
    await this.page.click('[data-test="cancel"]');
  }

  async getErrorMessage(): Promise<string> {
    return (await this.page.locator('[data-test="error"]').textContent()) ?? '';
  }

  async dismissError(): Promise<void> {
    await this.page.click('.error-button');
  }

  async isErrorVisible(): Promise<boolean> {
    return this.page.locator('[data-test="error"]').isVisible();
  }

  async fillAndContinue(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fillForm(firstName, lastName, postalCode);
    await this.clickContinue();
  }
}
