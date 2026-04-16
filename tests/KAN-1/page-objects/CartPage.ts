import { Page } from '@playwright/test';

/**
 * CartPage — Single Responsibility: handles shopping cart page interactions.
 */
export class CartPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForURL('**/cart.html');
  }

  async getItemCount(): Promise<number> {
    return this.page.locator('.cart_item').count();
  }

  async getItemNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async getItemPrices(): Promise<string[]> {
    return this.page.locator('.inventory_item_price').allTextContents();
  }

  async getItemQuantity(index = 0): Promise<string> {
    return (await this.page.locator('.cart_quantity').nth(index).textContent()) ?? '';
  }

  async removeItem(productSlug: string): Promise<void> {
    await this.page.click(`[data-test="remove-${productSlug}"]`);
  }

  async continueShopping(): Promise<void> {
    await this.page.click('[data-test="continue-shopping"]');
  }

  async proceedToCheckout(): Promise<void> {
    await this.page.click('[data-test="checkout"]');
  }

  async isCheckoutButtonVisible(): Promise<boolean> {
    return this.page.locator('[data-test="checkout"]').isVisible();
  }

  async isContinueShoppingButtonVisible(): Promise<boolean> {
    return this.page.locator('[data-test="continue-shopping"]').isVisible();
  }
}
