# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: KAN-4/lifecycle.spec.ts >> KAN-4: Full CRUD Lifecycle >> TC-014: Full POST-GET-PATCH-DELETE lifecycle completes successfully
- Location: tests/KAN-4/lifecycle.spec.ts:8:7

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
  4  | // KAN-4: TC-014 — Full CRUD Lifecycle Test
  5  | // POST → GET → PATCH → DELETE → confirm 404
  6  | 
  7  | test.describe('KAN-4: Full CRUD Lifecycle', () => {
  8  |   test('TC-014: Full POST-GET-PATCH-DELETE lifecycle completes successfully', async ({ request }) => {
  9  |     // Step 1: POST — create object
  10 |     const createRes = await request.post(`${BASE_URL}/objects`, {
  11 |       data: { name: 'Lifecycle Object KAN4', data: { step: 1 } },
  12 |       headers: { 'Content-Type': 'application/json' },
  13 |     });
> 14 |     expect(createRes.status()).toBe(200);
     |                                ^ Error: expect(received).toBe(expected) // Object.is equality
  15 |     const created = await createRes.json();
  16 |     expect(created).toHaveProperty('id');
  17 |     const id = created.id;
  18 | 
  19 |     // Step 2: GET — verify creation
  20 |     const getRes = await request.get(`${BASE_URL}/objects/${id}`);
  21 |     expect(getRes.status()).toBe(200);
  22 |     const gotten = await getRes.json();
  23 |     expect(gotten.name).toBe('Lifecycle Object KAN4');
  24 |     expect(gotten.data).toMatchObject({ step: 1 });
  25 | 
  26 |     // Step 3: PATCH — partial update
  27 |     const patchRes = await request.patch(`${BASE_URL}/objects/${id}`, {
  28 |       data: { data: { step: 2 } },
  29 |       headers: { 'Content-Type': 'application/json' },
  30 |     });
  31 |     expect(patchRes.status()).toBe(200);
  32 |     const patched = await patchRes.json();
  33 |     expect(patched.data).toMatchObject({ step: 2 });
  34 |     expect(patched.name).toBe('Lifecycle Object KAN4');
  35 | 
  36 |     // Step 4: DELETE — remove object
  37 |     const deleteRes = await request.delete(`${BASE_URL}/objects/${id}`);
  38 |     expect(deleteRes.status()).toBe(200);
  39 |     const deleted = await deleteRes.json();
  40 |     expect(deleted.message).toContain(id);
  41 | 
  42 |     // Step 5: GET after DELETE — confirm 404
  43 |     const getAfterRes = await request.get(`${BASE_URL}/objects/${id}`);
  44 |     expect(getAfterRes.status()).toBe(404);
  45 |     const notFound = await getAfterRes.json();
  46 |     expect(notFound).toHaveProperty('error');
  47 |     expect(notFound.error).toContain(id);
  48 |   });
  49 | });
  50 | 
```