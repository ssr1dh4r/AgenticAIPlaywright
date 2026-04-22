import { test, expect } from '@playwright/test';
import { BASE_URL } from './fixtures/test-data';

// KAN-4: TC-014 — Full CRUD Lifecycle Test
// POST → GET → PATCH → DELETE → confirm 404

test.describe('KAN-4: Full CRUD Lifecycle', () => {
  test('TC-014: Full POST-GET-PATCH-DELETE lifecycle completes successfully', async ({ request }) => {
    // Step 1: POST — create object
    const createRes = await request.post(`${BASE_URL}/objects`, {
      data: { name: 'Lifecycle Object KAN4', data: { step: 1 } },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(createRes.status()).toBe(200);
    const created = await createRes.json();
    expect(created).toHaveProperty('id');
    const id = created.id;

    // Step 2: GET — verify creation
    const getRes = await request.get(`${BASE_URL}/objects/${id}`);
    expect(getRes.status()).toBe(200);
    const gotten = await getRes.json();
    expect(gotten.name).toBe('Lifecycle Object KAN4');
    expect(gotten.data).toMatchObject({ step: 1 });

    // Step 3: PATCH — partial update
    const patchRes = await request.patch(`${BASE_URL}/objects/${id}`, {
      data: { data: { step: 2 } },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(patchRes.status()).toBe(200);
    const patched = await patchRes.json();
    expect(patched.data).toMatchObject({ step: 2 });
    expect(patched.name).toBe('Lifecycle Object KAN4');

    // Step 4: DELETE — remove object
    const deleteRes = await request.delete(`${BASE_URL}/objects/${id}`);
    expect(deleteRes.status()).toBe(200);
    const deleted = await deleteRes.json();
    expect(deleted.message).toContain(id);

    // Step 5: GET after DELETE — confirm 404
    const getAfterRes = await request.get(`${BASE_URL}/objects/${id}`);
    expect(getAfterRes.status()).toBe(404);
    const notFound = await getAfterRes.json();
    expect(notFound).toHaveProperty('error');
    expect(notFound.error).toContain(id);
  });
});
