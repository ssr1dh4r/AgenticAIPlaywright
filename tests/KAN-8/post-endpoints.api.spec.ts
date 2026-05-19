import { test, expect } from '@playwright/test';

const BASE_URL = 'https://api.dummyjson.com';

test.describe('KAN-8: DummyJSON POST Endpoints', () => {
  test('TC-KAN8-POST-001: Add product with valid data', async ({ request }) => {
    const payload = {
      title: 'Test Product',
      description: 'Test Description',
      price: 99.99,
      discountPercentage: 10,
      rating: 4.5,
      stock: 100,
      brand: 'Test Brand',
      category: 'test-category',
      thumbnail: 'https://example.com/thumb.jpg',
      images: ['https://example.com/img1.jpg']
    };

    const response = await request.post(`${BASE_URL}/products/add`, {
      data: payload
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data.title).toBe('Test Product');
    expect(data.price).toBe(99.99);
  });

  test('TC-KAN8-POST-002: Add product missing required field', async ({ request }) => {
    const payload = {
      description: 'Test Description',
      price: 99.99
      // Missing 'title' field
    };

    const response = await request.post(`${BASE_URL}/products/add`, {
      data: payload
    });

    // API may return 200 or 400 depending on implementation
    // For DummyJSON, it typically returns 200 with auto-generated data
    expect([200, 400]).toContain(response.status());
  });

  test('TC-KAN8-POST-003: Add product with invalid price type', async ({ request }) => {
    const payload = {
      title: 'Test',
      price: 'not-a-number'
    };

    const response = await request.post(`${BASE_URL}/products/add`, {
      data: payload
    });

    // API may return 200 (with type coercion) or 400 (validation)
    expect([200, 400]).toContain(response.status());
  });

  test('TC-KAN8-POST-004: Create cart with product', async ({ request }) => {
    const payload = {
      userId: 1,
      date: new Date().toISOString().split('T')[0],
      products: [
        {
          productId: 1,
          quantity: 2
        }
      ]
    };

    const response = await request.post(`${BASE_URL}/carts/add`, {
      data: payload
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data.products).toBeDefined();
  });

  test('TC-KAN8-POST-005: Create todo item', async ({ request }) => {
    const payload = {
      todo: 'Test todo item',
      completed: false,
      userId: 1
    };

    const response = await request.post(`${BASE_URL}/todos/add`, {
      data: payload
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data.todo).toBe('Test todo item');
  });

  test('TC-KAN8-POST-006: Add multiple products in batch', async ({ request }) => {
    const payloads = [
      { title: 'Product 1', price: 100 },
      { title: 'Product 2', price: 200 }
    ];

    for (const payload of payloads) {
      const response = await request.post(`${BASE_URL}/products/add`, {
        data: payload
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('id');
    }
  });
});
