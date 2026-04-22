# KAN-2: SauceDemo Login Validation Test Plan

## Application Overview

Test plan for SauceDemo login functionality covering authentication validation, error handling, UI behavior, and security testing. Includes positive and negative test scenarios for comprehensive coverage.

## Test Scenarios

### 1. Login Validation Suite

**Seed:** `tests/seed.spec.ts`

#### 1.1. Valid Login Scenarios

**File:** `tests/KAN-2/valid-logins.spec.ts`

**Steps:**
  1. Test all valid user credentials (standard_user, problem_user, visual_user) with password 'secret_sauce'
    - expect: Successfully login with standard_user and redirect to /inventory.html
    - expect: Successfully login with problem_user and redirect to /inventory.html
    - expect: Successfully login with visual_user and redirect to /inventory.html

#### 1.2. Invalid Login Scenarios

**File:** `tests/KAN-2/invalid-logins.spec.ts`

**Steps:**
  1. Test invalid usernames (invalid_user, test, test_user) with correct password
    - expect: Show error 'Epic sadface: Username and password do not match any user in this service'
    - expect: User remains on login page
    - expect: Error is dismissible with X button

#### 1.3. Field Validation Tests

**File:** `tests/KAN-2/field-validation.spec.ts`

**Steps:**
  1. Test empty field validation scenarios
    - expect: Show error 'Epic sadface: Username is required' when both fields empty
    - expect: Show error 'Epic sadface: Password is required' when only username provided
    - expect: All errors are dismissible

#### 1.4. Locked User Test

**File:** `tests/KAN-2/locked-user.spec.ts`

**Steps:**
  1. Attempt login with locked_out_user and secret_sauce
    - expect: Show error 'Epic sadface: Sorry, this user has been locked out.'
    - expect: Login is prevented
    - expect: Error is dismissible

#### 1.5. UI Behavior Tests

**File:** `tests/KAN-2/ui-behavior.spec.ts`

**Steps:**
  1. Verify field properties, placeholders, masking, and UI elements
    - expect: Username field has placeholder 'Username' and type='text'
    - expect: Password field has placeholder 'Password' and type='password' (masked)
    - expect: Error messages use data-test='error' and are dismissible via data-test='error-button'

#### 1.6. Security and Edge Cases

**File:** `tests/KAN-2/security-tests.spec.ts`

**Steps:**
  1. Test security scenarios including special characters, SQL injection, and boundary conditions
    - expect: Special characters in username handled safely
    - expect: SQL injection attempts fail securely
    - expect: Very long inputs handled gracefully
    - expect: No security vulnerabilities exposed
