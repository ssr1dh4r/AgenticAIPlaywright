# KAN-1 SauceDemo Checkout Validation - Test Plan

## Overview
Comprehensive test plan for validating the complete checkout workflow on SauceDemo e-commerce application, covering cart review, checkout information entry, order overview, order completion, and error handling scenarios.

**Application URL:** https://www.saucedemo.com  
**Test Credentials:** Username: `standard_user` | Password: `secret_sauce`  
**Jira Ticket:** KAN-1

## Test Environment Setup
- Browser: Chromium/Chrome, Firefox, Safari (WebKit)
- Test Framework: Playwright
- Base URL: https://www.saucedemo.com
- Pre-requisites: Valid user credentials, clean session state

---

## Test Suite 1: Happy Path Checkout Flow

### TC001: Complete Checkout Process with Single Item
**Priority:** High  
**Acceptance Criteria:** AC1, AC2, AC3, AC4

**Preconditions:**
- Browser is open
- No existing session/cookies
- Internet connection available

**Test Steps:**
1. Navigate to https://www.saucedemo.com
   - Expected: Login page with username and password fields; title is 'Swag Labs'
2. Enter `standard_user` in `[data-test="username"]` and `secret_sauce` in `[data-test="password"]`, click `[data-test="login-button"]`
   - Expected: Redirected to `/inventory.html`, products displayed
3. Click `[data-test="add-to-cart-sauce-labs-backpack"]`
   - Expected: Cart counter shows '1', button changes to 'Remove'
4. Click `[data-test="shopping-cart-link"]`
   - Expected: Cart page shows "Sauce Labs Backpack", $29.99, qty 1; Continue Shopping and Checkout buttons present
5. Click `[data-test="checkout"]`
   - Expected: Checkout info page `/checkout-step-one.html` with First Name, Last Name, Zip fields
6. Fill `[data-test="firstName"]`=John, `[data-test="lastName"]`=Doe, `[data-test="postalCode"]`=12345; click `[data-test="continue"]`
   - Expected: Redirected to `/checkout-step-two.html`
7. Verify order overview: item summary, payment "SauceCard #31337", shipping "Free Pony Express Delivery!", subtotal/tax/total shown; Cancel and Finish buttons present
8. Click `[data-test="finish"]`
   - Expected: `/checkout-complete.html` with "Thank you for your order!" and Back Home button
9. Click `[data-test="back-to-products"]`
   - Expected: Back to inventory, cart cleared

### TC002: Complete Checkout Process with Multiple Items
**Priority:** High  
**Acceptance Criteria:** AC1, AC3

**Test Steps:**
1. Login and add Sauce Labs Backpack ($29.99), Bike Light ($9.99), Bolt T-Shirt ($15.99)
2. Navigate to cart — verify all 3 items with correct details
3. Complete checkout with valid info
4. On overview verify item total = $55.97, tax applied, total = subtotal + tax
5. Finish and verify confirmation, cart clears on Back Home

---

## Test Suite 2: Cart Management

### TC003: Add and Remove Items from Inventory
**Priority:** Medium | **AC:** AC1

**Steps:**
1. Login; click "Add to cart" → cart counter increases, button → "Remove"
2. Click "Remove" → counter decreases, button → "Add to cart"
3. Add 3 different products → counter = 3

### TC004: Remove Items from Cart Page
**Priority:** Medium

**Steps:**
1. Add multiple items; navigate to cart
2. Click Remove for one item → item removed, counter updated, others remain
3. Remove all → cart empty

### TC005: Continue Shopping Navigation
**Priority:** Medium

**Steps:**
1. Add items to cart; navigate to cart page
2. Click "Continue Shopping" → returns to inventory, cart counter preserved, items still show "Remove"

---

## Test Suite 3: Form Validation and Error Handling

### TC006: Mandatory Field Validation — All Fields Empty
**Priority:** High | **AC:** AC2, AC5

**Steps:**
1. Navigate to checkout info page with items in cart
2. Click "Continue" with all fields empty → error "Error: First Name is required"
3. Fill only First Name, click "Continue" → "Error: Last Name is required"
4. Fill First+Last, leave Zip empty → "Error: Postal Code is required"

### TC007: Invalid Data Validation
**Priority:** Medium | **AC:** AC5

**Steps:**
1. Enter special chars (!@#$%) in First Name field → click Continue → observe validation
2. Enter 500+ chars in fields → application handles gracefully
3. Enter numbers in name fields → observe validation behavior
4. Enter alphabetic value in Postal Code → observe validation

### TC008: Error Message Dismissal
**Priority:** Low

**Steps:**
1. Trigger validation error; click error close button → error disappears, form unchanged
2. Fill required field correctly; click Continue → error clears, form advances

---

## Test Suite 4: Navigation and Cancel Operations

### TC009: Cancel from Checkout Information
**Priority:** Medium | **AC:** AC2

**Steps:**
1. Navigate to checkout info page with items in cart
2. Click "Cancel" → returned to cart page, items preserved

### TC010: Cancel from Checkout Overview
**Priority:** Medium | **AC:** AC3

**Steps:**
1. Navigate to checkout overview
2. Click "Cancel" → returned to inventory, items preserved, no order processed

### TC011: Browser Navigation Behavior
**Priority:** Low

**Steps:**
1. Navigate through checkout steps
2. Use browser back button at each step → previous step loads, cart state maintained
3. Use browser forward → appropriate forward navigation

---

## Test Suite 5: Edge Cases and Boundary Conditions

### TC012: Empty Cart Checkout Attempt
**Priority:** Medium

**Steps:**
1. Login without adding items; navigate to cart → shows empty cart
2. Attempt checkout → application handles empty cart (cannot proceed or shows message)

### TC013: Price Calculation Accuracy
**Priority:** High | **AC:** AC3

**Steps:**
1. Add Sauce Labs Onesie ($7.99) + Fleece Jacket ($49.99) → item total = $57.98
2. On overview: verify tax = correct percentage, total = subtotal + tax, currency formatted correctly

### TC014: Product Sorting and Cart Functionality
**Priority:** Low

**Steps:**
1. Change sort order (A→Z, Z→A, price low→high, high→low)
2. Add items in different sort orders → cart maintains items correctly

### TC015: Session and State Management
**Priority:** Medium

**Steps:**
1. Add items; refresh page → cart state preserved
2. Navigate away and return → session handled appropriately

---

## Test Suite 6: UI Validation and Accessibility

### TC016: Form Field Keyboard Navigation
**Priority:** Low

**Steps:**
1. Use Tab to navigate fields → logical tab order, focus indicators visible
2. Use Enter to submit form → submits appropriately

### TC017: Button State Visual Feedback
**Priority:** Low

**Steps:**
1. Hover over "Add to cart" → visual hover feedback
2. Click "Add to cart" → button immediately changes to "Remove" with styling update, cart counter updates visually

### TC018: Responsive Design
**Priority:** Low

**Steps:**
1. Test checkout flow at mobile (390×844), tablet (768×1024), desktop (1440×900) viewports
2. Forms remain usable, buttons accessible, cart display adapts at each viewport

---

## Selectors Reference

| Element | Selector |
|---|---|
| Username | `[data-test="username"]` |
| Password | `[data-test="password"]` |
| Login button | `[data-test="login-button"]` |
| Cart icon | `[data-test="shopping-cart-link"]` |
| Add to cart (product) | `[data-test="add-to-cart-{product-slug}"]` |
| Remove (product) | `[data-test="remove-{product-slug}"]` |
| Checkout button (cart) | `[data-test="checkout"]` |
| First Name | `[data-test="firstName"]` |
| Last Name | `[data-test="lastName"]` |
| Postal Code | `[data-test="postalCode"]` |
| Continue | `[data-test="continue"]` |
| Finish | `[data-test="finish"]` |
| Back Home | `[data-test="back-to-products"]` |
| Cart badge | `.shopping_cart_badge` |
| Error message | `[data-test="error"]` |

## URL Patterns

| Page | URL |
|---|---|
| Login | `https://www.saucedemo.com/` |
| Inventory | `/inventory.html` |
| Cart | `/cart.html` |
| Checkout Info | `/checkout-step-one.html` |
| Checkout Overview | `/checkout-step-two.html` |
| Order Complete | `/checkout-complete.html` |

## Test Data

### Valid Data
| Field | Values |
|---|---|
| Username | `standard_user` |
| Password | `secret_sauce` |
| First Name | John, Jane, Mike |
| Last Name | Doe, Smith, Brown |
| Postal Code | 12345, 90210, 10001 |

### Invalid Data
| Field | Values |
|---|---|
| Names | `!@#$%`, `123`, 500+ chars |
| Postal Code | `ABC`, `XYZ123`, `!@#` |
| Empty | (blank) |

### Product Catalog
| Product | Price |
|---|---|
| Sauce Labs Backpack | $29.99 |
| Sauce Labs Bike Light | $9.99 |
| Sauce Labs Bolt T-Shirt | $15.99 |
| Sauce Labs Fleece Jacket | $49.99 |
| Sauce Labs Onesie | $7.99 |
| Test.allTheThings() T-Shirt | $15.99 |

## Risk Assessment

| Risk | Level |
|---|---|
| Form validation security (XSS/injection) | High |
| Session management | High |
| Browser cross-compatibility | Medium |
| Network interruption during checkout | Medium |
| UI cosmetic issues | Low |

---

**Document Version:** 1.0  
**Date:** April 16, 2026  
**Jira Ticket:** KAN-1  
**Status:** Ready for Review
