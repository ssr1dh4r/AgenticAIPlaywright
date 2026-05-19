# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: KAN-8/post-endpoints.api.spec.ts >> KAN-8: DummyJSON POST Endpoints >> TC-KAN8-POST-001: Add product with valid data
- Location: tests/KAN-8/post-endpoints.api.spec.ts:6:7

# Error details

```
Error: apiRequestContext.post: getaddrinfo ENOTFOUND api.dummyjson.com
Call log:
  - → POST https://api.dummyjson.com/products/add
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.7727.15 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - content-type: application/json
    - content-length: 254

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | const BASE_URL = 'https://api.dummyjson.com';
  4   | 
  5   | test.describe('KAN-8: DummyJSON POST Endpoints', () => {
  6   |   test('TC-KAN8-POST-001: Add product with valid data', async ({ request }) => {
  7   |     const payload = {
  8   |       title: 'Test Product',
  9   |       description: 'Test Description',
  10  |       price: 99.99,
  11  |       discountPercentage: 10,
  12  |       rating: 4.5,
  13  |       stock: 100,
  14  |       brand: 'Test Brand',
  15  |       category: 'test-category',
  16  |       thumbnail: 'https://example.com/thumb.jpg',
  17  |       images: ['https://example.com/img1.jpg']
  18  |     };
  19  | 
> 20  |     const response = await request.post(`${BASE_URL}/products/add`, {
      |                                    ^ Error: apiRequestContext.post: getaddrinfo ENOTFOUND api.dummyjson.com
  21  |       data: payload
  22  |     });
  23  | 
  24  |     expect(response.status()).toBe(200);
  25  |     const data = await response.json();
  26  |     expect(data).toHaveProperty('id');
  27  |     expect(data.title).toBe('Test Product');
  28  |     expect(data.price).toBe(99.99);
  29  |   });
  30  | 
  31  |   test('TC-KAN8-POST-002: Add product missing required field', async ({ request }) => {
  32  |     const payload = {
  33  |       description: 'Test Description',
  34  |       price: 99.99
  35  |       // Missing 'title' field
  36  |     };
  37  | 
  38  |     const response = await request.post(`${BASE_URL}/products/add`, {
  39  |       data: payload
  40  |     });
  41  | 
  42  |     // API may return 200 or 400 depending on implementation
  43  |     // For DummyJSON, it typically returns 200 with auto-generated data
  44  |     expect([200, 400]).toContain(response.status());
  45  |   });
  46  | 
  47  |   test('TC-KAN8-POST-003: Add product with invalid price type', async ({ request }) => {
  48  |     const payload = {
  49  |       title: 'Test',
  50  |       price: 'not-a-number'
  51  |     };
  52  | 
  53  |     const response = await request.post(`${BASE_URL}/products/add`, {
  54  |       data: payload
  55  |     });
  56  | 
  57  |     // API may return 200 (with type coercion) or 400 (validation)
  58  |     expect([200, 400]).toContain(response.status());
  59  |   });
  60  | 
  61  |   test('TC-KAN8-POST-004: Create cart with product', async ({ request }) => {
  62  |     const payload = {
  63  |       userId: 1,
  64  |       date: new Date().toISOString().split('T')[0],
  65  |       products: [
  66  |         {
  67  |           productId: 1,
  68  |           quantity: 2
  69  |         }
  70  |       ]
  71  |     };
  72  | 
  73  |     const response = await request.post(`${BASE_URL}/carts/add`, {
  74  |       data: payload
  75  |     });
  76  | 
  77  |     expect(response.status()).toBe(200);
  78  |     const data = await response.json();
  79  |     expect(data).toHaveProperty('id');
  80  |     expect(data.products).toBeDefined();
  81  |   });
  82  | 
  83  |   test('TC-KAN8-POST-005: Create todo item', async ({ request }) => {
  84  |     const payload = {
  85  |       todo: 'Test todo item',
  86  |       completed: false,
  87  |       userId: 1
  88  |     };
  89  | 
  90  |     const response = await request.post(`${BASE_URL}/todos/add`, {
  91  |       data: payload
  92  |     });
  93  | 
  94  |     expect(response.status()).toBe(200);
  95  |     const data = await response.json();
  96  |     expect(data).toHaveProperty('id');
  97  |     expect(data.todo).toBe('Test todo item');
  98  |   });
  99  | 
  100 |   test('TC-KAN8-POST-006: Add multiple products in batch', async ({ request }) => {
  101 |     const payloads = [
  102 |       { title: 'Product 1', price: 100 },
  103 |       { title: 'Product 2', price: 200 }
  104 |     ];
  105 | 
  106 |     for (const payload of payloads) {
  107 |       const response = await request.post(`${BASE_URL}/products/add`, {
  108 |         data: payload
  109 |       });
  110 |       expect(response.status()).toBe(200);
  111 |       const data = await response.json();
  112 |       expect(data).toHaveProperty('id');
  113 |     }
  114 |   });
  115 | });
  116 | 
```