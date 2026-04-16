/**
 * KAN-1-AC1: Cart Review Tests
 * Validates cart page functionality including item display, prices, navigation, and persistence
 */

import { test, expect } from '@playwright/test';
import { TEST_DATA, setupCheckoutFlow, getCartItems, getCartItemCount, removeItemFromCart, proceedToCheckoutFromCart, continueShopping, navigateToCart } from './helpers';

test.describe('AC1: Cart Review', () => {
  test('KAN-1-AC1-001: Verify Cart Page Displays All Added Items', async ({ page }) => {
    await setupCheckoutFlow(page, [
      TEST_DATA.products.backpack.selector,
      TEST_DATA.products.bikeLight.selector,
      TEST_DATA.products.fleece.selector
    ]);

    const cartItems = await getCartItems(page);
    expect(cartItems.length).toBe(3);
    expect(await getCartItemCount(page)).toBe(3);
  });

  test('KAN-1-AC1-002: Verify Cart Item Prices Display Correctly', async ({ page }) => {
    await setupCheckoutFlow(page, [
      TEST_DATA.products.backpack.selector,
      TEST_DATA.products.bikeLight.selector,
      TEST_DATA.products.fleece.selector
    ]);

    const cartItems = await getCartItems(page);
    expect(cartItems[0].price).toBe(TEST_DATA.products.backpack.price);
    expect(cartItems[1].price).toBe(TEST_DATA.products.bikeLight.price);
    expect(cartItems[2].price).toBe(TEST_DATA.products.fleece.price);
  });

  test('KAN-1-AC1-003: Verify Remove Item Functionality', async ({ page }) => {
    await setupCheckoutFlow(page, [
      TEST_DATA.products.backpack.selector,
      TEST_DATA.products.bikeLight.selector,
      TEST_DATA.products.fleece.selector
    ]);

    expect(await getCartItemCount(page)).toBe(3);
    await removeItemFromCart(page, 0);
    expect(await getCartItemCount(page)).toBe(2);
  });

  test('KAN-1-AC1-004: Verify Continue Shopping Button Navigation', async ({ page }) => {
    await setupCheckoutFlow(page, [
      TEST_DATA.products.backpack.selector,
      TEST_DATA.products.bikeLight.selector
    ]);

    await continueShopping(page);
    await expect(page).toHaveURL(/.*inventory/);
  });

  test('KAN-1-AC1-005: Verify Checkout Button Navigation', async ({ page }) => {
    await setupCheckoutFlow(page, [
      TEST_DATA.products.backpack.selector,
      TEST_DATA.products.fleece.selector
    ]);

    await proceedToCheckoutFromCart(page);
    await expect(page).toHaveURL(/.*checkout-step-one/);
  });

  test('KAN-1-AC1-006: Verify Cart Persists After Page Refresh', async ({ page }) => {
    await setupCheckoutFlow(page, [
      TEST_DATA.products.backpack.selector,
      TEST_DATA.products.bikeLight.selector,
      TEST_DATA.products.fleece.selector
    ]);

    const itemCountBeforeRefresh = await getCartItemCount(page);
    await page.reload();
    expect(await getCartItemCount(page)).toBe(itemCountBeforeRefresh);
  });

  test('KAN-1-AC1-007: Verify Empty Cart Message', async ({ page }) => {
    await navigateToCart(page);
    const cartItems = await getCartItems(page);
    expect(cartItems.length).toBe(0);
  });
});
