# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: KAN-4/delete-endpoints.spec.ts >> KAN-4: DELETE /objects/{id} >> TC-011: DELETE created object returns 200 with confirmation message
- Location: tests/KAN-4/delete-endpoints.spec.ts:8:7

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
  4  | // KAN-4: AC3 — DELETE Endpoint Validation
  5  | // Tests TC-011, TC-012
  6  | 
  7  | test.describe('KAN-4: DELETE /objects/{id}', () => {
  8  |   test('TC-011: DELETE created object returns 200 with confirmation message', async ({ request }) => {
  9  |     // Create an object to delete
  10 |     const createRes = await request.post(`${BASE_URL}/objects`, {
  11 |       data: { name: 'Delete Me KAN4', data: { temp: true } },
  12 |       headers: { 'Content-Type': 'application/json' },
  13 |     });
> 14 |     expect(createRes.status()).toBe(200);
     |                                ^ Error: expect(received).toBe(expected) // Object.is equality
  15 |     const created = await createRes.json();
  16 |     const id = created.id;
  17 | 
  18 |     // Delete it
  19 |     const response = await request.delete(`${BASE_URL}/objects/${id}`);
  20 |     expect(response.status()).toBe(200);
  21 | 
  22 |     const body = await response.json();
  23 |     expect(body).toHaveProperty('message');
  24 |     expect(body.message).toContain(id);
  25 | 
  26 |     // Verify it's gone
  27 |     const getRes = await request.get(`${BASE_URL}/objects/${id}`);
  28 |     expect(getRes.status()).toBe(404);
  29 |   });
  30 | 
  31 |   test('TC-012: DELETE non-existent object returns 404', async ({ request }) => {
  32 |     const response = await request.delete(`${BASE_URL}/objects/99999`);
  33 | 
  34 |     expect(response.status()).toBe(404);
  35 | 
  36 |     const body = await response.json();
  37 |     expect(body).toHaveProperty('error');
  38 |     expect(body.error).toContain('99999');
  39 |   });
  40 | });
  41 | 
```