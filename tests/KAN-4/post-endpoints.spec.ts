import { test, expect } from '@playwright/test';
import { BASE_URL, createObjectPayload, createMinimalPayload } from './fixtures/test-data';

// KAN-4: AC1 — POST Endpoint Validation
// Tests TC-005, TC-006

test.describe('KAN-4: POST /objects', () => {
  const createdIds: string[] = [];

  test.afterEach(async ({ request }) => {
    for (const id of createdIds.splice(0)) {
      await request.delete(`${BASE_URL}/objects/${id}`).catch(() => {});
    }
  });

  test('TC-005: POST create object with name and data returns 200 with assigned ID', async ({ request }) => {
    const payload = createObjectPayload('TC005');
    const response = await request.post(`${BASE_URL}/objects`, {
      data: payload,
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(typeof body.id).toBe('string');
    expect(body.id.length).toBeGreaterThan(0);
    expect(body.name).toBe(payload.name);
    expect(body.data).toMatchObject(payload.data);
    expect(body).toHaveProperty('createdAt');

    createdIds.push(body.id);
  });

  test('TC-006: POST create object without data field — data is null or absent', async ({ request }) => {
    const payload = createMinimalPayload('TC006');
    const response = await request.post(`${BASE_URL}/objects`, {
      data: payload,
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body.name).toBe(payload.name);
    // data should be null or not present when omitted
    const dataValue = body.data ?? null;
    expect(dataValue).toBeNull();

    createdIds.push(body.id);
  });
});
