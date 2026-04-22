# Exploratory Testing Notes — KAN-4

**Date**: 2026-04-22  
**Tester**: Agentic AI QA  
**App**: https://api.restful-api.dev  
**Base API URL**: https://api.restful-api.dev

---

## Exploratory Session Summary

All public endpoints on `/objects` were probed using live HTTP calls via Playwright browser fetch.

---

## Findings

### GET /objects
- **Status**: 200 ✅
- **Response**: JSON array of 13 pre-seeded objects
- **Schema per item**: `{ id: string, name: string, data: object | null }`
- **Note**: `data` field is flexible — no fixed keys, can be null

### GET /objects/{id} — valid ID (7)
- **Status**: 200 ✅
- **Response**: `{ "id": "7", "name": "Apple MacBook Pro 16", "data": { "year": 2019, "price": 1849.99, "CPU model": "Intel Core i9", "Hard disk size": "1 TB" } }`

### GET /objects/{id} — invalid ID (99999)
- **Status**: 404 ✅
- **Response**: `{ "error": "Object with id=99999 was not found." }`

### POST /objects
- **Status**: 200 ✅ (not 201 — notable)
- **Request**: `{ "name": "Test Laptop KAN4", "data": { "year": 2024, "price": 999.99 } }`
- **Response**: `{ "id": "ff8081819d82fab6019db4d3c6f43a29", "name": "Test Laptop KAN4", "createdAt": 1776855271156, "data": { "year": 2024, "price": 999.99 } }`
- **Note**: ID is a UUID-like hex string. Response includes `createdAt` timestamp.

### PUT /objects/{id}
- **Status**: 200 ✅
- **Request**: `{ "name": "Replaced Laptop KAN4", "data": { "price": 1299.99 } }`
- **Response**: `{ "id": "...", "name": "Replaced Laptop KAN4", "updatedAt": 1776855280820, "data": { "price": 1299.99 } }`
- **Note**: Response includes `updatedAt` timestamp. Full replacement confirmed.

### PATCH /objects/{id}
- **Status**: 200 ✅
- **Request**: `{ "name": "Patched Name KAN4" }`
- **Response**: `{ "id": "...", "name": "Patched Name KAN4", "updatedAt": 1776855281117, "data": { "price": 1299.99 } }`
- **Note**: Only `name` changed; `data` preserved from previous PUT. Partial update confirmed.

### DELETE /objects/{id}
- **Status**: 200 ✅
- **Response**: `{ "message": "Object with id = ff8081819d82fab6019db4d3c6f43a29 has been deleted." }`
- **Note**: Returns descriptive message string, not empty body.

### GET /objects/{id} after DELETE
- **Status**: 404 ✅
- **Response**: `{ "error": "Object with id=ff8081819d82fab6019db4d3c6f43a29 was not found." }`

---

## Key Observations for Test Automation

| Behaviour | Detail |
|---|---|
| POST success status | **200** (not 201) |
| PUT success status | **200** |
| PATCH success status | **200** |
| DELETE success status | **200** |
| GET invalid ID status | **404** with `{ "error": "..." }` |
| DELETE non-existent status | **404** (confirmed by schema) |
| POST response extra fields | `createdAt` timestamp |
| PUT/PATCH response extra fields | `updatedAt` timestamp |
| DELETE response body | `{ "message": "Object with id = {id} has been deleted." }` — note space after `=` |
| ID format | Long hex string (UUID-like) |
| `data` field | Flexible JSON object; keys are free-form strings |

---

## Defects / Observations

- **OBS-1**: POST returns **200** instead of the conventional **201 Created**. This is by design for this public API but worth noting.
- **OBS-2**: DELETE response message has inconsistent spacing: `"id = {id}"` (space around `=`) vs error messages using `"id={id}"` (no space). Not a functional bug but cosmetic inconsistency.
- No authentication issues — all public endpoints responded correctly.
- No CORS errors observed.

---

## Bugs Found

None — all endpoints functional and returning expected data.
