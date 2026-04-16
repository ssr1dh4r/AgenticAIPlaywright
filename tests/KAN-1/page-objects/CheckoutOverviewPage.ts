import { Page } from '@playwright/test';

/**
 * CheckoutOverviewPage — Single Responsibility: handles checkout overview (step 2) interactions.
 */
export class CheckoutOverviewPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForURL('**/checkout-step-two.html');
  }

  async getItemNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async getItemPrices(): Promise<string[]> {
    return this.page.locator('.inventory_item_price').allTextContents();
  }

  async getPaymentInfo(): Promise<string> {
    return (await this.page.locator('[data-test="payment-info-value"]').textContent()) ?? '';
  }

  async getShippingInfo(): Promise<string> {
    return (await this.page.locator('[data-test="shipping-info-value"]').textContent()) ?? '';
  }

  async getSubtotalText(): Promise<string> {
    return (await this.page.locator('[data-test="subtotal-label"]').textContent()) ?? '';
  }

  async getTaxText(): Promise<string> {
    return (await this.page.locator('[data-test="tax-label"]').textContent()) ?? '';
  }

  async getTotalText(): Promise<string> {
    return (await this.page.locator('[data-test="total-label"]').textContent()) ?? '';
  }

  async getSubtotalAmount(): Promise<number> {
    const text = await this.getSubtotalText();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getTaxAmount(): Promise<number> {
    const text = await this.getTaxText();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getTotalAmount(): Promise<number> {
    const text = await this.getTotalText();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async clickFinish(): Promise<void> {
    await this.page.click('[data-test="finish"]');
  }

  async clickCancel(): Promise<void> {
    await this.page.click('[data-test="cancel"]');
  }
}
