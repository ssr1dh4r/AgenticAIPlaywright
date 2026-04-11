import { test, expect, Page } from '@playwright/test';
import {
  TEST_DATA,
  login,
  addMultipleItemsToCart,
  navigateToCart,
  getCartItemCount,
  removeItemFromCart,
  getCartItems,
  continueShopping,
  proceedToCheckoutFromCart,
  setupCheckoutFlow
} from './helpers';

test.describe('AC1: Cart Review', () => {
  test('KAN-1-AC1-001: Verify Cart Page Displays All Added Items', async ({ page }) => {
    await setupCheckoutFlow(page, [
      TEST_DATA.products.backpack.selector,
      TEST_DATA.products.bikeLight.selector,
      TEST_DATA.products.fleece.selector
    ]);

    const cartItems = await getCartItems(page);
    expect(cartItems.length).toBe(3);

    await expect(page.locator(`text=${TEST_DATA.products.backpack.name}`)).toBeVisible();
    await expect(page.locator(`text=${TEST_DATA.products.bikeLight.name}`)).toBeVisible();
    await expect(page.locator(`text=${TEST_DATA.products.fleece.name}`)).toBeVisible();

    expect(await getCartItemCount(page)).toBe(3);
  });

  test('KAN-1-AC1-002: Verify Cart Item Prices Display Correctly', async ({ page }) => {
    await setupCheckoutFlow(page, [
      TEST_DATA.products.backpack.selector,
      TEST_DATA.products.bikeLight.selector,
      TEST_DATA.products.fleece.selector
    ]);

    const prices = page.locator('.inventory_item_price');
    const priceArray = [];
    
    for (let i = 0; i < 3; i++) {
      const price = await prices.nth(i).textContent();
      priceArray.push(price?.trim());
    }

    expect(priceArray[0]).toBe(TEST_DATA.products.backpack.price);
    expect(priceArray[1]).toBe(TEST_DATA.products.bikeLight.price);
    expect(priceArray[2]).toBe(TEST_DATA.products.fleece.price);
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

    const backpackElement = page.locator(`text=${TEST_DATA.products.backpack.name}`);
    await expect(backpackElement).not.toBeVisible();

    await expect(page.locator(`text=${TEST_DATA.products.bikeLight.name}`)).toBeVisible();
  });

  test('KAN-1-AC1-005: Verify Checkout Button Navigation', async ({ page }) => {
    await setupCheckoutFlow(page, [
      TEST_DATA.products.backpack.selector,
      TEST_DATA.products.fleece.selector
    ]);

    await proceedToCheckoutFromCart(page);
    await expect(page).toHaveURL(/.*checkout-step-one/);
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
  });
});