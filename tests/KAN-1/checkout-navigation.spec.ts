import { test, expect } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage';
import { InventoryPage } from './page-objects/InventoryPage';
import { CartPage } from './page-objects/CartPage';
import { CheckoutInfoPage } from './page-objects/CheckoutInfoPage';
import { CheckoutOverviewPage } from './page-objects/CheckoutOverviewPage';
import { TEST_USERS, TEST_DATA, PRODUCTS } from './fixtures/test-data';

/**
 * TC009–TC010: Navigation and cancel operations — AC2, AC3
 */
test.describe('Checkout Navigation and Cancel', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutInfoPage: CheckoutInfoPage;
  let checkoutOverviewPage: CheckoutOverviewPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutInfoPage = new CheckoutInfoPage(page);
    checkoutOverviewPage = new CheckoutOverviewPage(page);

    await loginPage.navigate();
    await loginPage.login(TEST_USERS.standard.username, TEST_USERS.standard.password);
    await inventoryPage.waitForLoad();
    await inventoryPage.addToCart(PRODUCTS.backpack.slug);
    await inventoryPage.navigateToCart();
    await cartPage.waitForLoad();
  });

  test('TC009: Cancel from checkout info returns to cart with items preserved @navigation', async () => {
    await cartPage.proceedToCheckout();
    await checkoutInfoPage.waitForLoad();

    await checkoutInfoPage.clickCancel();
    await cartPage.waitForLoad();

    // Items should still be in cart
    expect(await cartPage.getItemCount()).toBe(1);
    const names = await cartPage.getItemNames();
    expect(names).toContain(PRODUCTS.backpack.name);
  });

  test('TC010: Cancel from overview returns to inventory with items preserved @navigation', async () => {
    await cartPage.proceedToCheckout();
    await checkoutInfoPage.waitForLoad();
    await checkoutInfoPage.fillAndContinue(
      TEST_DATA.validUser.firstName,
      TEST_DATA.validUser.lastName,
      TEST_DATA.validUser.postalCode,
    );
    await checkoutOverviewPage.waitForLoad();

    // Cancel from overview
    await checkoutOverviewPage.clickCancel();
    await inventoryPage.waitForLoad();

    // Cart should still have the item (badge still shows)
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
    expect(await inventoryPage.isRemoveButtonVisible(PRODUCTS.backpack.slug)).toBe(true);
  });
});
