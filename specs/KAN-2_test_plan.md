# KAN-2: SauceDemo Login Validation Test Plan

## Application Overview

Comprehensive test plan for SauceDemo login validation functionality covering positive login scenarios with valid users, negative scenarios with invalid credentials, form validation, UI validation, and navigation flow testing across multiple browsers (Chrome, Firefox, Safari).

## Test Scenarios

### 1. Login Authentication Suite

#### 1.1. Successful Login with Standard User
- Navigate to https://www.saucedemo.com/
- Login with standard_user / secret_sauce
- Expect redirect to /inventory.html and Products header visible

#### 1.2. Successful Login with Problem User
- Login with problem_user / secret_sauce → inventory page

#### 1.3. Successful Login with Visual User
- Login with visual_user / secret_sauce → inventory page

#### 1.4. Login Failure with test_user
- Expect error: 'Epic sadface: Username and password do not match any user in this service'

#### 1.5. Login Failure with test
- Same error, remain on login page

#### 1.6. Login Failure with invalid_user
- Same error, remain on login page

### 2. Form Validation Suite

#### 2.1. Empty Username Validation
- Click login without username → 'Epic sadface: Username is required'

#### 2.2. Empty Password Validation
- Enter username, no password → 'Epic sadface: Password is required'

### 3. UI and UX Validation Suite

#### 3.1. Password Field Masking
- Password input type must be 'password'

### 4. Navigation Suite

#### 4.1. Unauthenticated Redirect
- Navigate directly to /inventory.html → redirected to login

#### 4.2. Post-Login Inventory
- After login → 6 inventory items visible
