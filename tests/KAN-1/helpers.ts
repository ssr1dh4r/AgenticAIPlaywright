/**
 * KAN-1: SauceDemo Checkout Validation
 * Helper Functions and Utilities for Test Suite
 * 
 * This module provides reusable functions for common operations across all test scenarios
 */

import { Page, expect } from '@playwright/test';

/**
 * Test data configuration
 */
export const TEST_DATA = {
  credentials: {
    username: 'standard_user',
    password: 'secret_sauce'
  },
  baseUrl: 'https://www.saucedemo.com',
  products: {
    backpack: { name: 'Sauce Labs Backpack', price: '$29.99', selector: '[data-test="add-to-cart-sauce-labs-backpack"]' },
    bikeLight: { name: 'Sauce Labs Bike Light', price: '$9.99', selector: '[data-test="add-to-cart-sauce-labs-bike-light"]' },
    boltTShirt: { name: 'Sauce Labs Bolt T-Shirt', price: '$15.99', selector: '[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]' },
    fleece: { name: 'Sauce Labs Fleece Jacket', price: '$49.99', selector: '[data-test="add-to-cart-sauce-labs-fleece-jacket"]' },
    onesie: { name: 'Sauce Labs Onesie', price: '$7.99', selector: '[data-test="add-to-cart-sauce-labs-onesie"]' },
    tshirt: { name: 'Test.allTheThings() T-Shirt (Red)', price: '$15.99', selector: '[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]' }
  },
  checkoutData: {
    validFirstName: 'John',
    validLastName: 'Smith',
    validPostalCode: '12345',
    specialCharsFirstName: 'Mary-Anne',
    specialCharsLastName: "O'Brien",
    longString: 'A'.repeat(100)
  },
  taxRate: 0.08
};

export async function login(page: Page, username: string = TEST_DATA.credentials.username, password: string = TEST_DATA.credentials.password) {
  await page.goto(`${TEST_DATA.baseUrl}/`);
  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="password"]').fill(password);
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL(/.*inventory/);
}

export async function addItemToCart(page: Page, productSelector: string) {
  await page.locator(productSelector).click();
}

export async function addMultipleItemsToCart(page: Page, productSelectors: string[]) {
  for (const selector of productSelectors) {
    await addItemToCart(page, selector);
  }
}

export async function navigateToCart(page: Page) {
  await page.goto(`${TEST_DATA.baseUrl}/cart.html`);
}

export async function getCartItemCount(page: Page): Promise<number> {
  const badge = page.locator('[data-test="shopping-cart-badge"]');
  const count = await badge.textContent();
  return parseInt(count || '0', 10);
}

export async function removeItemFromCart(page: Page, itemIndex: number = 0) {
  const removeButtons = page.locator('[data-test*="remove-"]');
  await removeButtons.nth(itemIndex).click();
}

export async function getCartItems(page: Page) {
  const items = page.locator('[data-test*="cart-item-container"]');
  const itemCount = await items.count();
  const cartItems = [];

  for (let i = 0; i < itemCount; i++) {
    const item = items.nth(i);
    const name = await item.locator('[data-test*="inventory-item-name"]').textContent();
    const price = await item.locator('.inventory_item_price').textContent();
    const qty = await item.locator('.cart_quantity').textContent();

    cartItems.push({
      name: name?.trim(),
      price: price?.trim(),
      quantity: parseInt(qty || '1', 10)
    });
  }

  return cartItems;
}

export async function fillCheckoutForm(page: Page, firstName: string, lastName: string, postalCode: string) {
  await page.locator('[data-test="firstName"]').fill(firstName);
  await page.locator('[data-test="lastName"]').fill(lastName);
  await page.locator('[data-test="postalCode"]').fill(postalCode);
}

export async function submitCheckoutForm(page: Page) {
  await page.locator('[data-test="continue"]').click();
}

export async function getFormErrorMessage(page: Page): Promise<string> {
  const errorElement = page.locator('[data-test="error"]');
  if (await errorElement.isVisible()) {
    return await errorElement.textContent() || '';
  }
  return '';
}

export async function continueShopping(page: Page) {
  await page.locator('[data-test="continue-shopping"]').click();
  await expect(page).toHaveURL(/.*inventory/);
}

export async function proceedToCheckoutFromCart(page: Page) {
  await page.locator('[data-test="checkout"]').click();
  await expect(page).toHaveURL(/.*checkout-step-one/);
}

export async function proceedToOrderOverview(page: Page) {
  await page.locator('[data-test="continue"]').click();
  await expect(page).toHaveURL(/.*checkout-step-two/);
}

export async function completeOrder(page: Page) {
  await page.locator('[data-test="finish"]').click();
  await expect(page).toHaveURL(/.*checkout-complete/);
}

export async function getOrderTotal(page: Page): Promise<string> {
  const totalLocator = page.locator('[data-test="total-label"]');
  const text = await totalLocator.textContent();
  return text?.match(/\$[\d.]+/)?.[0] || '';
}

export async function getOrderSubtotal(page: Page): Promise<string> {
  const subtotalLocator = page.locator('[data-test="subtotal-label"]');
  const text = await subtotalLocator.textContent();
  return text?.match(/\$[\d.]+/)?.[0] || '';
}

export async function getOrderTax(page: Page): Promise<string> {
  const taxLocator = page.locator('[data-test="tax-label"]');
  const text = await taxLocator.textContent();
  return text?.match(/\$[\d.]+/)?.[0] || '';
}

export function parsePrice(priceString: string): number {
  return parseFloat(priceString.replace('$', ''));
}

export async function setupCheckoutFlow(page: Page, productSelectors: string[]) {
  await login(page);
  await addMultipleItemsToCart(page, productSelectors);
  await navigateToCart(page);
}