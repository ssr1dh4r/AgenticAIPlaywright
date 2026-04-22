# Test Plan — KAN-4: New API Endpoint Validation

**Ticket**: KAN-4  
**Date**: 2026-04-22  
**App**: https://api.restful-api.dev  
**Auth**: None (public endpoints)  
**Base URL**: `https://api.restful-api.dev`

---

## Scope

Validate all public REST API endpoints for the `/objects` resource covering GET, POST, PUT, PATCH and DELETE methods with mandatory and optional field combinations.

---

## Test Cases

### TC-001: GET all objects
- **Endpoint**: GET /objects
- **Preconditions**: API is reachable
- **Steps**: Send GET request to `/objects`
- **Expected**: Status 200; response is JSON array; each item has `id`, `name` fields

### TC-002: GET single object by valid ID
- **Endpoint**: GET /objects/{id}
- **Preconditions**: Object with ID 7 exists (pre-seeded)
- **Steps**: Send GET request to `/objects/7`
- **Expected**: Status 200; response has `id: "7"`, `name: "Apple MacBook Pro 16"`, `data.year: 2019`

### TC-003: GET single object by invalid ID
- **Endpoint**: GET /objects/{id}
- **Preconditions**: ID `99999` does not exist
- **Steps**: Send GET request to `/objects/99999`
- **Expected**: Status 404; error message in response

### TC-004: GET multiple objects by IDs (query params)
- **Endpoint**: GET /objects?id=3&id=5&id=10
- **Preconditions**: IDs 3, 5, 10 exist
- **Steps**: Send GET with multiple `id` query params
- **Expected**: Status 200; array of 3 objects with matching IDs

### TC-005: POST create object — with data
- **Endpoint**: POST /objects
- **Preconditions**: None
- **Steps**: POST `{ "name": "Test Laptop", "data": { "year": 2024, "price": 999.99 } }`
- **Expected**: Status 200; response includes auto-assigned `id`; echoes `name` and `data`

### TC-006: POST create object — without data (optional field omitted)
- **Endpoint**: POST /objects
- **Preconditions**: None
- **Steps**: POST `{ "name": "Minimal Object" }` (no `data` field)
- **Expected**: Status 200; `id` assigned; `data` is `null` or absent

### TC-007: PUT full replace of created object
- **Endpoint**: PUT /objects/{id}
- **Preconditions**: Object created via TC-005
- **Steps**: PUT `{ "name": "Updated Laptop", "data": { "price": 1299.99 } }` to the created ID
- **Expected**: Status 200; response reflects new name and data exactly

### TC-008: PUT with missing optional data field
- **Endpoint**: PUT /objects/{id}
- **Preconditions**: Object created via TC-005
- **Steps**: PUT `{ "name": "Just Name" }` (no data)
- **Expected**: Status 200; `data` becomes null/absent

### TC-009: PATCH partial update — name only
- **Endpoint**: PATCH /objects/{id}
- **Preconditions**: Object created with name and data
- **Steps**: PATCH `{ "name": "Patched Name" }` to created ID
- **Expected**: Status 200; `name` changed; `data` unchanged from original

### TC-010: PATCH partial update — data only
- **Endpoint**: PATCH /objects/{id}
- **Preconditions**: Object created with name and data
- **Steps**: PATCH `{ "data": { "color": "Red" } }` to created ID
- **Expected**: Status 200; `data` updated; `name` unchanged

### TC-011: DELETE created object
- **Endpoint**: DELETE /objects/{id}
- **Preconditions**: Object created and ID known
- **Steps**: DELETE `/objects/{createdId}`
- **Expected**: Status 200; response contains success/deletion confirmation message

### TC-012: DELETE non-existent object
- **Endpoint**: DELETE /objects/{id}
- **Preconditions**: ID `99999` does not exist
- **Steps**: DELETE `/objects/99999`
- **Expected**: Status 404; error message returned

### TC-013: Response Content-Type validation
- **Endpoint**: GET /objects
- **Preconditions**: None
- **Steps**: Send GET, inspect response headers
- **Expected**: `Content-Type` header contains `application/json`

### TC-014: Full lifecycle — POST → GET → PATCH → DELETE
- **Endpoint**: Multiple
- **Preconditions**: None
- **Steps**: 
  1. POST to create
  2. GET to verify
  3. PATCH to update
  4. DELETE to remove
  5. GET to confirm 404
- **Expected**: Each step returns expected status and body

---

## Test Data
- Pre-seeded IDs: 1–13 (use for read-only GET tests)
- Dynamic IDs: Created in test via POST, used for PUT/PATCH/DELETE, cleaned up after

---

## Automation Approach
- Framework: Playwright (TypeScript, APIRequestContext)
- No browser required — pure API calls via `request` fixture
- Tests in `tests/KAN-4/`
- Separate spec file per method group
