import { test, expect } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage';
import { InventoryPage } from './page-objects/InventoryPage';
import { CartPage } from './page-objects/CartPage';
import { TEST_USERS, PRODUCTS } from './fixtures/test-data';

/**
 * TC003–TC005: Cart management scenarios — AC1
 */
test.describe('Cart Management', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    await loginPage.navigate();
    await loginPage.login(TEST_USERS.standard.username, TEST_USERS.standard.password);
    await inventoryPage.waitForLoad();
  });

  test('TC003: Add and remove items from inventory updates cart badge and button', async () => {
    // Add item — badge appears and button changes to Remove
    await inventoryPage.addToCart(PRODUCTS.backpack.slug);
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
    expect(await inventoryPage.isRemoveButtonVisible(PRODUCTS.backpack.slug)).toBe(true);
    expect(await inventoryPage.isAddToCartButtonVisible(PRODUCTS.backpack.slug)).toBe(false);

    // Remove item — badge disappears, button reverts
    await inventoryPage.removeFromCart(PRODUCTS.backpack.slug);
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);
    expect(await inventoryPage.isAddToCartButtonVisible(PRODUCTS.backpack.slug)).toBe(true);
    expect(await inventoryPage.isRemoveButtonVisible(PRODUCTS.backpack.slug)).toBe(false);

    // Add 3 items
    await inventoryPage.addToCart(PRODUCTS.backpack.slug);
    await inventoryPage.addToCart(PRODUCTS.bikeLight.slug);
    await inventoryPage.addToCart(PRODUCTS.boltTShirt.slug);
    expect(await inventoryPage.getCartBadgeCount()).toBe(3);
  });

  test('TC004: Remove an item from the cart page', async () => {
    // Setup: Add 2 items
    await inventoryPage.addToCart(PRODUCTS.backpack.slug);
    await inventoryPage.addToCart(PRODUCTS.bikeLight.slug);
    expect(await inventoryPage.getCartBadgeCount()).toBe(2);

    // Navigate to cart
    await inventoryPage.navigateToCart();
    await cartPage.waitForLoad();
    expect(await cartPage.getItemCount()).toBe(2);

    // Remove Backpack
    await cartPage.removeItem(PRODUCTS.backpack.slug);

    // Verify only Bike Light remains
    expect(await cartPage.getItemCount()).toBe(1);
    const names = await cartPage.getItemNames();
    expect(names).not.toContain(PRODUCTS.backpack.name);
    expect(names).toContain(PRODUCTS.bikeLight.name);
  });

  test('TC005: Continue Shopping from cart preserves cart state', async () => {
    // Add item
    await inventoryPage.addToCart(PRODUCTS.backpack.slug);
    await inventoryPage.navigateToCart();
    await cartPage.waitForLoad();
    expect(await cartPage.getItemCount()).toBe(1);

    // Click Continue Shopping
    await cartPage.continueShopping();
    await inventoryPage.waitForLoad();

    // Cart badge still shows 1
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
    // Backpack shows "Remove" still
    expect(await inventoryPage.isRemoveButtonVisible(PRODUCTS.backpack.slug)).toBe(true);
  });
});
