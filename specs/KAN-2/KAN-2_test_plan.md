# KAN-2 SauceDemo Login Validation Test Plan

## Application Overview

Comprehensive test plan for validating login functionality of SauceDemo application including valid user authentication, invalid credential handling, edge cases, and UI validations. The application provides multiple user types with different behaviors and comprehensive error handling for various failure scenarios.

## Test Scenarios

### 1. Happy Path Login Tests

**Seed:** `tests/seed.spec.ts`

#### 1.1. TC-KAN2-001: Successful login with standard_user

**File:** `tests/KAN-2/login-happy-path.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
    - expect: Login page loads successfully
    - expect: Username and password fields are visible
    - expect: Login button is enabled
  2. Enter 'standard_user' in username field
    - expect: Username field accepts the input
    - expect: No validation errors appear
  3. Enter 'secret_sauce' in password field
    - expect: Password field accepts the input (masked)
    - expect: No validation errors appear
  4. Click Login button
    - expect: User is redirected to inventory page
    - expect: URL changes to '/inventory.html'
    - expect: Products page displays correctly

#### 1.2. TC-KAN2-002: Successful login with problem_user

**File:** `tests/KAN-2/login-happy-path.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
    - expect: Login page loads successfully
  2. Enter 'problem_user' in username field
    - expect: Username field accepts the input
  3. Enter 'secret_sauce' in password field
    - expect: Password field accepts the input
  4. Click Login button
    - expect: User is successfully logged in
    - expect: Redirected to inventory page

#### 1.3. TC-KAN2-003: Successful login with visual_user

**File:** `tests/KAN-2/login-happy-path.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
    - expect: Login page loads successfully
  2. Enter 'visual_user' in username field
    - expect: Username field accepts the input
  3. Enter 'secret_sauce' in password field
    - expect: Password field accepts the input
  4. Click Login button
    - expect: User is successfully logged in
    - expect: Redirected to inventory page

### 2. Invalid Credentials Tests

**Seed:** `tests/seed.spec.ts`

#### 2.1. TC-KAN2-004: Login failure with invalid username

**File:** `tests/KAN-2/login-negative.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
    - expect: Login page loads successfully
  2. Enter 'invalid_user' in username field
    - expect: Username field accepts the input
  3. Enter 'secret_sauce' in password field
    - expect: Password field accepts the input
  4. Click Login button
    - expect: Error message appears: 'Epic sadface: Username and password do not match any user in this service'
    - expect: User remains on login page
    - expect: Error icons appear next to input fields

#### 2.2. TC-KAN2-005: Login failure with invalid password

**File:** `tests/KAN-2/login-negative.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
    - expect: Login page loads successfully
  2. Enter 'standard_user' in username field
    - expect: Username field accepts the input
  3. Enter 'wrong_password' in password field
    - expect: Password field accepts the input
  4. Click Login button
    - expect: Error message appears: 'Epic sadface: Username and password do not match any user in this service'
    - expect: User remains on login page
    - expect: Error icons appear next to input fields

#### 2.3. TC-KAN2-006: Login failure with both invalid credentials

**File:** `tests/KAN-2/login-negative.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
    - expect: Login page loads successfully
  2. Enter 'test_user' in username field
    - expect: Username field accepts the input
  3. Enter 'wrong_password' in password field
    - expect: Password field accepts the input
  4. Click Login button
    - expect: Error message appears: 'Epic sadface: Username and password do not match any user in this service'
    - expect: User remains on login page

### 3. Field Validation Tests

**Seed:** `tests/seed.spec.ts`

#### 3.1. TC-KAN2-007: Empty username validation

**File:** `tests/KAN-2/login-validation.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
    - expect: Login page loads successfully
  2. Leave username field empty
    - expect: Username field is empty
  3. Enter 'secret_sauce' in password field
    - expect: Password field accepts the input
  4. Click Login button
    - expect: Error message appears: 'Epic sadface: Username is required'
    - expect: User remains on login page
    - expect: Error icons appear next to fields

#### 3.2. TC-KAN2-008: Empty password validation

**File:** `tests/KAN-2/login-validation.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
    - expect: Login page loads successfully
  2. Enter 'standard_user' in username field
    - expect: Username field accepts the input
  3. Leave password field empty
    - expect: Password field is empty
  4. Click Login button
    - expect: Error message appears: 'Epic sadface: Password is required'
    - expect: User remains on login page
    - expect: Error icons appear next to fields

#### 3.3. TC-KAN2-009: Both fields empty validation

**File:** `tests/KAN-2/login-validation.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
    - expect: Login page loads successfully
  2. Leave both username and password fields empty
    - expect: Both fields are empty
  3. Click Login button
    - expect: Error message appears: 'Epic sadface: Username is required' (prioritizes username validation)
    - expect: User remains on login page
    - expect: Error icons appear next to fields

### 4. Locked User Tests

**Seed:** `tests/seed.spec.ts`

#### 4.1. TC-KAN2-010: Locked out user login attempt

**File:** `tests/KAN-2/login-locked-user.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
    - expect: Login page loads successfully
  2. Enter 'locked_out_user' in username field
    - expect: Username field accepts the input
  3. Enter 'secret_sauce' in password field
    - expect: Password field accepts the input
  4. Click Login button
    - expect: Specific error message appears: 'Epic sadface: Sorry, this user has been locked out.'
    - expect: User remains on login page
    - expect: Error is different from invalid credentials message

### 5. UI Interaction Tests

**Seed:** `tests/seed.spec.ts`

#### 5.1. TC-KAN2-011: Error message dismissal

**File:** `tests/KAN-2/login-ui-interactions.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
    - expect: Login page loads successfully
  2. Enter invalid credentials and submit
    - expect: Error message appears with close button
  3. Click the error message close button
    - expect: Error message is dismissed
    - expect: Error icons disappear from input fields
    - expect: Form is ready for new input

#### 5.2. TC-KAN2-012: Helper text visibility

**File:** `tests/KAN-2/login-ui-interactions.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
    - expect: Login page loads successfully
  2. Verify helper text section is visible
    - expect: 'Accepted usernames are:' heading is visible
    - expect: List of valid usernames is displayed: standard_user, locked_out_user, problem_user, performance_glitch_user, error_user, visual_user
    - expect: 'Password for all users:' heading is visible
    - expect: Password 'secret_sauce' is displayed

#### 5.3. TC-KAN2-013: Input field attributes

**File:** `tests/KAN-2/login-ui-interactions.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
    - expect: Login page loads successfully
  2. Verify input field properties
    - expect: Username field has placeholder 'Username'
    - expect: Password field has placeholder 'Password'
    - expect: Password field masks input characters
    - expect: Login button is enabled by default

### 6. Special Characters and Edge Cases

**Seed:** `tests/seed.spec.ts`

#### 6.1. TC-KAN2-014: Special characters in username

**File:** `tests/KAN-2/login-edge-cases.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
    - expect: Login page loads successfully
  2. Enter special characters in username field: '!@#$%^&*()'
    - expect: Username field accepts special characters
  3. Enter 'secret_sauce' in password field
    - expect: Password field accepts the input
  4. Click Login button
    - expect: Error message appears: 'Epic sadface: Username and password do not match any user in this service'
    - expect: Application handles special characters gracefully

#### 6.2. TC-KAN2-015: SQL injection attempt in username

**File:** `tests/KAN-2/login-edge-cases.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
    - expect: Login page loads successfully
  2. Enter SQL injection string in username: ''; DROP TABLE users; --'
    - expect: Username field accepts the input
  3. Enter 'secret_sauce' in password field
    - expect: Password field accepts the input
  4. Click Login button
    - expect: Error message appears: 'Epic sadface: Username and password do not match any user in this service'
    - expect: Application is not vulnerable to SQL injection
    - expect: No system errors occur

#### 6.3. TC-KAN2-016: Very long username input

**File:** `tests/KAN-2/login-edge-cases.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
    - expect: Login page loads successfully
  2. Enter very long string (500+ characters) in username field
    - expect: Username field handles long input appropriately
  3. Enter 'secret_sauce' in password field
    - expect: Password field accepts the input
  4. Click Login button
    - expect: Error message appears: 'Epic sadface: Username and password do not match any user in this service'
    - expect: Application handles long input gracefully
    - expect: No performance issues or crashes
