# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: KAN-4/put-endpoints.spec.ts >> KAN-4: PUT /objects/{id} >> TC-007: PUT full replace updates name and data
- Location: tests/KAN-4/put-endpoints.spec.ts:26:7

# Error details

```
Test timeout of 60000ms exceeded while running "beforeEach" hook.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { BASE_URL } from './fixtures/test-data';
  3  | 
  4  | // KAN-4: AC4 — PUT Endpoint Validation
  5  | // Tests TC-007, TC-008
  6  | 
  7  | test.describe('KAN-4: PUT /objects/{id}', () => {
  8  |   let createdId: string;
  9  | 
> 10 |   test.beforeEach(async ({ request }) => {
     |        ^ Test timeout of 60000ms exceeded while running "beforeEach" hook.
  11 |     const res = await request.post(`${BASE_URL}/objects`, {
  12 |       data: { name: 'PUT Test Object KAN4', data: { price: 500, color: 'Blue' } },
  13 |       headers: { 'Content-Type': 'application/json' },
  14 |     });
  15 |     expect(res.status()).toBe(200);
  16 |     const body = await res.json();
  17 |     createdId = body.id;
  18 |   });
  19 | 
  20 |   test.afterEach(async ({ request }) => {
  21 |     if (createdId) {
  22 |       await request.delete(`${BASE_URL}/objects/${createdId}`).catch(() => {});
  23 |     }
  24 |   });
  25 | 
  26 |   test('TC-007: PUT full replace updates name and data', async ({ request }) => {
  27 |     const response = await request.put(`${BASE_URL}/objects/${createdId}`, {
  28 |       data: { name: 'Replaced Laptop KAN4', data: { price: 1299.99 } },
  29 |       headers: { 'Content-Type': 'application/json' },
  30 |     });
  31 | 
  32 |     expect(response.status()).toBe(200);
  33 | 
  34 |     const body = await response.json();
  35 |     expect(body.id).toBe(createdId);
  36 |     expect(body.name).toBe('Replaced Laptop KAN4');
  37 |     expect(body.data).toMatchObject({ price: 1299.99 });
  38 |     expect(body).toHaveProperty('updatedAt');
  39 |   });
  40 | 
  41 |   test('TC-008: PUT with name only — data becomes null', async ({ request }) => {
  42 |     const response = await request.put(`${BASE_URL}/objects/${createdId}`, {
  43 |       data: { name: 'Name Only KAN4' },
  44 |       headers: { 'Content-Type': 'application/json' },
  45 |     });
  46 | 
  47 |     expect(response.status()).toBe(200);
  48 | 
  49 |     const body = await response.json();
  50 |     expect(body.id).toBe(createdId);
  51 |     expect(body.name).toBe('Name Only KAN4');
  52 |     const dataValue = body.data ?? null;
  53 |     expect(dataValue).toBeNull();
  54 |   });
  55 | });
  56 | 
```