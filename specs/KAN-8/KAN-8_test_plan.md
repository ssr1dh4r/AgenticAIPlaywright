# Test Plan — KAN-8: API DummyJson Validation

**Ticket:** KAN-8  
**Date:** 2026-05-19  
**API Base URL:** https://api.dummyjson.com  
**API Documentation:** https://dummyjson.com/docs  
**Authentication:** None (public endpoints)  
**Framework:** Playwright + TypeScript  

---

## Scope

Comprehensive validation of all public REST API endpoints in DummyJSON service covering:
- POST (Create) operations
- GET (Read) operations  
- PUT (Replace) operations
- PATCH (Update) operations
- DELETE (Remove) operations

All operations tested with mandatory/optional field combinations and parameter validation per Swagger documentation.

---

## Test Environment Setup

| Component | Value |
|-----------|-------|
| Base URL | https://api.dummyjson.com |
| Browser | Chromium (API tests only) |
| Timeout | 5000ms |
| Retry | Max 3 retries on network failures |
| Auth | None |

---

## Acceptance Criteria Mapping

### AC1: Validate POST Calls
- **Endpoint:** POST /products/add, POST /carts/add, POST /auth/login, etc.
- **Test Cases:** 
  - Create with mandatory fields → 200/201
  - Create with optional fields → 200/201
  - Create with missing mandatory → 400
  - Create with invalid field types → 400
  - Verify response includes auto-generated ID
  - Verify response matches Swagger schema

### AC2: Validate GET Calls
- **Endpoint:** GET /products, GET /products/{id}, GET /carts, GET /users/{id}, etc.
- **Test Cases:**
  - Get all resources → 200 (array)
  - Get by valid ID → 200 (object)
  - Get by invalid ID → 404
  - Get with valid query params → 200
  - Get with invalid query params → 400 or 200 (depends on API)
  - Get with pagination → Correct offset/limit behavior
  - Get with sorting → Correct sort order
  - Verify response matches Swagger schema

### AC3: Validate DELETE Calls
- **Endpoint:** DELETE /products/{id}, DELETE /carts/{id}, etc.
- **Test Cases:**
  - Delete existing resource → 200
  - Delete non-existent resource → 404 or 200
  - Delete already deleted resource (idempotency) → 404 or 200
  - Verify deletion actually removes resource
  - Verify response matches Swagger schema

### AC4: Validate PUT Calls
- **Endpoint:** PUT /products/{id}, PUT /carts/{id}, etc.
- **Test Cases:**
  - Update with full replacement → 200
  - Update with mandatory fields → 200
  - Update without mandatory fields → 400
  - Update with invalid types → 400
  - Update non-existent resource → 404
  - Verify full object replacement behavior
  - Verify response matches Swagger schema

### AC5: Validate PATCH Calls
- **Endpoint:** PATCH /products/{id}, PATCH /carts/{id}, etc.
- **Test Cases:**
  - Update with partial fields → 200
  - Update single field → 200
  - Update with invalid types → 400
  - Update non-existent resource → 404
  - Verify partial update (not full replacement)
  - Verify unmodified fields remain unchanged
  - Verify response matches Swagger schema

---

## Test Cases

### Category: GET Operations

#### TC-KAN8-GET-001: Retrieve all products
- **Endpoint:** GET /products
- **Preconditions:** API is available
- **Steps:**
  1. Send GET request to /products
- **Expected:** 
  - Status 200
  - Response is JSON array
  - Each product has: id, title, description, price, discountPercentage, rating, stock, brand, category, thumbnail, images

#### TC-KAN8-GET-002: Retrieve single product by valid ID
- **Endpoint:** GET /products/{id}
- **Preconditions:** Product with id=1 exists
- **Steps:**
  1. Send GET request to /products/1
- **Expected:**
  - Status 200
  - Response has: id, title, description, price, etc.
  - id field equals 1

#### TC-KAN8-GET-003: Retrieve product by invalid ID
- **Endpoint:** GET /products/{id}
- **Preconditions:** ID 99999 does not exist
- **Steps:**
  1. Send GET request to /products/99999
- **Expected:**
  - Status 404
  - Response contains error message

#### TC-KAN8-GET-004: Get products with skip parameter
- **Endpoint:** GET /products?skip=5
- **Preconditions:** API supports skip parameter
- **Steps:**
  1. Send GET to /products?skip=5
- **Expected:**
  - Status 200
  - Results start from 6th product (skip=5)

#### TC-KAN8-GET-005: Get products with limit parameter
- **Endpoint:** GET /products?limit=5
- **Preconditions:** API supports limit parameter
- **Steps:**
  1. Send GET to /products?limit=5
- **Expected:**
  - Status 200
  - Array length ≤ 5

#### TC-KAN8-GET-006: Get all users
- **Endpoint:** GET /users
- **Preconditions:** API is available
- **Steps:**
  1. Send GET to /users
- **Expected:**
  - Status 200
  - Response is JSON array of users

#### TC-KAN8-GET-007: Get single user by ID
- **Endpoint:** GET /users/{id}
- **Preconditions:** User with id=1 exists
- **Steps:**
  1. Send GET to /users/1
- **Expected:**
  - Status 200
  - User object returned

#### TC-KAN8-GET-008: Get all carts
- **Endpoint:** GET /carts
- **Preconditions:** API is available
- **Steps:**
  1. Send GET to /carts
- **Expected:**
  - Status 200
  - Response is array of carts

---

### Category: POST Operations

#### TC-KAN8-POST-001: Add product with valid data
- **Endpoint:** POST /products/add
- **Preconditions:** None
- **Payload:**
  ```json
  {
    "title": "Test Product",
    "description": "Test Description",
    "price": 99.99,
    "discountPercentage": 10,
    "rating": 4.5,
    "stock": 100,
    "brand": "Test Brand",
    "category": "test-category",
    "thumbnail": "https://example.com/thumb.jpg",
    "images": ["https://example.com/img1.jpg"]
  }
  ```
- **Expected:**
  - Status 200
  - Response includes auto-generated id
  - Response echoes all input fields

#### TC-KAN8-POST-002: Add product missing required field
- **Endpoint:** POST /products/add
- **Preconditions:** None
- **Payload:** (Missing 'title')
  ```json
  {
    "description": "Test Description",
    "price": 99.99
  }
  ```
- **Expected:**
  - Status 400
  - Error message indicates missing 'title'

#### TC-KAN8-POST-003: Add product with invalid price type
- **Endpoint:** POST /products/add
- **Preconditions:** None
- **Payload:**
  ```json
  {
    "title": "Test",
    "price": "not-a-number"
  }
  ```
- **Expected:**
  - Status 400
  - Error message indicates invalid price type

#### TC-KAN8-POST-004: Create cart with product
- **Endpoint:** POST /carts/add
- **Preconditions:** Product with id=1 exists
- **Payload:**
  ```json
  {
    "products": [
      {
        "id": 1,
        "quantity": 2
      }
    ]
  }
  ```
- **Expected:**
  - Status 200
  - Cart created with id
  - Products array preserved

---

### Category: PUT Operations

#### TC-KAN8-PUT-001: Update entire product
- **Endpoint:** PUT /products/{id}
- **Preconditions:** Product with id=1 exists
- **Payload:**
  ```json
  {
    "title": "Updated Product",
    "price": 199.99,
    "description": "Updated description"
  }
  ```
- **Expected:**
  - Status 200
  - All fields in payload are updated
  - id remains unchanged

#### TC-KAN8-PUT-002: Update product missing required field
- **Endpoint:** PUT /products/{id}
- **Preconditions:** Product with id=1 exists
- **Payload:**
  ```json
  {
    "price": 199.99
  }
  ```
- **Expected:**
  - Status 400 (or behavior per API spec)
  - Error message or partial update

#### TC-KAN8-PUT-003: Update non-existent product
- **Endpoint:** PUT /products/99999
- **Preconditions:** ID 99999 does not exist
- **Payload:**
  ```json
  {
    "title": "Test"
  }
  ```
- **Expected:**
  - Status 404 or 201 (per API behavior)

---

### Category: PATCH Operations

#### TC-KAN8-PATCH-001: Partially update product (single field)
- **Endpoint:** PATCH /products/{id}
- **Preconditions:** Product with id=1 exists
- **Payload:**
  ```json
  {
    "price": 149.99
  }
  ```
- **Expected:**
  - Status 200
  - Price field updated
  - Other fields remain unchanged

#### TC-KAN8-PATCH-002: Partially update product (multiple fields)
- **Endpoint:** PATCH /products/{id}
- **Preconditions:** Product with id=1 exists
- **Payload:**
  ```json
  {
    "title": "Patched Title",
    "price": 149.99
  }
  ```
- **Expected:**
  - Status 200
  - title and price updated
  - description, brand, etc. unchanged

#### TC-KAN8-PATCH-003: Patch non-existent product
- **Endpoint:** PATCH /products/99999
- **Preconditions:** ID 99999 does not exist
- **Payload:**
  ```json
  {
    "price": 149.99
  }
  ```
- **Expected:**
  - Status 404

#### TC-KAN8-PATCH-004: Patch with invalid field type
- **Endpoint:** PATCH /products/{id}
- **Preconditions:** Product with id=1 exists
- **Payload:**
  ```json
  {
    "price": "invalid"
  }
  ```
- **Expected:**
  - Status 400
  - Error message about invalid type

---

### Category: DELETE Operations

#### TC-KAN8-DELETE-001: Delete existing product
- **Endpoint:** DELETE /products/{id}
- **Preconditions:** Product with id=1 exists
- **Steps:**
  1. Send DELETE to /products/1
- **Expected:**
  - Status 200
  - Response may contain deleted object
  - Subsequent GET /products/1 returns 404

#### TC-KAN8-DELETE-002: Delete non-existent product
- **Endpoint:** DELETE /products/99999
- **Preconditions:** ID 99999 does not exist
- **Steps:**
  1. Send DELETE to /products/99999
- **Expected:**
  - Status 404 or 200 (per API spec)

#### TC-KAN8-DELETE-003: Delete product idempotency
- **Endpoint:** DELETE /products/{id}
- **Preconditions:** Product exists
- **Steps:**
  1. Delete product (first time)
  2. Delete product again
- **Expected:**
  - First DELETE: 200
  - Second DELETE: 404 or 200 (idempotent)

#### TC-KAN8-DELETE-004: Delete cart
- **Endpoint:** DELETE /carts/{id}
- **Preconditions:** Cart with id=1 exists
- **Steps:**
  1. Send DELETE to /carts/1
- **Expected:**
  - Status 200
  - Cart removed

---

## Test Data

### Products
- Use pre-existing products from GET /products (ids 1-30)
- Example: Product 1 = "Essence Mascara Lash Queens"

### Users
- Use pre-existing users from GET /users (ids 1-30)

### Carts
- Create test carts for POST/PATCH/DELETE operations
- Use product ids 1-10 for cart operations

---

## Schema Validation

All responses must validate against DummyJSON Swagger schema for:
- **Required fields:** Present in every response
- **Data types:** Match schema definition (string, number, array, object)
- **Format validation:** URLs, emails, phone numbers format correct

---

## Success Criteria

- ✅ All 50+ test cases created and executing
- ✅ 100% pass rate on happy path scenarios
- ✅ All acceptance criteria covered with tests
- ✅ Schema validation passing for all responses
- ✅ Error handling validated (400, 404, etc.)
- ✅ Tests execute in < 2 minutes
- ✅ No flaky tests (run 3x, all pass)
