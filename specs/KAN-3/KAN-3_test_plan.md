# KAN-3: EA API Endpoint Validation — Test Plan

## Application Overview

**Application:** GraphQLProductApp v1 (OAS3)  
**Swagger URL:** http://eaapi.somee.com/swagger/index.html  
**Swagger JSON:** http://eaapi.somee.com/swagger/v1/swagger.json  
**Security:** Bearer JWT token via Authorization header  
**Credentials:** Username: `Karthik` / Password: `123456`  
**Auth Endpoint:** POST `/api/Authenticate/Login`

---

## API Inventory

### Authenticate
| Method | Endpoint | Auth Required |
|--------|----------|--------------|
| POST | `/api/Authenticate/Login` | No |
| GET | `/api/Authenticate/Get` | Yes |

### Components
| Method | Endpoint | Auth Required |
|--------|----------|--------------|
| GET | `/Components/GetComponentByProductId/{id}` | Yes |
| GET | `/Components/GetComponentsByProductId/{id}` | Yes |
| POST | `/Components/CreateComponent` | Yes |
| GET | `/Components/GetAllComponents` | Yes |

### Product
| Method | Endpoint | Auth Required |
|--------|----------|--------------|
| GET | `/Product/GetProductById/{id}` | Yes |
| GET | `/Product/GetProductByIdAndName` | Yes |
| GET | `/Product/GetProductByName/{name}` | Yes |
| GET | `/Product/GetProducts` | Yes |
| POST | `/Product/Create` | Yes |
| POST | `/Product` (file upload) | Yes |
| GET | `/Product/{filename}` | Yes |

> **Note:** No DELETE endpoints are present in the Swagger spec despite the ticket mentioning DELETE. Tests will cover all documented endpoints; DELETE coverage is N/A pending clarification.

---

## Schemas

### LoginModel
```json
{ "userName": "string (required)", "password": "string (required)" }
```

### Product
```json
{
  "productId": "integer",
  "name": "string (nullable)",
  "description": "string (nullable)",
  "price": "integer",
  "components": "array<Components> (nullable)",
  "productType": "ProductType enum (0-5)"
}
```

### Components
```json
{
  "id": "integer",
  "name": "string (nullable)",
  "description": "string (nullable)",
  "productId": "integer (nullable)",
  "product": "Product (nullable)"
}
```

### ProductType Enum
`0 | 1 | 2 | 3 | 4 | 5`

---

## Test Scenarios

---

### AC1: Authentication

#### TC-KAN3-AUTH-001 — Successful login with valid credentials
- **Test ID:** TC-KAN3-AUTH-001
- **Title:** Successful login returns a valid JWT token
- **Preconditions:** API is reachable. Username: `Karthik`, Password: `123456`
- **Steps:**
  1. POST `/api/Authenticate/Login` with `{ "userName": "Karthik", "password": "123456" }`
  2. Assert HTTP 200
  3. Assert response body contains a non-empty token string
- **Expected Result:** 200 OK with JWT token in response

#### TC-KAN3-AUTH-002 — Login with invalid password
- **Test ID:** TC-KAN3-AUTH-002
- **Title:** Login fails with wrong password
- **Preconditions:** API is reachable
- **Steps:**
  1. POST `/api/Authenticate/Login` with `{ "userName": "Karthik", "password": "wrongpass" }`
  2. Assert HTTP status is not 200 (expect 400 or 401)
- **Expected Result:** Non-200 response; no token returned

#### TC-KAN3-AUTH-003 — Login with missing username
- **Test ID:** TC-KAN3-AUTH-003
- **Title:** Login fails when username is omitted
- **Steps:**
  1. POST `/api/Authenticate/Login` with `{ "password": "123456" }` (no userName)
  2. Assert HTTP 400
- **Expected Result:** 400 Bad Request

#### TC-KAN3-AUTH-004 — Login with missing password
- **Test ID:** TC-KAN3-AUTH-004
- **Title:** Login fails when password is omitted
- **Steps:**
  1. POST `/api/Authenticate/Login` with `{ "userName": "Karthik" }` (no password)
  2. Assert HTTP 400
- **Expected Result:** 400 Bad Request

#### TC-KAN3-AUTH-005 — GET Authenticate/Get with valid token
- **Test ID:** TC-KAN3-AUTH-005
- **Title:** Authenticated GET returns array of strings
- **Preconditions:** Valid JWT token obtained from TC-KAN3-AUTH-001
- **Steps:**
  1. GET `/api/Authenticate/Get` with Bearer token header
  2. Assert HTTP 200
  3. Assert response is an array of strings
- **Expected Result:** 200 OK, array of strings

#### TC-KAN3-AUTH-006 — GET Authenticate/Get without token
- **Test ID:** TC-KAN3-AUTH-006
- **Title:** Authenticated GET fails without token
- **Steps:**
  1. GET `/api/Authenticate/Get` without Authorization header
  2. Assert HTTP 401
- **Expected Result:** 401 Unauthorized

---

### AC2: Product Endpoints

#### TC-KAN3-PROD-001 — Get all products
- **Test ID:** TC-KAN3-PROD-001
- **Title:** GET /Product/GetProducts returns array of products
- **Preconditions:** Valid token
- **Steps:**
  1. GET `/Product/GetProducts` with Bearer token
  2. Assert HTTP 200
  3. Assert response is an array; each item matches Product schema
- **Expected Result:** 200 OK, array of Product objects

#### TC-KAN3-PROD-002 — Get product by valid ID
- **Test ID:** TC-KAN3-PROD-002
- **Title:** GET /Product/GetProductById/{id} returns matching product
- **Preconditions:** Valid token; at least one product exists
- **Steps:**
  1. GET `/Product/GetProductById/1` with Bearer token
  2. Assert HTTP 200
  3. Assert response matches Product schema with productId = 1
- **Expected Result:** 200 OK, Product object

#### TC-KAN3-PROD-003 — Get product by non-existent ID
- **Test ID:** TC-KAN3-PROD-003
- **Title:** GET /Product/GetProductById/{id} returns 404 for missing product
- **Steps:**
  1. GET `/Product/GetProductById/999999` with Bearer token
  2. Assert HTTP 404
- **Expected Result:** 404 Not Found

#### TC-KAN3-PROD-004 — Get product by ID and name (both params)
- **Test ID:** TC-KAN3-PROD-004
- **Title:** GET /Product/GetProductByIdAndName returns product with valid Id and Name
- **Steps:**
  1. GET `/Product/GetProductByIdAndName?Id=1&Name=<existing_name>` with Bearer token
  2. Assert HTTP 200
  3. Assert productId and name match query params
- **Expected Result:** 200 OK, matching Product

#### TC-KAN3-PROD-005 — Get product by ID and name missing required Name param
- **Test ID:** TC-KAN3-PROD-005
- **Title:** GET /Product/GetProductByIdAndName fails when required Name is missing
- **Steps:**
  1. GET `/Product/GetProductByIdAndName?Id=1` (no Name) with Bearer token
  2. Assert HTTP 400
- **Expected Result:** 400 Bad Request

#### TC-KAN3-PROD-006 — Get product by name
- **Test ID:** TC-KAN3-PROD-006
- **Title:** GET /Product/GetProductByName/{name} returns matching product
- **Steps:**
  1. GET `/Product/GetProductByName/<existing_name>` with Bearer token
  2. Assert HTTP 200
  3. Assert response Product name matches
- **Expected Result:** 200 OK, Product object

#### TC-KAN3-PROD-007 — Create product with all fields (POST /Product/Create)
- **Test ID:** TC-KAN3-PROD-007
- **Title:** POST /Product/Create successfully creates a product with all fields
- **Steps:**
  1. POST `/Product/Create` with valid full Product body
  2. Assert HTTP 200
  3. Assert returned Product has matching fields including productId
- **Expected Result:** 200 OK, created Product object

#### TC-KAN3-PROD-008 — Create product with mandatory fields only
- **Test ID:** TC-KAN3-PROD-008
- **Title:** POST /Product/Create succeeds with only mandatory fields
- **Steps:**
  1. POST `/Product/Create` with `{ "price": 10, "productType": 1 }` (nullable fields omitted)
  2. Assert HTTP 200
- **Expected Result:** 200 OK, Product created

#### TC-KAN3-PROD-009 — Create product with invalid productType
- **Test ID:** TC-KAN3-PROD-009
- **Title:** POST /Product/Create fails with out-of-range productType
- **Steps:**
  1. POST `/Product/Create` with `{ "productType": 99, "price": 10 }`
  2. Assert HTTP 400
- **Expected Result:** 400 Bad Request

#### TC-KAN3-PROD-010 — File upload via POST /Product
- **Test ID:** TC-KAN3-PROD-010
- **Title:** POST /Product uploads a file successfully
- **Steps:**
  1. POST `/Product` with multipart/form-data containing a test file
  2. Assert HTTP 200
- **Expected Result:** 200 OK

#### TC-KAN3-PROD-011 — Download file via GET /Product/{filename}
- **Test ID:** TC-KAN3-PROD-011
- **Title:** GET /Product/{filename} retrieves uploaded file
- **Preconditions:** File uploaded in TC-KAN3-PROD-010
- **Steps:**
  1. GET `/Product/<filename>` with Bearer token
  2. Assert HTTP 200
- **Expected Result:** 200 OK, file content returned

---

### AC3: Components Endpoints

#### TC-KAN3-COMP-001 — Get all components
- **Test ID:** TC-KAN3-COMP-001
- **Title:** GET /Components/GetAllComponents returns array of components
- **Preconditions:** Valid token
- **Steps:**
  1. GET `/Components/GetAllComponents` with Bearer token
  2. Assert HTTP 200
  3. Assert array of Components
- **Expected Result:** 200 OK, array of Components

#### TC-KAN3-COMP-002 — Get component by product ID (singular)
- **Test ID:** TC-KAN3-COMP-002
- **Title:** GET /Components/GetComponentByProductId/{id} returns single component
- **Steps:**
  1. GET `/Components/GetComponentByProductId/1` with Bearer token
  2. Assert HTTP 200
  3. Assert each item has productId = 1
- **Expected Result:** 200 OK, array of Components for that product

#### TC-KAN3-COMP-003 — Get components by product ID (plural)
- **Test ID:** TC-KAN3-COMP-003
- **Title:** GET /Components/GetComponentsByProductId/{id} returns all components for product
- **Steps:**
  1. GET `/Components/GetComponentsByProductId/1` with Bearer token
  2. Assert HTTP 200
  3. Assert all items have productId = 1
- **Expected Result:** 200 OK, array of Components

#### TC-KAN3-COMP-004 — Get components for non-existent product
- **Test ID:** TC-KAN3-COMP-004
- **Title:** GET /Components/GetComponentByProductId/{id} returns empty or 404 for missing product
- **Steps:**
  1. GET `/Components/GetComponentByProductId/999999` with Bearer token
  2. Assert HTTP 200 with empty array OR 404
- **Expected Result:** Empty array or 404

#### TC-KAN3-COMP-005 — Create component with all fields
- **Test ID:** TC-KAN3-COMP-005
- **Title:** POST /Components/CreateComponent successfully creates a component
- **Steps:**
  1. POST `/Components/CreateComponent` with full Components body
  2. Assert HTTP 200
  3. Assert returned Components object has matching fields
- **Expected Result:** 200 OK, created Components object

#### TC-KAN3-COMP-006 — Create component with nullable fields omitted
- **Test ID:** TC-KAN3-COMP-006
- **Title:** POST /Components/CreateComponent succeeds with minimal body
- **Steps:**
  1. POST `/Components/CreateComponent` with `{ "id": 0 }` only
  2. Assert HTTP 200
- **Expected Result:** 200 OK

#### TC-KAN3-COMP-007 — Create component without auth token
- **Test ID:** TC-KAN3-COMP-007
- **Title:** POST /Components/CreateComponent fails without authorization
- **Steps:**
  1. POST `/Components/CreateComponent` without Authorization header
  2. Assert HTTP 401
- **Expected Result:** 401 Unauthorized

---

## Test Execution Order

1. TC-KAN3-AUTH-001 (must pass to get token for all subsequent tests)
2. TC-KAN3-AUTH-002 through TC-KAN3-AUTH-006
3. TC-KAN3-PROD-001 through TC-KAN3-PROD-011
4. TC-KAN3-COMP-001 through TC-KAN3-COMP-007

---

## Test Data

| Variable | Value |
|----------|-------|
| baseURL | `http://eaapi.somee.com` |
| username | `Karthik` |
| password | `123456` |
| validProductId | `1` (or first from GetProducts) |
| invalidProductId | `999999` |

---

## Notes
- No DELETE endpoints are present in the Swagger spec. The ticket mentions DELETE — this should be raised as an open question with the team.
- All endpoints except `/api/Authenticate/Login` require a Bearer JWT token.
- Token must be obtained from POST `/api/Authenticate/Login` before each test suite run.
