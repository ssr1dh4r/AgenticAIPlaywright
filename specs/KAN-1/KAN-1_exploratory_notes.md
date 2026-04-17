# KAN-1 Exploratory Testing Notes

**Date:** April 16, 2026  
**Tester:** AI Agent (Playwright MCP Browser)  
**Application:** https://www.saucedemo.com  
**Credentials:** standard_user / secret_sauce  

---

## Confirmed Selectors

| Element | Selector | Notes |
|---|---|---|
| Username field | `[data-test="username"]` | Textbox on login page |
| Password field | `[data-test="password"]` | Textbox on login page |
| Login button | `[data-test="login-button"]` | Submit login |
| Cart icon | `[data-test="shopping-cart-link"]` | Always visible in header |
| Cart badge | `.shopping_cart_badge` | Shows count; hidden when 0 items |
| Add to cart | `[data-test="add-to-cart-{slug}"]` | e.g. `add-to-cart-sauce-labs-backpack` |
| Remove button | `[data-test="remove-{slug}"]` | e.g. `remove-sauce-labs-backpack` |
| Continue Shopping | `[data-test="continue-shopping"]` | On cart page |
| Checkout | `[data-test="checkout"]` | On cart page |
| First Name | `[data-test="firstName"]` | Checkout step 1 |
| Last Name | `[data-test="lastName"]` | Checkout step 1 |
| Postal Code | `[data-test="postalCode"]` | Checkout step 1 |
| Continue | `[data-test="continue"]` | Checkout step 1 submit |
| Cancel | `[data-test="cancel"]` | On checkout step 1 and 2 |
| Error message | `[data-test="error"]` | Validation error container |
| Error dismiss | `.error-button` | X button to close error |
| Payment info | `[data-test="payment-info-value"]` | On overview page |
| Shipping info | `[data-test="shipping-info-value"]` | On overview page |
| Subtotal | `[data-test="subtotal-label"]` | e.g. "Item total: $29.99" |
| Tax | `[data-test="tax-label"]` | e.g. "Tax: $2.40" |
| Total | `[data-test="total-label"]` | e.g. "Total: $32.39" |
| Finish | `[data-test="finish"]` | Checkout step 2 submit |
| Confirmation header | `[data-test="complete-header"]` | "Thank you for your order!" |
| Confirmation body | `[data-test="complete-text"]` | Dispatch message |
| Pony image | `[data-test="pony-express"]` | Confirmation page image |
| Back Home | `[data-test="back-to-products"]` | Returns to inventory |
| Inventory items | `.inventory_item` | Product cards |
| Item name | `.inventory_item_name` | Product title in cart/overview |
| Item price | `.inventory_item_price` | Product price |
| Cart quantity | `.cart_quantity` | Item quantity in cart |
| Sort dropdown | combobox (no data-test) | Use `page.selectOption('select', 'value')` |

---

## Confirmed URL Patterns

| Page | URL | Trigger |
|---|---|---|
| Login | `https://www.saucedemo.com/` | Direct navigation |
| Inventory | `/inventory.html` | Successful login / Back Home |
| Cart | `/cart.html` | Click cart icon |
| Checkout Info | `/checkout-step-one.html` | Click Checkout from cart |
| Checkout Overview | `/checkout-step-two.html` | Click Continue with valid form |
| Order Complete | `/checkout-complete.html` | Click Finish |

---

## Confirmed Behaviors

### Login
- Page title: **Swag Labs** (all pages)
- 6 products on inventory page
- Cart badge hidden when empty, shows count when items present

### Cart Page
- Item name, price ($29.99 for Backpack), quantity (1) all confirmed visible
- Continue Shopping and Checkout buttons both present

### Checkout Step 1 (Info Form)
- All 3 fields confirmed: firstName, lastName, postalCode
- Continue and Cancel buttons present
- Empty submit → "Error: First Name is required"
- Only first name → "Error: Last Name is required"
- Only first+last → "Error: Postal Code is required"
- Error dismiss button (`.error-button`) confirmed working

### Checkout Step 2 (Overview)
- Payment info: **"SauceCard #31337"**
- Shipping info: **"Free Pony Express Delivery!"**
- Subtotal format: **"Item total: $XX.XX"**
- Tax format: **"Tax: $X.XX"** (Tax rate: ~8% — $29.99 → $2.40)
- Total format: **"Total: $XX.XX"**
- Finish and Cancel buttons present

### Checkout Complete
- Header: **"Thank you for your order!"**
- Body: **"Your order has been dispatched, and will arrive just as fast as the pony can get there!"**
- Pony Express image visible
- Back Home button present
- After Back Home → cart cleared (badge gone), all buttons show "Add to cart"

### Sort Options (dropdown values)
- "Name (A to Z)" — default
- "Name (Z to A)"
- "Price (low to high)"
- "Price (high to low)"

---

## Product Catalog (Confirmed)

| Product | Price | Data-test Slug |
|---|---|---|
| Sauce Labs Backpack | $29.99 | `sauce-labs-backpack` |
| Sauce Labs Bike Light | $9.99 | `sauce-labs-bike-light` |
| Sauce Labs Bolt T-Shirt | $15.99 | `sauce-labs-bolt-t-shirt` |
| Sauce Labs Fleece Jacket | $49.99 | `sauce-labs-fleece-jacket` |
| Sauce Labs Onesie | $7.99 | `sauce-labs-onesie` |
| Test.allTheThings() T-Shirt (Red) | $15.99 | `test.allthethings()-t-shirt-(red)` |

---

## Observations and Notes

1. **Tax calculation**: ~8.0% — $29.99 → Tax $2.40, Total $32.39
2. **Cart persistence**: Cart items persist across page navigation within session
3. **Back Home**: Clicking Back Home from completion clears cart and returns to clean inventory
4. **No real-time validation**: Form validation only triggers on Continue button click
5. **Cancel behavior**: Not fully explored — test in automation scripts
6. **Console errors**: 6 errors observed (likely non-critical, related to external asset loading)
7. **Single page app behavior**: URLs change on navigation but no full page reload

---

## Defect Observations

- No defects found in happy path flow
- Validation messages work as expected
- Error dismiss works correctly

---

**Notes Author:** AI Agent  
**Next Step:** Generate automation scripts in `tests/KAN-1/` using SOLID principles
