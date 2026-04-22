# Risk Assessment — KAN-4

**Ticket**: KAN-4 — New API endpoint validation  
**Date**: 2026-04-22  
**App**: https://api.restful-api.dev (public, no auth required)  
**Tester**: Agentic AI QA

---

## Risk Dimensions

| Dimension | Level | Notes |
|---|---|---|
| **Scope** | MEDIUM | 5 HTTP methods × CRUD on `/objects` resource |
| **Complexity** | LOW | Flexible schema — `data` field is an open JSON object |
| **Dependencies** | LOW | External public API, 99.9% uptime claimed, CORS enabled |
| **Data** | LOW | Shared public dataset; IDs 1–13 pre-seeded; created/deleted objects ephemeral |
| **Coverage** | HIGH | All CRUD methods required with mandatory + optional field combinations |

**Overall Risk: LOW-MEDIUM**

---

## Object Schema (from live API)

```json
{
  "id": "string (auto-assigned)",
  "name": "string (required)",
  "data": "object | null (optional, flexible key-value)"
}
```

Pre-seeded objects: IDs 1–13 (Apple/Google/Samsung devices).

---

## Regression Scenarios

### High Priority
1. **GET all objects** — returns array with expected schema; status 200
2. **GET single object by valid ID** — correct object returned; status 200
3. **POST create object** — response contains auto-assigned ID + echoed body; status 200
4. **PUT full replace** — replaces name + data; response matches sent body; status 200
5. **PATCH partial update** — only updated fields change; others preserved; status 200
6. **DELETE object** — returns success message; subsequent GET returns 404; status 200

### Medium Priority
7. **GET with invalid ID** — returns 404 or appropriate error
8. **DELETE non-existent ID** — returns 404 or appropriate error
9. **POST with data: null** — should still create; `data` field optional
10. **PATCH with subset of fields** — other fields not wiped

### Low Priority
11. **GET multiple objects by query param** (`?id=1&id=2`)
12. **POST then DELETE lifecycle** — full round-trip cleanup
13. **Response Content-Type** — must be `application/json`

---

## Recommendations
- Create test objects via POST, use returned IDs for PUT/PATCH/DELETE to avoid touching pre-seeded data
- Assert response schema strictly: `id`, `name`, `data` always present
- Tests should be idempotent — clean up created records in `afterEach`
