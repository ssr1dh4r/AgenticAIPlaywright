import { test, expect } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage';
import { InventoryPage } from './page-objects/InventoryPage';
import { CartPage } from './page-objects/CartPage';
import { CheckoutInfoPage } from './page-objects/CheckoutInfoPage';
import { CheckoutOverviewPage } from './page-objects/CheckoutOverviewPage';
import { ConfirmationPage } from './page-objects/ConfirmationPage';
import { TEST_USERS, TEST_DATA, PRODUCTS, EXPECTED } from './fixtures/test-data';

/**
 * TC001 & TC002: Happy Path checkout — AC1, AC2, AC3, AC4
 */
test.describe('Happy Path Checkout Flow', () => {
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

  test('TC001: Complete checkout with a single item @smoke @happy-path', async () => {
    // AC1: Add product to cart
    await inventoryPage.addToCart(PRODUCTS.backpack.slug);
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
    expect(await inventoryPage.isRemoveButtonVisible(PRODUCTS.backpack.slug)).toBe(true);

    // Navigate to cart
    await inventoryPage.navigateToCart();
    await cartPage.waitForLoad();

    // AC1: Verify cart contents
    expect(await cartPage.getItemCount()).toBe(1);
    const names = await cartPage.getItemNames();
    expect(names[0]).toBe(PRODUCTS.backpack.name);
    const prices = await cartPage.getItemPrices();
    expect(prices[0]).toBe(`$${PRODUCTS.backpack.price}`);
    expect(await cartPage.getItemQuantity()).toBe('1');
    expect(await cartPage.isCheckoutButtonVisible()).toBe(true);
    expect(await cartPage.isContinueShoppingButtonVisible()).toBe(true);

    // AC2: Proceed to checkout
    await cartPage.proceedToCheckout();
    await checkoutInfoPage.waitForLoad();

    // AC2: Fill checkout information
    await checkoutInfoPage.fillAndContinue(
      TEST_DATA.validUser.firstName,
      TEST_DATA.validUser.lastName,
      TEST_DATA.validUser.postalCode,
    );

    // AC3: Verify order overview
    await checkoutOverviewPage.waitForLoad();
    const overviewItems = await checkoutOverviewPage.getItemNames();
    expect(overviewItems[0]).toBe(PRODUCTS.backpack.name);
    expect(await checkoutOverviewPage.getPaymentInfo()).toBe(EXPECTED.paymentInfo);
    expect(await checkoutOverviewPage.getShippingInfo()).toBe(EXPECTED.shippingInfo);
    expect(await checkoutOverviewPage.getSubtotalText()).toContain(`$${PRODUCTS.backpack.price}`);

    // Verify math: total = subtotal + tax
    const subtotal = await checkoutOverviewPage.getSubtotalAmount();
    const tax = await checkoutOverviewPage.getTaxAmount();
    const total = await checkoutOverviewPage.getTotalAmount();
    expect(total).toBeCloseTo(subtotal + tax, 2);

    // AC4: Complete the order
    await checkoutOverviewPage.clickFinish();
    await confirmationPage.waitForLoad();

    expect(await confirmationPage.getHeaderText()).toBe(EXPECTED.confirmationHeader);
    expect(await confirmationPage.getBodyText()).toBe(EXPECTED.confirmationBody);
    expect(await confirmationPage.isPonyImageVisible()).toBe(true);
    expect(await confirmationPage.isBackHomeButtonVisible()).toBe(true);

    // AC4: Back home — cart is cleared
    await confirmationPage.clickBackHome();
    await inventoryPage.waitForLoad();
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);
    expect(await inventoryPage.isAddToCartButtonVisible(PRODUCTS.backpack.slug)).toBe(true);
  });

  test('TC002: Complete checkout with multiple items — verify price total @happy-path', async () => {
    // AC1: Add 3 products
    await inventoryPage.addToCart(PRODUCTS.backpack.slug);
    await inventoryPage.addToCart(PRODUCTS.bikeLight.slug);
    await inventoryPage.addToCart(PRODUCTS.boltTShirt.slug);
    expect(await inventoryPage.getCartBadgeCount()).toBe(3);

    // Navigate to cart and verify
    await inventoryPage.navigateToCart();
    await cartPage.waitForLoad();
    expect(await cartPage.getItemCount()).toBe(3);

    // Checkout
    await cartPage.proceedToCheckout();
    await checkoutInfoPage.waitForLoad();
    await checkoutInfoPage.fillAndContinue(
      TEST_DATA.alternateUser.firstName,
      TEST_DATA.alternateUser.lastName,
      TEST_DATA.alternateUser.postalCode,
    );

    // AC3: Verify price calculation
    await checkoutOverviewPage.waitForLoad();
    const expectedSubtotal =
      PRODUCTS.backpack.price + PRODUCTS.bikeLight.price + PRODUCTS.boltTShirt.price;
    const subtotal = await checkoutOverviewPage.getSubtotalAmount();
    expect(subtotal).toBeCloseTo(expectedSubtotal, 2);

    const tax = await checkoutOverviewPage.getTaxAmount();
    const total = await checkoutOverviewPage.getTotalAmount();
    expect(total).toBeCloseTo(subtotal + tax, 2);
    expect(tax).toBeGreaterThan(0);

    // AC4: Complete order
    await checkoutOverviewPage.clickFinish();
    await confirmationPage.waitForLoad();
    expect(await confirmationPage.getHeaderText()).toBe(EXPECTED.confirmationHeader);

    await confirmationPage.clickBackHome();
    await inventoryPage.waitForLoad();
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);
  });
});
