/**
 * KAN-2: Test Data constants for SauceDemo Login Validation
 * Contains all users, credentials, error messages, and test inputs
 */

export const APP_URL = 'https://www.saucedemo.com';
export const INVENTORY_URL = 'https://www.saucedemo.com/inventory.html';
export const INVENTORY_PATH = '/inventory.html';

export const VALID_USERS = [
  { username: 'standard_user', password: 'secret_sauce', testId: 'TC-KAN2-001' },
  { username: 'problem_user',  password: 'secret_sauce', testId: 'TC-KAN2-002' },
  { username: 'visual_user',   password: 'secret_sauce', testId: 'TC-KAN2-003' },
];

export const INVALID_USERS = [
  { username: 'invalid_user', password: 'secret_sauce', testId: 'TC-KAN2-004' },
  { username: 'test',          password: 'secret_sauce', testId: 'TC-KAN2-005' },
  { username: 'test_user',     password: 'secret_sauce', testId: 'TC-KAN2-006' },
];

export const LOCKED_USER = { username: 'locked_out_user', password: 'secret_sauce', testId: 'TC-KAN2-010' };

export const ERROR_MESSAGES = {
  USERNAME_REQUIRED: 'Epic sadface: Username is required',
  PASSWORD_REQUIRED: 'Epic sadface: Password is required',
  CREDENTIALS_MISMATCH: 'Epic sadface: Username and password do not match any user in this service',
  LOCKED_OUT: 'Epic sadface: Sorry, this user has been locked out.',
};

export const UI_TEXT = {
  USERNAME_PLACEHOLDER: 'Username',
  PASSWORD_PLACEHOLDER: 'Password',
  PAGE_TITLE: 'Swag Labs',
};

export const EDGE_CASE_INPUTS = {
  SPECIAL_CHARS: 'user@#$%',
  SQL_INJECTION: "admin' OR '1'='1' --",
  LONG_STRING: 'a'.repeat(500),
};
