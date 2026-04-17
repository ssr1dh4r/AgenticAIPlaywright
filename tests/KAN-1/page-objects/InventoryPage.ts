import { Page } from '@playwright/test';

/**
 * InventoryPage — Single Responsibility: handles product listing and cart actions on inventory.
 */
export class InventoryPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForURL('**/inventory.html');
  }

  async addToCart(productSlug: string): Promise<void> {
    await this.page.click(`[data-test="add-to-cart-${productSlug}"]`);
  }

  async removeFromCart(productSlug: string): Promise<void> {
    await this.page.click(`[data-test="remove-${productSlug}"]`);
  }

  async getCartBadgeCount(): Promise<number> {
    const badge = this.page.locator('.shopping_cart_badge');
    const count = await badge.count();
    if (count === 0) return 0;
    const text = await badge.textContent();
    return parseInt(text ?? '0', 10);
  }

  async isAddToCartButtonVisible(productSlug: string): Promise<boolean> {
    return this.page.locator(`[data-test="add-to-cart-${productSlug}"]`).isVisible();
  }

  async isRemoveButtonVisible(productSlug: string): Promise<boolean> {
    return this.page.locator(`[data-test="remove-${productSlug}"]`).isVisible();
  }

  async getProductCount(): Promise<number> {
    return this.page.locator('.inventory_item').count();
  }

  async navigateToCart(): Promise<void> {
    await this.page.click('[data-test="shopping-cart-link"]');
  }

  async sortBy(option: string): Promise<void> {
    await this.page.selectOption('[data-test="product-sort-container"]', option);
  }
}
