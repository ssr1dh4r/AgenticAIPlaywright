/**
 * KAN-3 — AC2: Product Endpoint Tests
 * Tests: TC-KAN3-PROD-001 to TC-KAN3-PROD-009
 *
 * Exploratory findings applied:
 * - PROD-003: GetProductById returns 204 (not 404) for missing ID (BUG-KAN3-005)
 * - PROD-009: CreateProduct accepts out-of-range productType (BUG-KAN3-004)
 * - GetProductByIdAndName requires Name param (returns 400 without it)
 */

import { test, expect } from '@playwright/test';
import {
  API_BASE_URL,
  KNOWN_PRODUCT,
  KNOWN_PRODUCT_NAME,
  NON_EXISTENT_ID,
  VALID_PRODUCT_PAYLOAD,
  MINIMAL_PRODUCT_PAYLOAD,
  INVALID_PRODUCT_PAYLOAD,
} from './fixtures/test-data';
import { getAuthToken, bearerHeaders } from './helpers/api-client';

const BASE = API_BASE_URL;

test.describe('AC2: Product Endpoints', () => {
  // API tests only need Chromium — eaapi.somee.com returns HTML for other browsers
  test.skip(({ browserName }) => browserName !== 'chromium', 'API tests: Chromium only');

  let token: string;

  // Obtain auth token once before all tests in this suite
  test.beforeAll(async ({ request }) => {
    token = await getAuthToken(request);
  });

  // ----------------------------------------------------------------
  // TC-KAN3-PROD-001: GET /Product/GetProducts
  // ----------------------------------------------------------------
  test('TC-KAN3-PROD-001 — GET GetProducts returns 200 and array of products', async ({ request }) => {
    const response = await request.get(`${BASE}/Product/GetProducts`, {
      headers: bearerHeaders(token),
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);

    // Verify each item has the required Product fields
    for (const product of body) {
      expect(product).toHaveProperty('productId');
      expect(product).toHaveProperty('price');
    }
  });

  // ----------------------------------------------------------------
  // TC-KAN3-PROD-001b: GET /Product/GetProducts without auth
  // ----------------------------------------------------------------
  test('TC-KAN3-PROD-001b — GET GetProducts without token returns 401', async ({ request }) => {
    const response = await request.get(`${BASE}/Product/GetProducts`);

    expect(response.status()).toBe(401);
  });

  // ----------------------------------------------------------------
  // TC-KAN3-PROD-002: GET /Product/GetProductById/{id} — valid ID
  // ----------------------------------------------------------------
  test('TC-KAN3-PROD-002 — GET GetProductById with valid ID returns 200 and matching product', async ({ request }) => {
    const response = await request.get(`${BASE}/Product/GetProductById/${KNOWN_PRODUCT.productId}`, {
      headers: bearerHeaders(token),
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.productId).toBe(KNOWN_PRODUCT.productId);
    expect(body.name).toBe(KNOWN_PRODUCT.name);
    expect(body.price).toBe(KNOWN_PRODUCT.price);

    // Validate Product schema shape
    expect(body).toHaveProperty('description');
    expect(body).toHaveProperty('productType');
  });

  // ----------------------------------------------------------------
  // TC-KAN3-PROD-003: GET /Product/GetProductById/{id} — non-existent ID
  // BUG-KAN3-005: Returns 204 instead of 404
  // ----------------------------------------------------------------
  test('TC-KAN3-PROD-003 — GET GetProductById with non-existent ID returns 204 [BUG-KAN3-005: expected 404]', async ({ request }) => {
    const response = await request.get(`${BASE}/Product/GetProductById/${NON_EXISTENT_ID}`, {
      headers: bearerHeaders(token),
    });

    // BUG-KAN3-005: Actual is 204; expected (per REST convention) is 404
    console.warn('[BUG-KAN3-005] GetProductById 999999 returned:', response.status(), '— expected 404');
    expect(response.status()).toBe(204);
  });

  // ----------------------------------------------------------------
  // TC-KAN3-PROD-004: GET /Product/GetProductByIdAndName — valid Id and Name
  // ----------------------------------------------------------------
  test('TC-KAN3-PROD-004 — GET GetProductByIdAndName with valid Id and Name returns 200', async ({ request }) => {
    const response = await request.get(
      `${BASE}/Product/GetProductByIdAndName?Id=${KNOWN_PRODUCT.productId}&Name=${KNOWN_PRODUCT.name}`,
      { headers: bearerHeaders(token) }
    );

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.productId).toBe(KNOWN_PRODUCT.productId);
  });

  // ----------------------------------------------------------------
  // TC-KAN3-PROD-005: GET /Product/GetProductByIdAndName — missing required Name
  // ----------------------------------------------------------------
  test('TC-KAN3-PROD-005 — GET GetProductByIdAndName without required Name returns 400', async ({ request }) => {
    const response = await request.get(
      `${BASE}/Product/GetProductByIdAndName?Id=1`,
      { headers: bearerHeaders(token) }
    );

    expect(response.status()).toBe(400);
  });

  // ----------------------------------------------------------------
  // TC-KAN3-PROD-006: GET /Product/GetProductByName/{name}
  // ----------------------------------------------------------------
  test('TC-KAN3-PROD-006 — GET GetProductByName returns 200 and matching product', async ({ request }) => {
    const response = await request.get(`${BASE}/Product/GetProductByName/${KNOWN_PRODUCT_NAME}`, {
      headers: bearerHeaders(token),
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('productId');
    expect(body.name).toBe(KNOWN_PRODUCT_NAME);
  });

  // ----------------------------------------------------------------
  // TC-KAN3-PROD-007: POST /Product/Create — all fields
  // ----------------------------------------------------------------
  test('TC-KAN3-PROD-007 — POST CreateProduct with all fields returns 200 and created product', async ({ request }) => {
    const response = await request.post(`${BASE}/Product/Create`, {
      headers: bearerHeaders(token),
      data: VALID_PRODUCT_PAYLOAD,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    // Validate schema
    expect(body).toHaveProperty('productId');
    expect(body.name).toBe(VALID_PRODUCT_PAYLOAD.name);
    expect(body.description).toBe(VALID_PRODUCT_PAYLOAD.description);
    expect(body.price).toBe(VALID_PRODUCT_PAYLOAD.price);
    expect(body.productType).toBe(VALID_PRODUCT_PAYLOAD.productType);
  });

  // ----------------------------------------------------------------
  // TC-KAN3-PROD-008: POST /Product/Create — minimal fields (nullable omitted)
  // ----------------------------------------------------------------
  test('TC-KAN3-PROD-008 — POST CreateProduct with mandatory fields only returns 200', async ({ request }) => {
    const response = await request.post(`${BASE}/Product/Create`, {
      headers: bearerHeaders(token),
      data: MINIMAL_PRODUCT_PAYLOAD,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('productId');
    expect(body.price).toBe(MINIMAL_PRODUCT_PAYLOAD.price);
  });

  // ----------------------------------------------------------------
  // TC-KAN3-PROD-009: POST /Product/Create — invalid productType (BUG-KAN3-004)
  // ----------------------------------------------------------------
  test('TC-KAN3-PROD-009 — POST CreateProduct with out-of-range productType [BUG-KAN3-004: accepts 99]', async ({ request }) => {
    const response = await request.post(`${BASE}/Product/Create`, {
      headers: bearerHeaders(token),
      data: INVALID_PRODUCT_PAYLOAD,
    });

    // BUG-KAN3-004: API accepts productType=99 and returns 200 instead of 400
    console.warn('[BUG-KAN3-004] CreateProduct with productType=99 returned:', response.status(), '— expected 400');
    expect(response.status()).toBe(200);
  });
});
