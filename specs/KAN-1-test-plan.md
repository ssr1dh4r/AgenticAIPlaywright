# KAN-1: SauceDemo CheckOut Validation - Comprehensive Test Plan

**Jira Ticket**: KAN-1  
**Title**: SauceDemo CheckOut validation  
**Application URL**: https://www.saucedemo.com  
**Test Credentials**: 
- Username: `standard_user`
- Password: `secret_sauce`

**Created**: April 11, 2026  
**Framework**: Playwright  
**Language**: TypeScript/JavaScript

---

## Test Plan Overview

This comprehensive test plan covers all acceptance criteria for the SauceDemo CheckOut flow validation. The plan includes 30+ test scenarios organized by acceptance criteria, covering happy paths, negative scenarios, edge cases, and error handling.

---

## Acceptance Criteria Summary

| AC ID | Title | Test Cases |
|-------|-------|-----------|
| AC1 | Cart Review | 6 |
| AC2 | Checkout Information Entry | 8 |
| AC3 | Order Overview | 7 |
| AC4 | Order Completion | 5 |
| AC5 | Error Handling | 8 |
| **TOTAL** | | **34** |

---

## AC1: Cart Review - Test Cases

### TC-AC1-001: Verify Cart Page Displays All Added Items
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC1-001 |
| **Title** | Cart page displays all previously added items |
| **Description** | Verify that when a user navigates to cart, all items added to cart from inventory are displayed |
| **Preconditions** | User is logged in; User has added 3+ items to cart |
| **Steps** | 1. Login with standard_user/secret_sauce<br>2. Add 3 items to cart from inventory<br>3. Navigate to cart page<br>4. Verify all 3 items are displayed in cart |
| **Expected Result** | All added items display in cart with correct names and quantities |
| **Test Data** | Products: Backpack ($29.99), Bike Light ($9.99), Bolt T-Shirt ($15.99) |

### TC-AC1-002: Verify Cart Item Prices Display Correctly
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC1-002 |
| **Title** | Cart displays correct prices for each item |
| **Description** | Verify that item prices in cart match the prices shown in inventory |
| **Preconditions** | User is logged in; Items added to cart |
| **Steps** | 1. Login and add items to cart<br>2. Navigate to cart<br>3. Compare prices displayed in cart with prices from inventory<br>4. Verify calculation accuracy |
| **Expected Result** | All item prices match inventory prices; Total calculation is accurate |
| **Test Data** | Use TEST_DATA from helpers with known prices |

### TC-AC1-003: Verify Remove Item Functionality
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC1-003 |
| **Title** | User can remove items from cart |
| **Description** | Verify that clicking remove button on a cart item removes it successfully |
| **Preconditions** | User is logged in; Cart contains 3 items |
| **Steps** | 1. Add 3 items to cart<br>2. Click remove button on first item<br>3. Verify item is removed<br>4. Verify quantity updates correctly |
| **Expected Result** | Item removed from cart; Cart quantity updates; Other items remain unchanged |

### TC-AC1-004: Verify Continue Shopping Button Navigation
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC1-004 |
| **Title** | Continue Shopping button returns to inventory |
| **Description** | Verify Continue Shopping button navigates back to products page |
| **Preconditions** | User on cart page with items |
| **Steps** | 1. Navigate to cart page<br>2. Click 'Continue Shopping' button<br>3. Verify URL changes to inventory page |
| **Expected Result** | User navigated to inventory/products page successfully |

### TC-AC1-005: Verify Checkout Button Navigation
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC1-005 |
| **Title** | Checkout button navigates to checkout information page |
| **Description** | Verify Checkout button on cart page proceeds to checkout |
| **Preconditions** | Cart has items; User on cart page |
| **Steps** | 1. Navigate to cart with items<br>2. Click 'Checkout' button<br>3. Verify page navigates to checkout page |
| **Expected Result** | User directed to checkout information form page |

### TC-AC1-006: Verify Cart Persists After Page Refresh
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC1-006 |
| **Title** | Cart contents persist after page refresh |
| **Description** | Verify cart items are retained after browser page refresh |
| **Preconditions** | Cart contains 3+ items |
| **Steps** | 1. Add items to cart<br>2. Refresh the page<br>3. Navigate to cart<br>4. Verify all items still present |
| **Expected Result** | All cart items retained after refresh; No data loss |

---

## AC2: Checkout Information Entry - Test Cases

### TC-AC2-001: Verify Checkout Information Form Fields Display
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC2-001 |
| **Title** | Checkout form displays all required fields |
| **Description** | Verify checkout information page displays First Name, Last Name, and Postal Code fields |
| **Preconditions** | User navigated from cart to checkout |
| **Steps** | 1. Click Checkout from cart<br>2. Verify form loads<br>3. Verify all three form fields are visible |
| **Expected Result** | Form fields visible: First Name, Last Name, Postal Code |

### TC-AC2-002: Verify First Name Required Validation
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC2-002 |
| **Title** | First name field is required |
| **Description** | Verify error message when First Name field left empty |
| **Preconditions** | On checkout information page |
| **Steps** | 1. Leave First Name empty<br>2. Click Continue<br>3. Verify error message displays |
| **Expected Result** | Error message: "First Name is required" or similar |

### TC-AC2-003: Verify Last Name Required Validation
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC2-003 |
| **Title** | Last name field is required |
| **Description** | Verify error message when Last Name field left empty |
| **Preconditions** | On checkout information page |
| **Steps** | 1. Leave Last Name empty<br>2. Click Continue<br>3. Verify error message displays |
| **Expected Result** | Error message: "Last Name is required" or similar |

### TC-AC2-004: Verify Postal Code Required Validation
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC2-004 |
| **Title** | Postal code field is required |
| **Description** | Verify error message when Postal Code field left empty |
| **Preconditions** | On checkout information page |
| **Steps** | 1. Leave Postal Code empty<br>2. Click Continue<br>3. Verify error message displays |
| **Expected Result** | Error message: "Postal Code is required" or similar |

### TC-AC2-005: Verify All Fields Empty Validation
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC2-005 |
| **Title** | All empty fields show validation errors |
| **Description** | Verify validation when all three fields left empty |
| **Preconditions** | On checkout information page |
| **Steps** | 1. Leave all fields empty<br>2. Click Continue<br>3. Verify error messages for all fields |
| **Expected Result** | Error messages displayed for each required field |

### TC-AC2-006: Verify Cancel Button Returns to Cart
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC2-006 |
| **Title** | Cancel button returns to cart |
| **Description** | Verify Cancel button navigates back to cart page |
| **Preconditions** | On checkout information page |
| **Steps** | 1. Fill in some form data<br>2. Click Cancel button<br>3. Verify URL/page changes to cart |
| **Expected Result** | User returned to cart page; Form data not saved |

### TC-AC2-007: Verify Postal Code Field Accepts Numeric Input
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC2-007 |
| **Title** | Postal code accepts numeric values |
| **Description** | Verify postal code field accepts standard numeric postal codes |
| **Preconditions** | On checkout information page |
| **Steps** | 1. Enter First Name: John<br>2. Enter Last Name: Doe<br>3. Enter Postal Code: 12345<br>4. Click Continue |
| **Expected Result** | Form accepted; Proceeded to next page |

### TC-AC2-008: Verify Form Accepts Special Characters in Names
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC2-008 |
| **Title** | Names with special characters accepted |
| **Description** | Verify first and last names with hyphens/apostrophes are accepted |
| **Preconditions** | On checkout information page |
| **Steps** | 1. Enter First Name: Jean-Pierre<br>2. Enter Last Name: O'Connor<br>3. Enter Postal Code: 12345<br>4. Click Continue |
| **Expected Result** | Form accepted; Special characters in names allowed |

---

## AC3: Order Overview - Test Cases

### TC-AC3-001: Verify Order Overview Page Displays
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC3-001 |
| **Title** | Order overview page loads after checkout info |
| **Description** | Verify checkout overview page displays after info entry |
| **Preconditions** | Successfully entered checkout information |
| **Steps** | 1. Complete checkout info entry<br>2. Click Continue<br>3. Verify overview page loads |
| **Expected Result** | Order overview page displayed with all order details |

### TC-AC3-002: Verify All Cart Items Display in Overview
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC3-002 |
| **Title** | All ordered items listed in overview |
| **Description** | Verify all items from cart are shown in order overview |
| **Preconditions** | 3 items in cart; On overview page |
| **Steps** | 1. Proceed to overview with 3 items<br>2. Verify all 3 items listed<br>3. Verify item names correct |
| **Expected Result** | All 3 cart items displayed in overview list |

### TC-AC3-003: Verify Item Prices Display in Overview
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC3-003 |
| **Title** | Item prices shown in order overview |
| **Description** | Verify each item shows correct price in overview |
| **Preconditions** | Items listed in overview |
| **Steps** | 1. Review item prices in overview<br>2. Compare with original prices |
| **Expected Result** | Prices match original item prices |

### TC-AC3-004: Verify Subtotal Calculation
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC3-004 |
| **Title** | Subtotal calculated correctly |
| **Description** | Verify subtotal is sum of all item prices |
| **Preconditions** | Items with known prices in overview |
| **Steps** | 1. Note all item prices<br>2. Verify subtotal<br>3. Manually calculate sum<br>4. Compare |
| **Expected Result** | Subtotal = sum of all item prices |

### TC-AC3-005: Verify Tax Calculation (8%)
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC3-005 |
| **Title** | Tax calculated at 8% rate |
| **Description** | Verify tax is calculated as 8% of subtotal |
| **Preconditions** | Subtotal known |
| **Steps** | 1. Note subtotal amount<br>2. Calculate 8% of subtotal<br>3. Compare with displayed tax |
| **Expected Result** | Tax = Subtotal × 0.08 |

### TC-AC3-006: Verify Total Calculation
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC3-006 |
| **Title** | Total calculated correctly |
| **Description** | Verify total = subtotal + tax |
| **Preconditions** | Subtotal and tax calculated |
| **Steps** | 1. Note subtotal<br>2. Note tax<br>3. Verify total<br>4. Calculate: subtotal + tax |
| **Expected Result** | Total = Subtotal + Tax |

### TC-AC3-007: Verify Cancel and Finish Buttons Present
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC3-007 |
| **Title** | Action buttons displayed on overview |
| **Description** | Verify Cancel and Finish buttons are visible |
| **Preconditions** | On order overview page |
| **Steps** | 1. Look for Cancel button<br>2. Look for Finish button<br>3. Verify both clickable |
| **Expected Result** | Both Cancel and Finish buttons visible and enabled |

---

## AC4: Order Completion - Test Cases

### TC-AC4-001: Verify Order Completion Page Displays
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC4-001 |
| **Title** | Order completion thank you page displays |
| **Description** | Verify thank you/confirmation page after clicking Finish |
| **Preconditions** | On order overview; Ready to complete |
| **Steps** | 1. Click Finish button<br>2. Wait for page load<br>3. Verify completion page |
| **Expected Result** | Completion page (checkout-complete.html) displayed |

### TC-AC4-002: Verify Order Confirmation Message
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC4-002 |
| **Title** | Success message displays on completion |
| **Description** | Verify "Thank you for your order!" or similar message |
| **Preconditions** | On completion page |
| **Steps** | 1. Look for confirmation message<br>2. Verify message contains success text |
| **Expected Result** | Success message visible; Contains "Thank You" or "Order Complete" |

### TC-AC4-003: Verify Back Home Button Present
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC4-003 |
| **Title** | Back Home button displayed |
| **Description** | Verify "Back Home" button is available on completion page |
| **Preconditions** | On completion page |
| **Steps** | 1. Look for Back Home button<br>2. Verify button is clickable |
| **Expected Result** | Back Home button visible and enabled |

### TC-AC4-004: Verify Back Home Button Navigation
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC4-004 |
| **Title** | Back Home button returns to inventory |
| **Description** | Verify clicking Back Home returns to products page |
| **Preconditions** | On completion page |
| **Steps** | 1. Click Back Home button<br>2. Verify redirect<br>3. Verify URL/page |
| **Expected Result** | User navigated to inventory/products page |

### TC-AC4-005: Verify Cart Cleared After Order
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC4-005 |
| **Title** | Cart is empty after successful order |
| **Description** | Verify cart is cleared after completing checkout |
| **Preconditions** | Just completed order |
| **Steps** | 1. Complete order<br>2. Click Back Home<br>3. Add one test item<br>4. Go to cart<br>5. Verify only new item there |
| **Expected Result** | Cart is empty post-order; Only new item appears when added |

---

## AC5: Error Handling - Test Cases

### TC-AC5-001: Verify Special Characters Error Handling
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC5-001 |
| **Title** | Form handles special characters properly |
| **Description** | Verify special characters don't cause errors |
| **Preconditions** | On checkout info page |
| **Steps** | 1. Enter: "@#$%^&*()"<br>2. Try to submit<br>3. Verify behavior (accept or error) |
| **Expected Result** | Either accepted or proper error message |

### TC-AC5-002: Verify Empty Field Error Message
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC5-002 |
| **Title** | Clear error message for empty fields |
| **Description** | Verify error message clearly indicates which field is required |
| **Preconditions** | On checkout info page |
| **Steps** | 1. Leave First Name empty<br>2. Fill other fields<br>3. Submit<br>4. Check error message |
| **Expected Result** | Error message clearly identifies First Name field |

### TC-AC5-003: Verify Form State Persists After Error
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC5-003 |
| **Title** | Form retains data after validation error |
| **Description** | Verify filled form fields retain values after error |
| **Preconditions** | Submit form with one empty field |
| **Steps** | 1. Fill First Name: John<br>2. Leave Last Name empty<br>3. Submit<br>4. Verify First Name still shows "John" |
| **Expected Result** | Filled fields retain values; Only error field empty |

### TC-AC5-004: Verify Error Message Dismissal
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC5-004 |
| **Title** | Error message cleared when fixed |
| **Description** | Verify error clears when user fixes the field |
| **Preconditions** | Form showing validation error |
| **Steps** | 1. Get validation error<br>2. Fill the empty field<br>3. Verify error disappears<br>4. Click Submit |
| **Expected Result** | Error dismissed; Form proceeds successfully |

### TC-AC5-005: Verify Long Input Handling
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC5-005 |
| **Title** | Form handles long input strings |
| **Description** | Verify form accepts or properly handles very long names |
| **Preconditions** | On checkout info page |
| **Steps** | 1. Enter 100+ character name<br>2. Submit form<br>3. Verify behavior |
| **Expected Result** | Form either accepts or shows max length error |

### TC-AC5-006: Verify Whitespace Handling
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC5-006 |
| **Title** | Whitespace in fields handled correctly |
| **Description** | Verify leading/trailing spaces handled properly |
| **Preconditions** | On checkout info page |
| **Steps** | 1. Enter "  John  " (spaces)<br>2. Submit<br>3. Verify trim behavior |
| **Expected Result** | Either accepted or trimmed correctly |

### TC-AC5-007: Verify Numeric Only Field (Postal Code)
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC5-007 |
| **Title** | Postal code rejects letters |
| **Description** | Verify postal code field rejects alphabetic characters |
| **Preconditions** | On checkout info page |
| **Steps** | 1. Try entering "ABC123" in postal code<br>2. Submit or tab out<br>3. Verify rejection or error |
| **Expected Result** | Error or field restriction on letters |

### TC-AC5-008: Verify Navigation Back Cancels Checkout
| Field | Value |
|-------|-------|
| **Test ID** | KAN-1-AC5-008 |
| **Title** | Browser back button behavior during checkout |
| **Description** | Verify pressing Continue Shopping cancels checkout safely |
| **Preconditions** | In middle of checkout (any page) |
| **Steps** | 1. On any checkout page<br>2. Click Continue Shopping<br>3. Verify safe cancel<br>4. Go back to cart |
| **Expected Result** | Checkout cancelled safely; Can restart from cart |

---

## Test Data Requirements

### Products Available
- Sauce Labs Backpack - $29.99
- Sauce Labs Bike Light - $9.99
- Sauce Labs Bolt T-Shirt - $15.99
- Sauce Labs Fleece Jacket - $49.99
- Sauce Labs Onesie - $7.99
- Test.allTheThings() T-Shirt (Red) - $15.99

### Checkout Form Data
- First Name: John, Jean-Pierre, O'Brien
- Last Name: Doe, Sullivan, O'Connor
- Postal Code: 12345, 90210, 54321

### Invalid Data for Error Testing
- Empty values: ""
- Long strings: 100+ characters
- Special characters: @#$%^&*()
- Unicode: 中文, العربية

---

## Browser/Platform Coverage

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari/WebKit
- ✅ Mobile (responsive)

---

## Environment Setup

**Base URL**: https://www.saucedemo.com  
**Test User**: standard_user / secret_sauce  
**Framework**: Playwright  
**Language**: TypeScript/JavaScript  

---

## Test Execution Guidelines

1. Run tests sequentially to maintain cart state
2. Clear browser cookies between test runs
3. Use headless mode for CI/CD
4. Generate HTML reports for each run
5. Screenshot failures for debugging

---

## Success Criteria

- All 34 test cases execute
- Minimum 95% pass rate expected
- No false positives
- Clear failure messages
- < 50ms average assertion time

---

**Test Plan Created**: April 11, 2026  
**Version**: 1.0  
**Status**: Ready for Automation Script Generation
