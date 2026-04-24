import { test, expect } from '@playwright/test';
import { BASE_URL } from './fixtures/test-data';

// KAN-4: AC3 — DELETE Endpoint Validation
// Tests TC-011, TC-012

test.describe('KAN-4: DELETE /objects/{id}', () => {
  test('TC-011: DELETE created object returns 200 with confirmation message', async ({ request }) => {
    // Create an object to delete
    const createRes = await request.post(`${BASE_URL}/objects`, {
      data: { name: 'Delete Me KAN4', data: { temp: true } },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(createRes.status()).toBe(200);
    const created = await createRes.json();
    const id = created.id;

    // Delete it
    const response = await request.delete(`${BASE_URL}/objects/${id}`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('message');
    expect(body.message).toContain(id);

    // Verify it's gone
    const getRes = await request.get(`${BASE_URL}/objects/${id}`);
    expect(getRes.status()).toBe(404);
  });

  test('TC-012: DELETE non-existent object returns 404', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/objects/99999`);

    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body).toHaveProperty('error');
    expect(body.error).toContain('99999');
  });
});
