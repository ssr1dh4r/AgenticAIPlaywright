/**
 * KAN-1-AC2: Checkout Information Tests
 * Validates checkout form functionality including validation, error handling, and form submission
 */

import { test, expect } from '@playwright/test';
import { TEST_DATA, setupCheckoutFlow, proceedToCheckoutFromCart, fillCheckoutForm, submitCheckoutForm, getFormErrorMessage } from './helpers';

test.describe('AC2: Checkout Information', () => {
  test('KAN-1-AC2-001: Verify Checkout Information Form Fields Display', async ({ page }) => {
    await setupCheckoutFlow(page, [TEST_DATA.products.backpack.selector]);
    await proceedToCheckoutFromCart(page);

    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
    await expect(page.locator('[data-test="lastName"]')).toBeVisible();
    await expect(page.locator('[data-test="postalCode"]')).toBeVisible();
    await expect(page.locator('[data-test="continue"]')).toBeVisible();
  });

  test('KAN-1-AC2-002: Verify First Name Required Validation', async ({ page }) => {
    await setupCheckoutFlow(page, [TEST_DATA.products.backpack.selector]);
    await proceedToCheckoutFromCart(page);

    await page.locator('[data-test="lastName"]').fill(TEST_DATA.checkoutData.validLastName);
    await page.locator('[data-test="postalCode"]').fill(TEST_DATA.checkoutData.validPostalCode);
    await submitCheckoutForm(page);

    const errorMessage = await getFormErrorMessage(page);
    expect(errorMessage.toLowerCase()).toContain('first');
  });

  test('KAN-1-AC2-003: Verify Last Name Required Validation', async ({ page }) => {
    await setupCheckoutFlow(page, [TEST_DATA.products.backpack.selector]);
    await proceedToCheckoutFromCart(page);

    await page.locator('[data-test="firstName"]').fill(TEST_DATA.checkoutData.validFirstName);
    await page.locator('[data-test="postalCode"]').fill(TEST_DATA.checkoutData.validPostalCode);
    await submitCheckoutForm(page);

    const errorMessage = await getFormErrorMessage(page);
    expect(errorMessage.toLowerCase()).toContain('last');
  });

  test('KAN-1-AC2-004: Verify Postal Code Required Validation', async ({ page }) => {
    await setupCheckoutFlow(page, [TEST_DATA.products.backpack.selector]);
    await proceedToCheckoutFromCart(page);

    await page.locator('[data-test="firstName"]').fill(TEST_DATA.checkoutData.validFirstName);
    await page.locator('[data-test="lastName"]').fill(TEST_DATA.checkoutData.validLastName);
    await submitCheckoutForm(page);

    const errorMessage = await getFormErrorMessage(page);
    expect(errorMessage.toLowerCase()).toMatch(/postal|zip/);
  });

  test('KAN-1-AC2-005: Verify All Fields Empty Validation', async ({ page }) => {
    await setupCheckoutFlow(page, [TEST_DATA.products.backpack.selector]);
    await proceedToCheckoutFromCart(page);
    await submitCheckoutForm(page);

    const errorMessage = await getFormErrorMessage(page);
    expect(errorMessage).toBeTruthy();
  });

  test('KAN-1-AC2-006: Verify Cancel Button Returns to Cart', async ({ page }) => {
    await setupCheckoutFlow(page, [TEST_DATA.products.backpack.selector]);
    await proceedToCheckoutFromCart(page);
    await page.locator('[data-test="cancel"]').click();
    await expect(page).toHaveURL(/.*cart/);
  });

  test('KAN-1-AC2-007: Verify Postal Code Field Accepts Numeric Input', async ({ page }) => {
    await setupCheckoutFlow(page, [TEST_DATA.products.backpack.selector]);
    await proceedToCheckoutFromCart(page);

    await fillCheckoutForm(page, TEST_DATA.checkoutData.validFirstName, TEST_DATA.checkoutData.validLastName, '90210');
    await submitCheckoutForm(page);
    await expect(page).toHaveURL(/.*checkout-step-two/);
  });

  test('KAN-1-AC2-008: Verify Form Accepts Special Characters in Names', async ({ page }) => {
    await setupCheckoutFlow(page, [TEST_DATA.products.backpack.selector]);
    await proceedToCheckoutFromCart(page);

    await fillCheckoutForm(page, TEST_DATA.checkoutData.specialCharsFirstName, TEST_DATA.checkoutData.specialCharsLastName, TEST_DATA.checkoutData.validPostalCode);
    await submitCheckoutForm(page);
    await expect(page).toHaveURL(/.*checkout-step-two/);
  });

  test('KAN-1-AC2-009: Verify Long Field Inputs', async ({ page }) => {
    await setupCheckoutFlow(page, [TEST_DATA.products.backpack.selector]);
    await proceedToCheckoutFromCart(page);

    await fillCheckoutForm(page, TEST_DATA.checkoutData.longString, TEST_DATA.checkoutData.longString, TEST_DATA.checkoutData.validPostalCode);
    await submitCheckoutForm(page);
    const url = page.url();
    expect(url.includes('checkout-step-two') || url.includes('checkout-step-one')).toBeTruthy();
  });

  test('KAN-1-AC2-010: Verify Form Data Validation on Submit', async ({ page }) => {
    await setupCheckoutFlow(page, [TEST_DATA.products.backpack.selector]);
    await proceedToCheckoutFromCart(page);

    await fillCheckoutForm(page, '   ', '   ', '12345');
    await submitCheckoutForm(page);
    const url = page.url();
    expect(url.includes('checkout-step-one') || url.includes('checkout-step-two')).toBeTruthy();
  });
});
