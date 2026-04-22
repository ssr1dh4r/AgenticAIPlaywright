import { test, expect } from '@playwright/test';
import { BASE_URL, SEEDED_OBJECTS } from './fixtures/test-data';

// KAN-4: AC2 — GET Endpoint Validation
// Tests TC-001, TC-002, TC-003, TC-004, TC-013

test.describe('KAN-4: GET /objects', () => {
  test('TC-001: GET all objects returns 200 and array with expected schema', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/objects`);

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);

    for (const item of body) {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(typeof item.id).toBe('string');
      expect(typeof item.name).toBe('string');
    }
  });

  test('TC-002: GET single object by valid ID returns correct object', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/objects/${SEEDED_OBJECTS.id7.id}`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.id).toBe(SEEDED_OBJECTS.id7.id);
    expect(body.name).toBe(SEEDED_OBJECTS.id7.name);
    expect(body.data).toHaveProperty('year', SEEDED_OBJECTS.id7.data.year);
    expect(body.data).toHaveProperty('price', SEEDED_OBJECTS.id7.data.price);
    expect(body.data).toHaveProperty('CPU model', SEEDED_OBJECTS.id7.data['CPU model']);
  });

  test('TC-003: GET single object by invalid ID returns 404 with error message', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/objects/99999`);

    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body).toHaveProperty('error');
    expect(body.error).toContain('99999');
  });

  test('TC-004: GET multiple objects by query params returns correct subset', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/objects?id=3&id=5&id=10`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBe(3);

    const ids = body.map((o: { id: string }) => o.id);
    expect(ids).toContain('3');
    expect(ids).toContain('5');
    expect(ids).toContain('10');
  });

  test('TC-013: GET all objects response Content-Type is application/json', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/objects`);

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
  });
});
