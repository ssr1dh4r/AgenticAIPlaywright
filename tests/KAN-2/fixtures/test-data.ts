/**
 * KAN-2 - SauceDemo Login Validation
 * Test data constants used across all login test suites.
 */

export const APP_URL = 'https://www.saucedemo.com/';

export const INVENTORY_URL_PATTERN = /.*inventory\.html/;

// -------------------------------------------------------
// Valid Users (AC1 - should login successfully)
// -------------------------------------------------------
export const VALID_USERS = [
  { username: 'standard_user', password: 'secret_sauce' },
  { username: 'problem_user',  password: 'secret_sauce' },
  { username: 'visual_user',   password: 'secret_sauce' },
] as const;

// -------------------------------------------------------
// Invalid Users (AC2 - should NOT login)
// -------------------------------------------------------
export const INVALID_USERS = [
  { username: 'test_user',    password: 'secret_sauce' },
  { username: 'test',         password: 'secret_sauce' },
  { username: 'invalid_user', password: 'secret_sauce' },
] as const;

// -------------------------------------------------------
// Special Accounts
// -------------------------------------------------------
export const LOCKED_USER = { username: 'locked_out_user', password: 'secret_sauce' } as const;

// -------------------------------------------------------
// Error Messages (exact text as returned by the application)
// -------------------------------------------------------
export const ERROR_MESSAGES = {
  invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
  usernameRequired:   'Epic sadface: Username is required',
  passwordRequired:   'Epic sadface: Password is required',
  lockedOut:          'Epic sadface: Sorry, this user has been locked out.',
} as const;

// -------------------------------------------------------
// UI Text Constants
// -------------------------------------------------------
export const UI_TEXT = {
  acceptedUsernamesHeading: 'Accepted usernames are:',
  passwordHeading:          'Password for all users:',
  usernamePlaceholder:      'Username',
  passwordPlaceholder:      'Password',
} as const;

// -------------------------------------------------------
// Edge Case Inputs
// -------------------------------------------------------
export const EDGE_CASE_INPUTS = [
  { label: 'special characters',  username: '!@#$%^&*()' },
  { label: 'SQL injection',        username: "'; DROP TABLE users; --" },
  { label: 'very long string',     username: 'a'.repeat(500) },
] as const;
