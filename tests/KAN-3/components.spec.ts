import { expect, test } from '@playwright/test';
import { apiGet, authHeaders, loginAndGetToken, safeJson } from './api-client';

test.describe('KAN-3 Components APIs', () => {
  test('GET /Components/GetAllComponents returns collection', async ({ request }) => {
    const token = await loginAndGetToken(request);
    const response = await apiGet(request, '/Components/GetAllComponents', authHeaders(token));

    expect(response.status()).toBe(200);
    const body = await safeJson(response);
    expect(Array.isArray(body)).toBeTruthy();

    if (Array.isArray(body) && body.length > 0) {
      expect(body[0]).toHaveProperty('id');
      expect(body[0]).toHaveProperty('name');
    }
  });

  test('GET /Components/GetComponentByProductId/999999 handles invalid id', async ({ request }) => {
    const token = await loginAndGetToken(request);
    const response = await apiGet(
      request,
      '/Components/GetComponentByProductId/999999',
      authHeaders(token),
    );

    expect([200, 204, 400, 404]).toContain(response.status());
  });
});
