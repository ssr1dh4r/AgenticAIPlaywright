# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: KAN-4/get-endpoints.spec.ts >> KAN-4: GET /objects >> TC-002: GET single object by valid ID returns correct object
- Location: tests/KAN-4/get-endpoints.spec.ts:26:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 405
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { BASE_URL, SEEDED_OBJECTS } from './fixtures/test-data';
  3  | 
  4  | // KAN-4: AC2 — GET Endpoint Validation
  5  | // Tests TC-001, TC-002, TC-003, TC-004, TC-013
  6  | 
  7  | test.describe('KAN-4: GET /objects', () => {
  8  |   test('TC-001: GET all objects returns 200 and array with expected schema', async ({ request }) => {
  9  |     const response = await request.get(`${BASE_URL}/objects`);
  10 | 
  11 |     expect(response.status()).toBe(200);
  12 |     expect(response.headers()['content-type']).toContain('application/json');
  13 | 
  14 |     const body = await response.json();
  15 |     expect(Array.isArray(body)).toBeTruthy();
  16 |     expect(body.length).toBeGreaterThan(0);
  17 | 
  18 |     for (const item of body) {
  19 |       expect(item).toHaveProperty('id');
  20 |       expect(item).toHaveProperty('name');
  21 |       expect(typeof item.id).toBe('string');
  22 |       expect(typeof item.name).toBe('string');
  23 |     }
  24 |   });
  25 | 
  26 |   test('TC-002: GET single object by valid ID returns correct object', async ({ request }) => {
  27 |     const response = await request.get(`${BASE_URL}/objects/${SEEDED_OBJECTS.id7.id}`);
  28 | 
> 29 |     expect(response.status()).toBe(200);
     |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  30 | 
  31 |     const body = await response.json();
  32 |     expect(body.id).toBe(SEEDED_OBJECTS.id7.id);
  33 |     expect(body.name).toBe(SEEDED_OBJECTS.id7.name);
  34 |     expect(body.data).toHaveProperty('year', SEEDED_OBJECTS.id7.data.year);
  35 |     expect(body.data).toHaveProperty('price', SEEDED_OBJECTS.id7.data.price);
  36 |     expect(body.data).toHaveProperty('CPU model', SEEDED_OBJECTS.id7.data['CPU model']);
  37 |   });
  38 | 
  39 |   test('TC-003: GET single object by invalid ID returns 404 with error message', async ({ request }) => {
  40 |     const response = await request.get(`${BASE_URL}/objects/99999`);
  41 | 
  42 |     expect(response.status()).toBe(404);
  43 | 
  44 |     const body = await response.json();
  45 |     expect(body).toHaveProperty('error');
  46 |     expect(body.error).toContain('99999');
  47 |   });
  48 | 
  49 |   test('TC-004: GET multiple objects by query params returns correct subset', async ({ request }) => {
  50 |     const response = await request.get(`${BASE_URL}/objects?id=3&id=5&id=10`);
  51 | 
  52 |     expect(response.status()).toBe(200);
  53 | 
  54 |     const body = await response.json();
  55 |     expect(Array.isArray(body)).toBeTruthy();
  56 |     expect(body.length).toBe(3);
  57 | 
  58 |     const ids = body.map((o: { id: string }) => o.id);
  59 |     expect(ids).toContain('3');
  60 |     expect(ids).toContain('5');
  61 |     expect(ids).toContain('10');
  62 |   });
  63 | 
  64 |   test('TC-013: GET all objects response Content-Type is application/json', async ({ request }) => {
  65 |     const response = await request.get(`${BASE_URL}/objects`);
  66 | 
  67 |     expect(response.status()).toBe(200);
  68 |     expect(response.headers()['content-type']).toContain('application/json');
  69 |   });
  70 | });
  71 | 
```