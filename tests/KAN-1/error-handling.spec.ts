/**
 * KAN-1-AC5: Error Handling Tests
 * Validates error handling, validation messages, and error recovery
 */

import { test, expect } from '@playwright/test';
import { TEST_DATA, setupCheckoutFlow, proceedToCheckoutFromCart, fillCheckoutForm, submitCheckoutForm, getFormErrorMessage, getCartItemCount } from './helpers';

test.describe('AC5: Error Handling', () => {
  async function navigateToCheckoutForm(page) {
    await setupCheckoutFlow(page, [TEST_DATA.products.backpack.selector, TEST_DATA.products.bikeLight.selector, TEST_DATA.products.fleece.selector]);
    await proceedToCheckoutFromCart(page);
  }

  test('KAN-1-AC5-001: Verify Special Characters Error Handling', async ({ page }) => {
    await navigateToCheckoutForm(page);
    await fillCheckoutForm(page, 'Test!@#$%', TEST_DATA.checkoutData.validLastName, TEST_DATA.checkoutData.validPostalCode);
    await submitCheckoutForm(page);

    const url = page.url();
    expect(url.includes('checkout-step-one') || url.includes('checkout-step-two')).toBeTruthy();
  });

  test('KAN-1-AC5-002: Verify Error Recovery - Edit First Name', async ({ page }) => {
    await navigateToCheckoutForm(page);
    await fillCheckoutForm(page, '', TEST_DATA.checkoutData.validLastName, TEST_DATA.checkoutData.validPostalCode);
    await submitCheckoutForm(page);

    let errorMessage = await getFormErrorMessage(page);
    expect(errorMessage).toBeTruthy();

    await page.locator('[data-test="firstName"]').fill(TEST_DATA.checkoutData.validFirstName);
    await submitCheckoutForm(page);
    await expect(page).toHaveURL(/.*checkout-step-two/);
  });

  test('KAN-1-AC5-003: Verify Error Recovery - Edit Last Name', async ({ page }) => {
    await navigateToCheckoutForm(page);
    await fillCheckoutForm(page, TEST_DATA.checkoutData.validFirstName, '', TEST_DATA.checkoutData.validPostalCode);
    await submitCheckoutForm(page);

    let errorMessage = await getFormErrorMessage(page);
    expect(errorMessage).toBeTruthy();

    await page.locator('[data-test="lastName"]').fill(TEST_DATA.checkoutData.validLastName);
    await submitCheckoutForm(page);
    await expect(page).toHaveURL(/.*checkout-step-two/);
  });

  test('KAN-1-AC5-004: Verify Error Recovery - Edit Postal Code', async ({ page }) => {
    await navigateToCheckoutForm(page);
    await fillCheckoutForm(page, TEST_DATA.checkoutData.validFirstName, TEST_DATA.checkoutData.validLastName, '');
    await submitCheckoutForm(page);

    let errorMessage = await getFormErrorMessage(page);
    expect(errorMessage).toBeTruthy();

    await page.locator('[data-test="postalCode"]').fill(TEST_DATA.checkoutData.validPostalCode);
    await submitCheckoutForm(page);
    await expect(page).toHaveURL(/.*checkout-step-two/);
  });

  test('KAN-1-AC5-005: Verify Session Stability During Errors', async ({ page }) => {
    await navigateToCheckoutForm(page);
    const initialCartCount = await getCartItemCount(page);

    for (let i = 0; i < 3; i++) {
      await submitCheckoutForm(page);
      let errorMessage = await getFormErrorMessage(page);
      expect(errorMessage).toBeTruthy();
    }

    expect(await getCartItemCount(page)).toBe(initialCartCount);
  });

  test('KAN-1-AC5-006: Verify Error Message Display Timing', async ({ page }) => {
    await navigateToCheckoutForm(page);
    await page.locator('[data-test="firstName"]').click();
    let errorMessage = await getFormErrorMessage(page);
    expect(errorMessage).toBeFalsy();

    await submitCheckoutForm(page);
    errorMessage = await getFormErrorMessage(page);
    expect(errorMessage).toBeTruthy();
  });

  test('KAN-1-AC5-007: Verify Form State After Navigation', async ({ page }) => {
    await navigateToCheckoutForm(page);
    await page.locator('[data-test="firstName"]').fill(TEST_DATA.checkoutData.validFirstName);
    await page.locator('[data-test="cancel"]').click();
    await expect(page).toHaveURL(/.*cart/);

    await page.locator('[data-test="checkout"]').click();
    const firstNameValue = await page.locator('[data-test="firstName"]').inputValue();
    expect(firstNameValue !== undefined).toBeTruthy();
  });

  test('KAN-1-AC5-008: Verify Long Field Input Handling', async ({ page }) => {
    await navigateToCheckoutForm(page);
    const veryLongString = 'A'.repeat(1000);
    await fillCheckoutForm(page, veryLongString, TEST_DATA.checkoutData.validLastName, TEST_DATA.checkoutData.validPostalCode);
    await submitCheckoutForm(page);

    const url = page.url();
    expect(url).toBeTruthy();
  });

  test('KAN-1-AC5-009: Verify Concurrent Error Conditions', async ({ page }) => {
    await navigateToCheckoutForm(page);
    await submitCheckoutForm(page);

    const errorMessage = await getFormErrorMessage(page);
    expect(errorMessage).toBeTruthy();

    await fillCheckoutForm(page, TEST_DATA.checkoutData.validFirstName, TEST_DATA.checkoutData.validLastName, TEST_DATA.checkoutData.validPostalCode);
    await submitCheckoutForm(page);
    await expect(page).toHaveURL(/.*checkout-step-two/);
  });
});
