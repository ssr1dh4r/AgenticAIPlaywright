# KAN-2 Exploratory Testing Notes

**Ticket:** KAN-2 - SauceDemo Login Validation  
**Application URL:** https://www.saucedemo.com  
**Tested By:** Agentic AI (GitHub Copilot)  
**Date:** 2026-04-17  

---

## Element Locators Discovered

| Element | Locator |
|---------|---------|
| Username field | `#user-name` |
| Password field | `#password` |
| Login button | `#login-button` |
| Error message container | `[data-test="error"]` |
| Error close button | `[data-test="error-button"]` |
| Inventory page header | `.title` |

---

## Exploratory Execution Results

### AC1: Happy Path - Valid Logins

| Test | Username | Password | Result | URL After Login |
|------|----------|----------|--------|-----------------|
| TC-KAN2-001 | standard_user | secret_sauce | ✅ PASS | /inventory.html |
| TC-KAN2-002 | problem_user | secret_sauce | ✅ PASS | /inventory.html |
| TC-KAN2-003 | visual_user | secret_sauce | ✅ PASS | /inventory.html |

### AC2: Negative - Invalid Logins

| Test | Username | Password | Error Message | Result |
|------|----------|----------|---------------|--------|
| TC-KAN2-004 | invalid_user | secret_sauce | "Epic sadface: Username and password do not match any user in this service" | ✅ PASS |
| TC-KAN2-005 | test_user | secret_sauce | "Epic sadface: Username and password do not match any user in this service" | ✅ PASS |
| TC-KAN2-006 | test | secret_sauce | "Epic sadface: Username and password do not match any user in this service" | ✅ PASS |

### Field Validations

| Test | Scenario | Error Message | Result |
|------|----------|---------------|--------|
| TC-KAN2-007 | Empty username | "Epic sadface: Username is required" | ✅ PASS |
| TC-KAN2-008 | Empty password | "Epic sadface: Password is required" | ✅ PASS |
| TC-KAN2-009 | Both empty | "Epic sadface: Username is required" | ✅ PASS (username validated first) |

### Special User Scenarios

| Test | Username | Error Message | Result |
|------|----------|---------------|--------|
| TC-KAN2-010 | locked_out_user | "Epic sadface: Sorry, this user has been locked out." | ✅ PASS |

### UI Interaction Tests

| Test | Scenario | Result |
|------|----------|--------|
| TC-KAN2-011 | Error message dismissal (X button closes error) | ✅ PASS |
| TC-KAN2-012 | Helper text visible (accepted usernames + password) | ✅ PASS |
| TC-KAN2-013 | Input fields: placeholders correct, password masked, login button enabled | ✅ PASS |

---

## Observations

1. **Username validation priority:** When both fields are empty, username is validated first.
2. **Locked user distinct error:** `locked_out_user` receives a different, specific error message compared to invalid credential errors.
3. **Error dismiss:** The `[data-test="error-button"]` (X icon) dismisses the error banner and removes error state from input fields.
4. **Password masking:** Password field has `type="password"` ensuring characters are masked.
5. **Helper text visible:** The login page shows accepted usernames and password, which is useful for testing.
6. **Console errors on page load:** 2 console errors were observed on initial page load (non-functional, likely tracking/analytics).

---

## Bugs Found

**None.** All acceptance criteria validated successfully. All error messages match expected values. No functional defects found.

---

## Recommended Stable Locators for Automation

```typescript
// Login Page
page.locator('#user-name')           // Username input
page.locator('#password')            // Password input
page.locator('#login-button')        // Login button
page.locator('[data-test="error"]')  // Error message
page.locator('[data-test="error-button"]') // Error dismiss button

// Post-login
page.locator('.title')               // Page title on inventory
page.url()                           // URL verification
```
