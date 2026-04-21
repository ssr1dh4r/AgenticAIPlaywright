/**
 * KAN-3: EA API Test Data Fixtures
 * Centralised constants for the EA API test suite.
 */

export const API_BASE_URL = 'http://eaapi.somee.com';

export const AUTH_CREDENTIALS = {
  valid: { userName: 'Karthik', password: '123456' },
  invalidPassword: { userName: 'Karthik', password: 'wrongpassword' },
  missingPassword: { userName: 'Karthik' },
  missingUsername: { password: '123456' },
};

export const KNOWN_PRODUCT = {
  productId: 1,
  name: 'Keyboard',
  price: 150,
};

export const KNOWN_PRODUCT_NAME = 'Test';

export const NON_EXISTENT_ID = 999999;

export const VALID_PRODUCT_PAYLOAD = {
  name: 'AutoTestProduct',
  description: 'Created by KAN-3 automation',
  price: 99,
  productType: 1,
};

export const MINIMAL_PRODUCT_PAYLOAD = {
  price: 10,
  productType: 2,
};

export const INVALID_PRODUCT_PAYLOAD = {
  price: 10,
  productType: 99, // out of enum range 0-5 — BUG-KAN3-004
};

export const VALID_COMPONENT_PAYLOAD = {
  id: 0,
  name: 'AutoTestComponent',
  description: 'Created by KAN-3 automation',
  productId: 1,
};

export const MINIMAL_COMPONENT_PAYLOAD = {
  id: 0,
};
