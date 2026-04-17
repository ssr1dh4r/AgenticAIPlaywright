import { test, expect } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage';
import { InventoryPage } from './page-objects/InventoryPage';
import { CartPage } from './page-objects/CartPage';
import { CheckoutInfoPage } from './page-objects/CheckoutInfoPage';
import { CheckoutOverviewPage } from './page-objects/CheckoutOverviewPage';
import { TEST_USERS, TEST_DATA, PRODUCTS, EXPECTED } from './fixtures/test-data';

/**
 * TC006–TC008: Form validation and error handling — AC2, AC5
 */
test.describe('Checkout Form Validation', () => {
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

    // Login, add product, go to checkout info
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.standard.username, TEST_USERS.standard.password);
    await inventoryPage.waitForLoad();
    await inventoryPage.addToCart(PRODUCTS.backpack.slug);
    await inventoryPage.navigateToCart();
    await cartPage.waitForLoad();
    await cartPage.proceedToCheckout();
    await checkoutInfoPage.waitForLoad();
  });

  test('TC006a: Submit empty form — first name required error @validation @negative', async () => {
    await checkoutInfoPage.clickContinue();
    expect(await checkoutInfoPage.getErrorMessage()).toBe(EXPECTED.errors.firstNameRequired);
    await checkoutInfoPage.waitForLoad(); // should remain on same page
  });

  test('TC006b: Submit with only first name — last name required error @validation @negative', async () => {
    await checkoutInfoPage.fillForm(TEST_DATA.validUser.firstName, '', '');
    await checkoutInfoPage.clickContinue();
    expect(await checkoutInfoPage.getErrorMessage()).toBe(EXPECTED.errors.lastNameRequired);
  });

  test('TC006c: Submit with first and last name — postal code required error @validation @negative', async () => {
    await checkoutInfoPage.fillForm(
      TEST_DATA.validUser.firstName,
      TEST_DATA.validUser.lastName,
      '',
    );
    await checkoutInfoPage.clickContinue();
    expect(await checkoutInfoPage.getErrorMessage()).toBe(EXPECTED.errors.postalCodeRequired);
  });

  test('TC008: Error message can be dismissed @validation', async () => {
    // Trigger error
    await checkoutInfoPage.clickContinue();
    expect(await checkoutInfoPage.isErrorVisible()).toBe(true);

    // Dismiss it
    await checkoutInfoPage.dismissError();
    expect(await checkoutInfoPage.isErrorVisible()).toBe(false);

    // Fill valid data and continue
    await checkoutInfoPage.fillAndContinue(
      TEST_DATA.validUser.firstName,
      TEST_DATA.validUser.lastName,
      TEST_DATA.validUser.postalCode,
    );
    await checkoutOverviewPage.waitForLoad();
  });
});
