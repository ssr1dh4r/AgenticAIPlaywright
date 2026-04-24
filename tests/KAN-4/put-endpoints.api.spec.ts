import { test, expect } from '@playwright/test';
import { BASE_URL } from './fixtures/test-data';

// KAN-4: AC4 — PUT Endpoint Validation
// Tests TC-007, TC-008

test.describe('KAN-4: PUT /objects/{id}', () => {
  let createdId: string;

  test.beforeEach(async ({ request }) => {
    const res = await request.post(`${BASE_URL}/objects`, {
      data: { name: 'PUT Test Object KAN4', data: { price: 500, color: 'Blue' } },
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

  test('TC-007: PUT full replace updates name and data', async ({ request }) => {
    const response = await request.put(`${BASE_URL}/objects/${createdId}`, {
      data: { name: 'Replaced Laptop KAN4', data: { price: 1299.99 } },
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.id).toBe(createdId);
    expect(body.name).toBe('Replaced Laptop KAN4');
    expect(body.data).toMatchObject({ price: 1299.99 });
    expect(body).toHaveProperty('updatedAt');
  });

  test('TC-008: PUT with name only — data becomes null', async ({ request }) => {
    const response = await request.put(`${BASE_URL}/objects/${createdId}`, {
      data: { name: 'Name Only KAN4' },
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.id).toBe(createdId);
    expect(body.name).toBe('Name Only KAN4');
    const dataValue = body.data ?? null;
    expect(dataValue).toBeNull();
  });
});
