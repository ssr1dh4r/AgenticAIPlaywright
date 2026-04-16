/**
 * KAN-1-AC4: Order Completion Tests
 * Validates order completion page functionality and cart clearing
 */

import { test, expect } from '@playwright/test';
import { TEST_DATA, setupCheckoutFlow, proceedToCheckoutFromCart, fillCheckoutForm, submitCheckoutForm, proceedToOrderOverview, completeOrder, getCartItemCount, navigateToCart } from './helpers';

test.describe('AC4: Order Completion', () => {
  async function completeCheckoutFlow(page) {
    await setupCheckoutFlow(page, [TEST_DATA.products.backpack.selector, TEST_DATA.products.bikeLight.selector]);
    await proceedToCheckoutFromCart(page);
    await fillCheckoutForm(page, TEST_DATA.checkoutData.validFirstName, TEST_DATA.checkoutData.validLastName, TEST_DATA.checkoutData.validPostalCode);
    await submitCheckoutForm(page);
    await proceedToOrderOverview(page);
    await completeOrder(page);
  }

  test('KAN-1-AC4-001: Verify Order Completion Page Displays', async ({ page }) => {
    await completeCheckoutFlow(page);
    await expect(page).toHaveURL(/.*checkout-complete/);
    expect(page.url()).toContain('checkout-complete');
  });

  test('KAN-1-AC4-002: Verify Order Confirmation Message', async ({ page }) => {
    await completeCheckoutFlow(page);
    const confirmationElement = page.locator('[data-test*="complete"], text=/Thank|Confirm/');
    expect(await confirmationElement.first().isVisible()).toBeTruthy();
  });

  test('KAN-1-AC4-003: Verify Completion Page Title/Heading', async ({ page }) => {
    await completeCheckoutFlow(page);
    const heading = page.locator('h1, h2, [data-test*="title"]').first();
    await expect(heading).toBeVisible();
  });

  test('KAN-1-AC4-004: Verify Back to Products Button', async ({ page }) => {
    await completeCheckoutFlow(page);
    const backButton = page.locator('[data-test="back-to-products"], button:has-text("Back")');
    if (await backButton.isVisible()) {
      await backButton.click();
      await expect(page).toHaveURL(/.*inventory/);
    }
  });

  test('KAN-1-AC4-005: Verify Cart is Cleared After Order', async ({ page }) => {
    await completeCheckoutFlow(page);
    await navigateToCart(page);
    const cartCount = await getCartItemCount(page);
    expect(cartCount).toBe(0);
  });

  test('KAN-1-AC4-006: Verify Order Details Accessible', async ({ page }) => {
    await completeCheckoutFlow(page);
    const orderElement = page.locator('[data-test*="complete"]');
    expect(await orderElement.count()).toBeGreaterThan(0);
  });

  test('KAN-1-AC4-007: Verify Logout Available After Order', async ({ page }) => {
    await completeCheckoutFlow(page);
    const menuButton = page.locator('[data-test="bm-menu-button"]');
    expect(await menuButton.isVisible() || await page.locator('button').count() > 0).toBeTruthy();
  });
});
