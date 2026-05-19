import { test, expect } from '@playwright/test';
import * as fs from 'fs';

const BASE_URL = 'https://api.dummyjson.com';

test.describe('KAN-8: DummyJSON GET Endpoints', () => {
  test('TC-KAN8-GET-001: Retrieve all products', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/products`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.products)).toBeTruthy();
    expect(data.products.length).toBeGreaterThan(0);
    expect(data.products[0]).toHaveProperty('id');
    expect(data.products[0]).toHaveProperty('title');
    expect(data.products[0]).toHaveProperty('price');
  });

  test('TC-KAN8-GET-002: Retrieve single product by valid ID', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/products/1`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.id).toBe(1);
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('description');
    expect(data).toHaveProperty('price');
    expect(typeof data.price).toBe('number');
  });

  test('TC-KAN8-GET-003: Retrieve product by invalid ID returns 404', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/products/99999`);
    expect(response.status()).toBe(404);
  });

  test('TC-KAN8-GET-004: Get products with skip parameter', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/products?skip=5&limit=5`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.products.length).toBeLessThanOrEqual(5);
  });

  test('TC-KAN8-GET-005: Get products with limit parameter', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/products?limit=10`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.products.length).toBeLessThanOrEqual(10);
  });

  test('TC-KAN8-GET-006: Retrieve all users', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/users`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.users)).toBeTruthy();
    expect(data.users.length).toBeGreaterThan(0);
    expect(data.users[0]).toHaveProperty('id');
    expect(data.users[0]).toHaveProperty('username');
  });

  test('TC-KAN8-GET-007: Retrieve single user by ID', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/users/1`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.id).toBe(1);
    expect(data).toHaveProperty('username');
    expect(data).toHaveProperty('email');
  });

  test('TC-KAN8-GET-008: Retrieve all carts', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/carts`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.carts)).toBeTruthy();
  });
});
