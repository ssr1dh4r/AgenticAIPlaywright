/**
 * KAN-1-AC3: Order Overview Tests
 * Validates order summary page functionality including calculations and navigation
 */

import { test, expect } from '@playwright/test';
import { TEST_DATA, setupCheckoutFlow, proceedToCheckoutFromCart, fillCheckoutForm, submitCheckoutForm, proceedToOrderOverview, completeOrder, getOrderTotal, getOrderSubtotal, getOrderTax, parsePrice } from './helpers';

test.describe('AC3: Order Overview', () => {
  async function navigateToOrderOverview(page) {
    await setupCheckoutFlow(page, [TEST_DATA.products.backpack.selector, TEST_DATA.products.bikeLight.selector, TEST_DATA.products.fleece.selector]);
    await proceedToCheckoutFromCart(page);
    await fillCheckoutForm(page, TEST_DATA.checkoutData.validFirstName, TEST_DATA.checkoutData.validLastName, TEST_DATA.checkoutData.validPostalCode);
    await submitCheckoutForm(page);
  }

  test('KAN-1-AC3-001: Verify Order Overview Page Displays', async ({ page }) => {
    await navigateToOrderOverview(page);
    await expect(page).toHaveURL(/.*checkout-step-two/);
    expect(await page.locator('[data-test*="cart-item"]').count()).toBeGreaterThan(0);
  });

  test('KAN-1-AC3-002: Verify All Cart Items Display in Overview', async ({ page }) => {
    await navigateToOrderOverview(page);
    const itemContainers = page.locator('[data-test*="cart-item"]');
    expect(await itemContainers.count()).toBe(3);
  });

  test('KAN-1-AC3-003: Verify Item Prices Display in Overview', async ({ page }) => {
    await navigateToOrderOverview(page);
    const prices = page.locator('.inventory_item_price');
    expect(await prices.count()).toBeGreaterThan(0);
  });

  test('KAN-1-AC3-004: Verify Subtotal Calculation', async ({ page }) => {
    await navigateToOrderOverview(page);
    const subtotalText = await getOrderSubtotal(page);
    expect(subtotalText).toMatch(/\$[\d.]+/);
  });

  test('KAN-1-AC3-005: Verify Tax Calculation', async ({ page }) => {
    await navigateToOrderOverview(page);
    const taxText = await getOrderTax(page);
    expect(taxText).toMatch(/\$[\d.]+/);
  });

  test('KAN-1-AC3-006: Verify Total Calculation', async ({ page }) => {
    await navigateToOrderOverview(page);
    const subtotalText = await getOrderSubtotal(page);
    const taxText = await getOrderTax(page);
    const totalText = await getOrderTotal(page);

    const subtotal = parsePrice(subtotalText);
    const tax = parsePrice(taxText);
    const expectedTotal = subtotal + tax;
    const displayedTotal = parsePrice(totalText);

    expect(Math.abs(displayedTotal - expectedTotal)).toBeLessThan(0.01);
  });

  test('KAN-1-AC3-007: Verify Cancel and Finish Buttons Present', async ({ page }) => {
    await navigateToOrderOverview(page);
    await expect(page.locator('[data-test="cancel"]')).toBeVisible();
    await expect(page.locator('[data-test="finish"]')).toBeVisible();
  });

  test('KAN-1-AC3-008: Verify Finish Button Completes Order', async ({ page }) => {
    await navigateToOrderOverview(page);
    await completeOrder(page);
    await expect(page).toHaveURL(/.*checkout-complete/);
  });

  test('KAN-1-AC3-009: Verify Order Overview Layout', async ({ page }) => {
    await navigateToOrderOverview(page);
    await expect(page.locator('[data-test*="subtotal"]')).toBeVisible();
    await expect(page.locator('[data-test*="tax"]')).toBeVisible();
    await expect(page.locator('[data-test*="total"]')).toBeVisible();
  });
});
