# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: KAN-4/patch-endpoints.spec.ts >> KAN-4: PATCH /objects/{id} >> TC-009: PATCH name only — data is preserved
- Location: tests/KAN-4/patch-endpoints.spec.ts:28:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 405
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { BASE_URL } from './fixtures/test-data';
  3  | 
  4  | // KAN-4: AC5 — PATCH Endpoint Validation
  5  | // Tests TC-009, TC-010
  6  | 
  7  | test.describe('KAN-4: PATCH /objects/{id}', () => {
  8  |   let createdId: string;
  9  |   const originalName = 'Patch Test Object KAN4';
  10 |   const originalData = { color: 'Blue', year: 2023 };
  11 | 
  12 |   test.beforeEach(async ({ request }) => {
  13 |     const res = await request.post(`${BASE_URL}/objects`, {
  14 |       data: { name: originalName, data: originalData },
  15 |       headers: { 'Content-Type': 'application/json' },
  16 |     });
> 17 |     expect(res.status()).toBe(200);
     |                          ^ Error: expect(received).toBe(expected) // Object.is equality
  18 |     const body = await res.json();
  19 |     createdId = body.id;
  20 |   });
  21 | 
  22 |   test.afterEach(async ({ request }) => {
  23 |     if (createdId) {
  24 |       await request.delete(`${BASE_URL}/objects/${createdId}`).catch(() => {});
  25 |     }
  26 |   });
  27 | 
  28 |   test('TC-009: PATCH name only — data is preserved', async ({ request }) => {
  29 |     const response = await request.patch(`${BASE_URL}/objects/${createdId}`, {
  30 |       data: { name: 'Patched Name KAN4' },
  31 |       headers: { 'Content-Type': 'application/json' },
  32 |     });
  33 | 
  34 |     expect(response.status()).toBe(200);
  35 | 
  36 |     const body = await response.json();
  37 |     expect(body.id).toBe(createdId);
  38 |     expect(body.name).toBe('Patched Name KAN4');
  39 |     // data should be preserved from creation
  40 |     expect(body.data).toMatchObject(originalData);
  41 |   });
  42 | 
  43 |   test('TC-010: PATCH data only — name is preserved', async ({ request }) => {
  44 |     const response = await request.patch(`${BASE_URL}/objects/${createdId}`, {
  45 |       data: { data: { color: 'Red' } },
  46 |       headers: { 'Content-Type': 'application/json' },
  47 |     });
  48 | 
  49 |     expect(response.status()).toBe(200);
  50 | 
  51 |     const body = await response.json();
  52 |     expect(body.id).toBe(createdId);
  53 |     expect(body.name).toBe(originalName);
  54 |     expect(body.data).toHaveProperty('color', 'Red');
  55 |   });
  56 | });
  57 | 
```