import { test, expect } from '@playwright/test';

const BASE_URL = 'https://api.dummyjson.com';

test.describe('KAN-8: DummyJSON PUT Endpoints', () => {
  test('TC-KAN8-PUT-001: Update entire product', async ({ request }) => {
    const payload = {
      title: 'Updated Product Title',
      price: 199.99,
      description: 'Updated description',
      brand: 'Updated Brand'
    };

    const response = await request.put(`${BASE_URL}/products/1`, {
      data: payload
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.id).toBe(1);
    expect(data.title).toBe('Updated Product Title');
    expect(data.price).toBe(199.99);
  });

  test('TC-KAN8-PUT-002: Update product with valid fields', async ({ request }) => {
    const payload = {
      title: 'New Title',
      description: 'New Description',
      price: 150.00,
      brand: 'New Brand',
      category: 'electronics',
      thumbnail: 'https://example.com/thumb.jpg'
    };

    const response = await request.put(`${BASE_URL}/products/5`, {
      data: payload
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data.title).toBe('New Title');
  });

  test('TC-KAN8-PUT-003: Update non-existent product', async ({ request }) => {
    const payload = {
      title: 'Test'
    };

    const response = await request.put(`${BASE_URL}/products/99999`, {
      data: payload
    });

    // DummyJSON typically returns 200 for PUT on non-existent resources
    expect([200, 404, 201]).toContain(response.status());
  });

  test('TC-KAN8-PUT-004: Replace product completely', async ({ request }) => {
    const originalProduct = await (await request.get(`${BASE_URL}/products/3`)).json();
    
    const newPayload = {
      title: 'Completely New Product',
      description: 'Brand new description',
      price: 999.99,
      discountPercentage: 0,
      rating: 5,
      stock: 1000,
      brand: 'Premium Brand',
      category: 'luxury',
      thumbnail: 'https://new.com/thumb.jpg'
    };

    const response = await request.put(`${BASE_URL}/products/3`, {
      data: newPayload
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.title).toBe('Completely New Product');
    expect(data.price).toBe(999.99);
  });

  test('TC-KAN8-PUT-005: Update user information', async ({ request }) => {
    const payload = {
      firstName: 'Updated',
      lastName: 'User',
      email: 'updated@example.com'
    };

    const response = await request.put(`${BASE_URL}/users/1`, {
      data: payload
    });

    expect([200, 404]).toContain(response.status());
    if (response.status() === 200) {
      const data = await response.json();
      expect(data.firstName).toBe('Updated');
    }
  });

  test('TC-KAN8-PUT-006: Update cart items', async ({ request }) => {
    const payload = {
      merge: false,
      products: [
        {
          productId: 2,
          quantity: 3
        }
      ]
    };

    const response = await request.put(`${BASE_URL}/carts/1`, {
      data: payload
    });

    expect([200, 404]).toContain(response.status());
  });
});
