import { test, expect } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage';
import { InventoryPage } from './page-objects/InventoryPage';
import { CartPage } from './page-objects/CartPage';
import { CheckoutInfoPage } from './page-objects/CheckoutInfoPage';
import { CheckoutOverviewPage } from './page-objects/CheckoutOverviewPage';
import { ConfirmationPage } from './page-objects/ConfirmationPage';
import { TEST_USERS, TEST_DATA, PRODUCTS, EXPECTED } from './fixtures/test-data';

/**
 * TC012–TC015: Edge cases and boundary conditions
 */
test.describe('Edge Cases and Boundary Conditions', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutInfoPage: CheckoutInfoPage;
  let checkoutOverviewPage: CheckoutOverviewPage;
  let confirmationPage: ConfirmationPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutInfoPage = new CheckoutInfoPage(page);
    checkoutOverviewPage = new CheckoutOverviewPage(page);
    confirmationPage = new ConfirmationPage(page);

    await loginPage.navigate();
    await loginPage.login(TEST_USERS.standard.username, TEST_USERS.standard.password);
    await inventoryPage.waitForLoad();
  });

  test('TC012: Empty cart shows no items and no cart badge @edge-cases', async () => {
    // No items added
    await inventoryPage.navigateToCart();
    await cartPage.waitForLoad();

    expect(await cartPage.getItemCount()).toBe(0);
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);
  });

  test('TC013: Price calculation accuracy with two products @edge-cases @AC3', async () => {
    // Add Onesie ($7.99) + Fleece Jacket ($49.99) = $57.98 subtotal
    await inventoryPage.addToCart(PRODUCTS.onesie.slug);
    await inventoryPage.addToCart(PRODUCTS.fleeceJacket.slug);
    expect(await inventoryPage.getCartBadgeCount()).toBe(2);

    await inventoryPage.navigateToCart();
    await cartPage.waitForLoad();
    await cartPage.proceedToCheckout();
    await checkoutInfoPage.waitForLoad();
    await checkoutInfoPage.fillAndContinue(
      TEST_DATA.validUser.firstName,
      TEST_DATA.validUser.lastName,
      TEST_DATA.validUser.postalCode,
    );
    await checkoutOverviewPage.waitForLoad();

    const subtotal = await checkoutOverviewPage.getSubtotalAmount();
    const expectedSubtotal = PRODUCTS.onesie.price + PRODUCTS.fleeceJacket.price;
    expect(subtotal).toBeCloseTo(expectedSubtotal, 2);

    const tax = await checkoutOverviewPage.getTaxAmount();
    const total = await checkoutOverviewPage.getTotalAmount();
    expect(total).toBeCloseTo(subtotal + tax, 2);
    expect(tax).toBeGreaterThan(0);

    // Verify currency formatting in text
    expect(await checkoutOverviewPage.getSubtotalText()).toMatch(/\$\d+\.\d{2}/);
    expect(await checkoutOverviewPage.getTaxText()).toMatch(/\$\d+\.\d{2}/);
    expect(await checkoutOverviewPage.getTotalText()).toMatch(/\$\d+\.\d{2}/);
  });

  test('TC014: Cart retains items when sorting is changed @edge-cases', async () => {
    // Add item before sorting
    await inventoryPage.addToCart(PRODUCTS.onesie.slug);

    // Change sort order
    await inventoryPage.sortBy('Price (high to low)');
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);

    // Add another item after sort change
    await inventoryPage.addToCart(PRODUCTS.fleeceJacket.slug);
    expect(await inventoryPage.getCartBadgeCount()).toBe(2);

    // Verify both in cart
    await inventoryPage.navigateToCart();
    await cartPage.waitForLoad();
    expect(await cartPage.getItemCount()).toBe(2);
    const names = await cartPage.getItemNames();
    expect(names).toContain(PRODUCTS.onesie.name);
    expect(names).toContain(PRODUCTS.fleeceJacket.name);
  });

  test('TC019: Full end-to-end checkout with all 6 products @integration @smoke', async () => {
    const allProducts = [
      PRODUCTS.backpack,
      PRODUCTS.bikeLight,
      PRODUCTS.boltTShirt,
      PRODUCTS.fleeceJacket,
      PRODUCTS.onesie,
      PRODUCTS.tShirtRed,
    ];

    // Add all products
    for (const product of allProducts) {
      await inventoryPage.addToCart(product.slug);
    }
    expect(await inventoryPage.getCartBadgeCount()).toBe(allProducts.length);

    // Cart page
    await inventoryPage.navigateToCart();
    await cartPage.waitForLoad();
    expect(await cartPage.getItemCount()).toBe(allProducts.length);

    // Checkout info
    await cartPage.proceedToCheckout();
    await checkoutInfoPage.waitForLoad();
    await checkoutInfoPage.fillAndContinue(
      TEST_DATA.validUser.firstName,
      TEST_DATA.validUser.lastName,
      TEST_DATA.validUser.postalCode,
    );

    // Overview — verify totals
    await checkoutOverviewPage.waitForLoad();
    const expectedSubtotal = allProducts.reduce((sum, p) => sum + p.price, 0);
    const subtotal = await checkoutOverviewPage.getSubtotalAmount();
    expect(subtotal).toBeCloseTo(expectedSubtotal, 2);

    const tax = await checkoutOverviewPage.getTaxAmount();
    const total = await checkoutOverviewPage.getTotalAmount();
    expect(total).toBeCloseTo(subtotal + tax, 2);

    // Finish
    await checkoutOverviewPage.clickFinish();
    await confirmationPage.waitForLoad();
    expect(await confirmationPage.getHeaderText()).toBe(EXPECTED.confirmationHeader);

    // Back Home — cart cleared
    await confirmationPage.clickBackHome();
    await inventoryPage.waitForLoad();
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);
  });
});
