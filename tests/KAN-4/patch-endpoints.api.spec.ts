import { test, expect } from '@playwright/test';
import { BASE_URL } from './fixtures/test-data';

// KAN-4: AC5 — PATCH Endpoint Validation
// Tests TC-009, TC-010

test.describe('KAN-4: PATCH /objects/{id}', () => {
  let createdId: string;
  const originalName = 'Patch Test Object KAN4';
  const originalData = { color: 'Blue', year: 2023 };

  test.beforeEach(async ({ request }) => {
    const res = await request.post(`${BASE_URL}/objects`, {
      data: { name: originalName, data: originalData },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    createdId = body.id;
  });

  test.afterEach(async ({ request }) => {
    if (createdId) {
      await request.delete(`${BASE_URL}/objects/${createdId}`).catch(() => {});
    }
  });

  test('TC-009: PATCH name only — data is preserved', async ({ request }) => {
    const response = await request.patch(`${BASE_URL}/objects/${createdId}`, {
      data: { name: 'Patched Name KAN4' },
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.id).toBe(createdId);
    expect(body.name).toBe('Patched Name KAN4');
    // data should be preserved from creation
    expect(body.data).toMatchObject(originalData);
  });

  test('TC-010: PATCH data only — name is preserved', async ({ request }) => {
    const response = await request.patch(`${BASE_URL}/objects/${createdId}`, {
      data: { data: { color: 'Red' } },
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.id).toBe(createdId);
    expect(body.name).toBe(originalName);
    expect(body.data).toHaveProperty('color', 'Red');
  });
});
