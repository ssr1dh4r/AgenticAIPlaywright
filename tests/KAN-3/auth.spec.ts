import { expect, test } from '@playwright/test';
import { apiGet, apiPost, authHeaders, loginAndGetToken, safeJson } from './api-client';

test.describe('KAN-3 Authentication APIs', () => {
  test('POST /api/Authenticate/Login returns token for valid credentials', async ({ request }) => {
    const response = await apiPost(request, '/api/Authenticate/Login', {
      userName: 'Karthik',
      password: '123456',
    });

    expect(response.status()).toBe(200);
    const body = await safeJson(response);
    const token =
      typeof body === 'string'
        ? body
        : Array.isArray(body)
          ? body[0]
          : body?.token;

    expect(typeof token).toBe('string');
    expect(String(token).length).toBeGreaterThan(8);
  });

  test('POST /api/Authenticate/Login with missing fields fails validation', async ({ request }) => {
    const response = await apiPost(request, '/api/Authenticate/Login', {
      userName: '',
      password: '',
    });

    expect([400, 401, 422]).toContain(response.status());
  });

  test('GET /api/Authenticate/Get works with authorization header', async ({ request }) => {
    const token = await loginAndGetToken(request);
    const response = await apiGet(request, '/api/Authenticate/Get', authHeaders(token));

    expect(response.status()).toBe(200);
    const body = await safeJson(response);
    expect(body).toBeTruthy();
  });
});
