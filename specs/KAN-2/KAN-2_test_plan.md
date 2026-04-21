# KAN-2: SauceDemo Login Validation Test Plan

## Project Information
- **Ticket**: KAN-2
- **Application**: SauceDemo  
- **URL**: https://www.saucedemo.com
- **Test Environment**: Production
- **Browser Support**: Chrome, Firefox, Safari

## Test Objectives
Validate the SauceDemo login functionality to ensure proper authentication, error handling, field validation, and security measures are in place.

## Test Scope
### In Scope:
- Valid user authentication scenarios
- Invalid credential handling  
- Field validation (empty fields)
- Locked user scenarios
- Error message display and dismissal
- UI element validation
- Security testing (basic)

### Out of Scope:
- Password reset functionality
- Session management
- Multi-factor authentication
- Performance testing

## Test Data
### Valid Users:
- standard_user / secret_sauce
- problem_user / secret_sauce  
- visual_user / secret_sauce

### Invalid/Test Users:
- invalid_user / secret_sauce
- test / secret_sauce
- test_user / secret_sauce

### Locked User:
- locked_out_user / secret_sauce

## Locators Reference
- Username field: `[data-test="username"]` or `#user-name`
- Password field: `[data-test="password"]` or `#password`
- Login button: `[data-test="login-button"]` or `#login-button`
- Error message: `[data-test="error"]`
- Error dismiss button: `[data-test="error-button"]`

## Test Cases

### TC-KAN2-001: Valid login - standard_user
**Priority**: High  
**Type**: Positive  
**Objective**: Verify successful login with standard_user credentials

**Preconditions**: 
- Browser is open
- Navigate to https://www.saucedemo.com

**Test Steps**:
1. Enter "standard_user" in username field
2. Enter "secret_sauce" in password field  
3. Click Login button

**Expected Results**:
- User is redirected to https://www.saucedemo.com/inventory.html
- Inventory page loads successfully
- No error messages displayed

---

### TC-KAN2-002: Valid login - problem_user  
**Priority**: High  
**Type**: Positive  
**Objective**: Verify successful login with problem_user credentials

**Preconditions**: Navigate to https://www.saucedemo.com

**Test Steps**:
1. Enter "problem_user" in username field
2. Enter "secret_sauce" in password field
3. Click Login button

**Expected Results**:
- User is redirected to /inventory.html
- Login successful
- Inventory page loads

---

### TC-KAN2-003: Valid login - visual_user
**Priority**: High  
**Type**: Positive  
**Objective**: Verify successful login with visual_user credentials

**Preconditions**: Navigate to https://www.saucedemo.com

**Test Steps**:
1. Enter "visual_user" in username field
2. Enter "secret_sauce" in password field
3. Click Login button

**Expected Results**:
- User is redirected to /inventory.html
- Login successful
- Inventory page loads

---

### TC-KAN2-004: Invalid login - invalid_user
**Priority**: High  
**Type**: Negative  
**Objective**: Verify error handling for invalid username

**Preconditions**: Navigate to https://www.saucedemo.com

**Test Steps**:
1. Enter "invalid_user" in username field
2. Enter "secret_sauce" in password field
3. Click Login button

**Expected Results**:
- User remains on login page
- Error message displayed: "Epic sadface: Username and password do not match any user in this service"
- Error message is dismissible via X button

---

### TC-KAN2-005: Invalid login - test
**Priority**: Medium  
**Type**: Negative  
**Objective**: Verify error handling for "test" username

**Preconditions**: Navigate to https://www.saucedemo.com

**Test Steps**:
1. Enter "test" in username field
2. Enter "secret_sauce" in password field
3. Click Login button

**Expected Results**:
- User remains on login page
- Error message displayed: "Epic sadface: Username and password do not match any user in this service"
- Error is dismissible

---

### TC-KAN2-006: Invalid login - test_user
**Priority**: Medium  
**Type**: Negative  
**Objective**: Verify error handling for "test_user" username

**Preconditions**: Navigate to https://www.saucedemo.com

**Test Steps**:
1. Enter "test_user" in username field
2. Enter "secret_sauce" in password field
3. Click Login button

**Expected Results**:
- User remains on login page
- Error message displayed: "Epic sadface: Username and password do not match any user in this service"
- Error is dismissible

---

### TC-KAN2-007: Empty username validation
**Priority**: High  
**Type**: Negative  
**Objective**: Verify validation when username field is empty

**Preconditions**: Navigate to https://www.saucedemo.com

**Test Steps**:
1. Leave username field empty
2. Enter "secret_sauce" in password field
3. Click Login button

**Expected Results**:
- User remains on login page
- Error message displayed: "Epic sadface: Username is required"
- Error message is dismissible via X button

---

### TC-KAN2-008: Empty password validation
**Priority**: High  
**Type**: Negative  
**Objective**: Verify validation when password field is empty

**Preconditions**: Navigate to https://www.saucedemo.com

**Test Steps**:
1. Enter "standard_user" in username field
2. Leave password field empty
3. Click Login button

**Expected Results**:
- User remains on login page
- Error message displayed: "Epic sadface: Password is required"
- Error message is dismissible via X button

---

### TC-KAN2-009: Both fields empty validation
**Priority**: High  
**Type**: Negative  
**Objective**: Verify validation when both fields are empty

**Preconditions**: Navigate to https://www.saucedemo.com

**Test Steps**:
1. Leave username field empty
2. Leave password field empty
3. Click Login button

**Expected Results**:
- User remains on login page
- Error message displayed: "Epic sadface: Username is required" (username takes priority)
- Error message is dismissible via X button

---

### TC-KAN2-010: Locked out user
**Priority**: High  
**Type**: Negative  
**Objective**: Verify locked user cannot login

**Preconditions**: Navigate to https://www.saucedemo.com

**Test Steps**:
1. Enter "locked_out_user" in username field
2. Enter "secret_sauce" in password field
3. Click Login button

**Expected Results**:
- User remains on login page
- Error message displayed: "Epic sadface: Sorry, this user has been locked out."
- Error message is dismissible via X button

---

### TC-KAN2-011: Error message dismissible
**Priority**: Medium  
**Type**: Functional  
**Objective**: Verify error messages can be dismissed

**Preconditions**: 
- Navigate to https://www.saucedemo.com
- Trigger any login error

**Test Steps**:
1. Trigger a login error (use invalid credentials)
2. Verify error message appears with X button
3. Click the X button on error message

**Expected Results**:
- Error message is dismissed and no longer visible
- Form remains functional

---

### TC-KAN2-012: Placeholder text verification
**Priority**: Low  
**Type**: UI  
**Objective**: Verify correct placeholder text in form fields

**Preconditions**: Navigate to https://www.saucedemo.com

**Test Steps**:
1. Observe username field placeholder
2. Observe password field placeholder

**Expected Results**:
- Username field displays placeholder "Username"
- Password field displays placeholder "Password"

---

### TC-KAN2-013: Password field masked
**Priority**: Medium  
**Type**: Security  
**Objective**: Verify password field masks input

**Preconditions**: Navigate to https://www.saucedemo.com

**Test Steps**:
1. Enter any text in password field
2. Verify field type attribute

**Expected Results**:
- Password field has type="password" attribute
- Password text is visually masked

---

### TC-KAN2-014: Special characters in username
**Priority**: Low  
**Type**: Negative/Security  
**Objective**: Verify handling of special characters

**Preconditions**: Navigate to https://www.saucedemo.com

**Test Steps**:
1. Enter username with special characters: "user@#$%"
2. Enter "secret_sauce" in password field
3. Click Login button

**Expected Results**:
- Application handles input gracefully
- Error message displayed: "Epic sadface: Username and password do not match any user in this service"
- No application crash or unexpected behavior

---

### TC-KAN2-015: SQL injection attempt
**Priority**: High  
**Type**: Security  
**Objective**: Verify protection against SQL injection

**Preconditions**: Navigate to https://www.saucedemo.com

**Test Steps**:
1. Enter SQL injection payload in username: "admin' OR '1'='1' --"
2. Enter "secret_sauce" in password field
3. Click Login button

**Expected Results**:
- Login attempt fails securely
- Error message displayed: "Epic sadface: Username and password do not match any user in this service"
- No unauthorized access granted

---

### TC-KAN2-016: Very long string input
**Priority**: Low  
**Type**: Boundary  
**Objective**: Verify handling of very long input strings

**Preconditions**: Navigate to https://www.saucedemo.com

**Test Steps**:
1. Enter a very long string (500+ characters) in username field
2. Enter a very long string (500+ characters) in password field
3. Click Login button

**Expected Results**:
- Application handles long inputs gracefully
- No UI breaking or overflow occurs
- Appropriate error message displayed
- Application remains functional

---

## Risk Assessment
| Risk | Level | Mitigation |
|------|-------|-----------|
| Authentication bypass | High | SQL injection test (TC-KAN2-015) |
| Locked user access | High | TC-KAN2-010 |
| Empty field bypass | High | TC-KAN2-007/008/009 |
| UI overflow | Low | TC-KAN2-016 |
| Password exposure | Medium | TC-KAN2-013 |

## Definition of Done
- [x] All 16 acceptance criteria have test cases
- [x] Manual exploratory testing completed
- [x] Automated test scripts created and passing
- [x] Test results documented
- [x] Bugs logged for any failures
- [x] Code committed to repository
