# KAN-2: Exploratory Testing Notes

## Session Details
- **Date**: 2026-04-20
- **Tester**: Agentic AI (GitHub Copilot)
- **Application**: https://www.saucedemo.com
- **Tool**: Playwright MCP Browser

---

## Login Page Analysis

### Confirmed Locators
| Element | Locator | Type |
|---------|---------|------|
| Username field | `[data-test="username"]` | data-test attribute |
| Password field | `[data-test="password"]` | data-test attribute |
| Login button | `[data-test="login-button"]` | data-test attribute |
| Error message | `[data-test="error"]` | data-test attribute |
| Error dismiss (X) | `[data-test="error-button"]` | data-test attribute |

### Page Properties
- Title: "Swag Labs"
- URL: `https://www.saucedemo.com/`
- Username placeholder: "Username"
- Password placeholder: "Password"
- Password field type: `password` (input visually masked)

---

## Test Execution Results

### AC1: Happy Path - Valid Logins (All PASS)

| Test ID | User | Expected URL | Actual URL | Result |
|---------|------|-------------|-----------|--------|
| TC-KAN2-001 | standard_user | /inventory.html | /inventory.html | ✅ PASS |
| TC-KAN2-002 | problem_user | /inventory.html | /inventory.html | ✅ PASS |
| TC-KAN2-003 | visual_user | /inventory.html | /inventory.html | ✅ PASS |

### AC2: Invalid Logins (All PASS)

| Test ID | User | Expected Error | Actual Error | Result |
|---------|------|---------------|-------------|--------|
| TC-KAN2-004 | invalid_user | "...do not match any user..." | "Epic sadface: Username and password do not match any user in this service" | ✅ PASS |
| TC-KAN2-005 | test | "...do not match any user..." | "Epic sadface: Username and password do not match any user in this service" | ✅ PASS |
| TC-KAN2-006 | test_user | "...do not match any user..." | "Epic sadface: Username and password do not match any user in this service" | ✅ PASS |

### Validation Tests (All PASS)

| Test ID | Scenario | Expected Error | Actual Error | Result |
|---------|----------|---------------|-------------|--------|
| TC-KAN2-007 | Empty username | "Epic sadface: Username is required" | "Epic sadface: Username is required" | ✅ PASS |
| TC-KAN2-008 | Empty password | "Epic sadface: Password is required" | "Epic sadface: Password is required" | ✅ PASS |
| TC-KAN2-009 | Both empty | "Epic sadface: Username is required" | "Epic sadface: Username is required" | ✅ PASS |
| TC-KAN2-010 | Locked user | "...locked out." | "Epic sadface: Sorry, this user has been locked out." | ✅ PASS |
| TC-KAN2-011 | Error dismiss | Error disappears | errorDismissed: true | ✅ PASS |

### UI & Security Tests (All PASS)

| Test ID | Scenario | Expected | Actual | Result |
|---------|----------|----------|--------|--------|
| TC-KAN2-012 | Placeholder text | "Username" / "Password" | "Username" / "Password" | ✅ PASS |
| TC-KAN2-013 | Password masked | type="password" | type="password" | ✅ PASS |
| TC-KAN2-014 | Special chars | Error shown, no crash | Error: "...do not match..." | ✅ PASS |
| TC-KAN2-015 | SQL injection | Login blocked | Login blocked, error shown | ✅ PASS |
| TC-KAN2-016 | Long string (500 chars) | Error shown, no overflow | hasError: true, noOverflow: true | ✅ PASS |

---

## Summary
- **Total scenarios explored**: 16
- **All PASS**: 16/16 ✅
- **Bugs found**: 0
- **Observations**: Application behaves as expected for all scenarios including security edge cases

## Key Findings
1. All `data-test` attributes are stable and reliable for automation
2. Error messages are consistent and exact text can be used for assertions
3. Password field correctly uses `type="password"` for masking
4. SQL injection and special characters are handled gracefully — no bypass possible
5. Long strings (500 chars) cause no layout overflow
6. Error dismiss button (`[data-test="error-button"]`) works reliably

## No Defects Found
All acceptance criteria (AC1 and AC2) are fully met.
