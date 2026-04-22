# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: KAN-4/post-endpoints.spec.ts >> KAN-4: POST /objects >> TC-006: POST create object without data field — data is null or absent
- Location: tests/KAN-4/post-endpoints.spec.ts:36:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 405
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { BASE_URL, createObjectPayload, createMinimalPayload } from './fixtures/test-data';
  3  | 
  4  | // KAN-4: AC1 — POST Endpoint Validation
  5  | // Tests TC-005, TC-006
  6  | 
  7  | test.describe('KAN-4: POST /objects', () => {
  8  |   const createdIds: string[] = [];
  9  | 
  10 |   test.afterEach(async ({ request }) => {
  11 |     for (const id of createdIds.splice(0)) {
  12 |       await request.delete(`${BASE_URL}/objects/${id}`).catch(() => {});
  13 |     }
  14 |   });
  15 | 
  16 |   test('TC-005: POST create object with name and data returns 200 with assigned ID', async ({ request }) => {
  17 |     const payload = createObjectPayload('TC005');
  18 |     const response = await request.post(`${BASE_URL}/objects`, {
  19 |       data: payload,
  20 |       headers: { 'Content-Type': 'application/json' },
  21 |     });
  22 | 
  23 |     expect(response.status()).toBe(200);
  24 | 
  25 |     const body = await response.json();
  26 |     expect(body).toHaveProperty('id');
  27 |     expect(typeof body.id).toBe('string');
  28 |     expect(body.id.length).toBeGreaterThan(0);
  29 |     expect(body.name).toBe(payload.name);
  30 |     expect(body.data).toMatchObject(payload.data);
  31 |     expect(body).toHaveProperty('createdAt');
  32 | 
  33 |     createdIds.push(body.id);
  34 |   });
  35 | 
  36 |   test('TC-006: POST create object without data field — data is null or absent', async ({ request }) => {
  37 |     const payload = createMinimalPayload('TC006');
  38 |     const response = await request.post(`${BASE_URL}/objects`, {
  39 |       data: payload,
  40 |       headers: { 'Content-Type': 'application/json' },
  41 |     });
  42 | 
> 43 |     expect(response.status()).toBe(200);
     |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  44 | 
  45 |     const body = await response.json();
  46 |     expect(body).toHaveProperty('id');
  47 |     expect(body.name).toBe(payload.name);
  48 |     // data should be null or not present when omitted
  49 |     const dataValue = body.data ?? null;
  50 |     expect(dataValue).toBeNull();
  51 | 
  52 |     createdIds.push(body.id);
  53 |   });
  54 | });
  55 | 
```