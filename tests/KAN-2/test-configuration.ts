/**
 * Configuration and test utilities for KAN-2 SauceDemo Login Tests
 * spec: specs/KAN-2-test-plan.md
 */

export const TEST_CONFIG = {
  baseURL: 'https://www.saucedemo.com',
  timeout: 30000,
  navigationTimeout: 15000,
  slowMo: 0,
};

export const ERROR_MESSAGES = {
  invalidCredentials: 'Username and password do not match any user in this service',
  lockedOut: 'Sorry, this user has been locked out',
  requiredField: 'Epic sadface:',
};

export const TEST_DATA_SETS = {
  validUsers: [
    { username: 'standard_user', password: 'secret_sauce' },
    { username: 'problem_user', password: 'secret_sauce' },
    { username: 'performance_glitch_user', password: 'secret_sauce' },
    { username: 'visual_user', password: 'secret_sauce' },
  ],
  
  invalidCredentials: [
    { username: 'invalid_user', password: 'secret_sauce', expectedError: 'Username and password do not match' },
    { username: 'standard_user', password: 'wrong_password', expectedError: 'Username and password do not match' },
    { username: 'locked_out_user', password: 'secret_sauce', expectedError: 'Sorry, this user has been locked out' },
  ],
  
  edgeCases: [
    { input: '!@#$%^&*()', description: 'special characters' },
    { input: "' OR '1'='1", description: 'SQL injection attempt' },
    { input: 'a'.repeat(300), description: 'very long input 300+ chars' },
    { input: '  leading_and_trailing  ', description: 'whitespace padding' },
  ],
};

export const BROWSER_CONFIGS = {
  chromium: { name: 'chromium', channel: undefined },
  firefox: { name: 'firefox', channel: undefined },
  webkit: { name: 'webkit', channel: undefined },
};

export const HTTP_STATUS = {
  OK: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

export const LOAD_INDICATORS = {
  loginPage: '[data-test="username"]',
  inventoryPage: '[data-test="inventory-list"]',
  errorMessage: '[data-test="error"]',
};