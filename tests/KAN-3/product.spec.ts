import { expect, test } from '@playwright/test';
import { apiGet, authHeaders, loginAndGetToken, safeJson } from './api-client';

test.describe('KAN-3 Product APIs', () => {
  test('GET /Product/GetProducts returns product list', async ({ request }) => {
    const token = await loginAndGetToken(request);
    const response = await apiGet(request, '/Product/GetProducts', authHeaders(token));

    expect(response.status()).toBe(200);
    const body = await safeJson(response);

    const isCollection = Array.isArray(body) || (body && typeof body === 'object');
    expect(Boolean(isCollection)).toBeTruthy();
  });

  test('GET /Product/GetProductById/999999 handles invalid id', async ({ request }) => {
    const token = await loginAndGetToken(request);
    const response = await apiGet(request, '/Product/GetProductById/999999', authHeaders(token));

    expect([200, 204, 400, 404]).toContain(response.status());
  });
});
