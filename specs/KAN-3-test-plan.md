# EA Automation API Endpoint Validation (KAN-3) - Comprehensive Test Plan

## Application Overview

This test plan covers comprehensive API endpoint validation for the EA Automation API. The tests are designed to validate all REST API endpoints including authentication, product management, and component management operations. The API uses bearer token-based authentication and follows RESTful design principles.

**API Base URL:** http://eaapi.somee.com/api
**Documentation:** http://eaapi.somee.com/swagger/index.html
**Authentication:** Bearer Token (JWT format)
**Framework:** Playwright with APIRequestContext and TypeScript

The test coverage includes:
- Happy path scenarios for all endpoints
- Negative scenarios with invalid/missing data
- Edge cases and boundary value testing
- Error handling and HTTP status codes validation
- Response schema and data type validation
- Authentication and authorization testing
- Data integrity verification
- Concurrent request handling
- Query parameter validation
- Bearer token validation and expiration handling

## Test Summary

| AC ID | Title | Test Cases |
|-------|-------|-----------|
| AC1 | Authentication | 8 |
| AC2 | POST Endpoints | 14 |
| AC3 | GET Endpoints | 20 |
| AC4 | Error Handling & Advanced | 30 |
| **TOTAL** | | **72+** |

---

## Test Scenarios

### 1. AC1: Generate Authentication Token

**Seed:** `tests/seed.spec.ts`

#### 1.1. KAN-3-AC1-TC01: Valid credentials generate authentication token

**File:** `tests/KAN-3/authentication.spec.ts`

**Steps:**
  1. Send POST request to /api/Authenticate/Login with valid credentials (username: 'admin', password: 'admin')
    - expect: HTTP Status Code: 200 OK
    - expect: Response contains 'token' field with non-empty string value
    - expect: Token follows JWT format (three parts separated by dots)
    - expect: Response header 'Content-Type' is 'application/json'
    - expect: Response time is less than 2 seconds
  2. Verify the returned token by decoding the JWT
    - expect: Header contains 'alg' and 'typ' fields
    - expect: Payload contains standard claims (exp, iat, etc.)
    - expect: Token is not expired
  3. Use the returned token to make an authenticated API request to GET /api/Authenticate/Get
    - expect: Request succeeds with HTTP Status Code: 200
    - expect: Bearer token in Authorization header is correctly processed

#### 1.2. KAN-3-AC1-TC02: Invalid username returns 401 Unauthorized

**File:** `tests/KAN-3/authentication.spec.ts`

**Steps:**
  1. Send POST request to /api/Authenticate/Login with invalid username ('invaliduser', password: 'admin')
    - expect: HTTP Status Code: 401 Unauthorized
    - expect: Response does not contain 'token' field
    - expect: Response contains error message or error code
    - expect: Response header 'Content-Type' is 'application/json'

#### 1.3. KAN-3-AC1-TC03: Invalid password returns 401 Unauthorized

**File:** `tests/KAN-3/authentication.spec.ts`

**Steps:**
  1. Send POST request to /api/Authenticate/Login with valid username and invalid password ('admin', password: 'wrongpass')
    - expect: HTTP Status Code: 401 Unauthorized
    - expect: Response does not contain 'token' field
    - expect: Response contains error message or error code

#### 1.4. KAN-3-AC1-TC04: Empty credentials returns 400 Bad Request

**File:** `tests/KAN-3/authentication.spec.ts`

**Steps:**
  1. Send POST request to /api/Authenticate/Login with empty username and password
    - expect: HTTP Status Code: 400 Bad Request
    - expect: Response contains validation error message
    - expect: Response indicates 'username/email' and 'password' are required

#### 1.5. KAN-3-AC1-TC05: Missing email field returns 400 Bad Request

**File:** `tests/KAN-3/authentication.spec.ts`

**Steps:**
  1. Send POST request to /api/Authenticate/Login with only password field in body
    - expect: HTTP Status Code: 400 Bad Request
    - expect: Response contains validation error for missing 'username/email' field

#### 1.6. KAN-3-AC1-TC06: Missing password field returns 400 Bad Request

**File:** `tests/KAN-3/authentication.spec.ts`

**Steps:**
  1. Send POST request to /api/Authenticate/Login with only username field in body
    - expect: HTTP Status Code: 400 Bad Request
    - expect: Response contains validation error for missing 'password' field

#### 1.7. KAN-3-AC1-TC07: SQL injection attempt in credentials returns 400 or 401

**File:** `tests/KAN-3/authentication.spec.ts`

**Steps:**
  1. Send POST request with SQL injection payload (username: "' OR '1'='1", password: "' OR '1'='1")
    - expect: HTTP Status Code is 400 or 401 (not 200)
    - expect: Database is not compromised
    - expect: No error details that reveal database structure are returned

#### 1.8. KAN-3-AC1-TC08: Special characters in credentials are handled properly

**File:** `tests/KAN-3/authentication.spec.ts`

**Steps:**
  1. Send POST request with special characters in password field (username: 'admin', password: '!@#$%^&*()')
    - expect: HTTP Status Code: 401 Unauthorized (if password is incorrect)
    - expect: Special characters are properly escaped
    - expect: No server errors occur

### 2. AC2: POST Calls - Component Management

**Seed:** `tests/seed.spec.ts`

#### 2.1. KAN-3-AC2-TC01: Create component with valid data

**File:** `tests/KAN-3/post-endpoints.spec.ts`

**Steps:**
  1. Authenticate and get valid bearer token
    - expect: Token generated successfully
  2. Send POST request to /Components/CreateComponent with valid component data (productId: 1, name: 'TestComponent', description: 'Test')
    - expect: HTTP Status Code: 201 Created or 200 OK
    - expect: Response contains componentId or createdId field
    - expect: Response contains all submitted fields (name, description, productId)
    - expect: Component is stored in database
    - expect: Response time is less than 2 seconds

#### 2.2. KAN-3-AC2-TC02: Create component with missing productId returns 400

**File:** `tests/KAN-3/post-endpoints.spec.ts`

**Steps:**
  1. Send POST request to /Components/CreateComponent without productId field
    - expect: HTTP Status Code: 400 Bad Request
    - expect: Response contains validation error indicating 'productId' is required

#### 2.3. KAN-3-AC2-TC03: Create component with missing name returns 400

**File:** `tests/KAN-3/post-endpoints.spec.ts`

**Steps:**
  1. Send POST request to /Components/CreateComponent without name field
    - expect: HTTP Status Code: 400 Bad Request
    - expect: Response contains validation error indicating 'name' is required

#### 2.4. KAN-3-AC2-TC04: Create component with invalid productId returns 400 or 404

**File:** `tests/KAN-3/post-endpoints.spec.ts`

**Steps:**
  1. Send POST request with non-existent productId (e.g., 999999)
    - expect: HTTP Status Code: 400, 404, or appropriate error code
    - expect: Response contains error message indicating invalid ProductId
    - expect: Component is not created

#### 2.5. KAN-3-AC2-TC05: Create component with empty name returns 400

**File:** `tests/KAN-3/post-endpoints.spec.ts`

**Steps:**
  1. Send POST request with empty string for name field
    - expect: HTTP Status Code: 400 Bad Request
    - expect: Response contains validation error for empty name

#### 2.6. KAN-3-AC2-TC06: Create component with very long name is handled

**File:** `tests/KAN-3/post-endpoints.spec.ts`

**Steps:**
  1. Send POST request with name exceeding max length (e.g., 5000 characters)
    - expect: HTTP Status Code: 400 (if max length enforced) or 201 (if accepted)
    - expect: If accepted: field is truncated or stored correctly
    - expect: If rejected: error message is clear

#### 2.7. KAN-3-AC2-TC07: Create component with special characters in name

**File:** `tests/KAN-3/post-endpoints.spec.ts`

**Steps:**
  1. Send POST request with special characters in name (e.g., '!@#$%Component<>')
    - expect: HTTP Status Code: 201 or 200 (if accepted) or 400 (if rejected)
    - expect: Special characters are properly escaped if stored
    - expect: Data integrity is maintained

#### 2.8. KAN-3-AC2-TC08: Create duplicate component with same name and productId

**File:** `tests/KAN-3/post-endpoints.spec.ts`

**Steps:**
  1. Create first component with specific name and productId
    - expect: First component created successfully (HTTP 201 or 200)
  2. Create second component with identical name and productId
    - expect: HTTP Status Code: 201/200 (if duplicates allowed) or 409 Conflict (if enforced unique constraint)
    - expect: Either duplicate is created or error is returned consistently

### 3. AC2: POST Calls - Product Management

**Seed:** `tests/seed.spec.ts`

#### 3.1. KAN-3-AC2-TC09: Create product with valid data using POST /Product/Create

**File:** `tests/KAN-3/post-endpoints.spec.ts`

**Steps:**
  1. Send POST request to /Product/Create with valid product data (name: 'TestProduct', type: 1, description: 'Test')
    - expect: HTTP Status Code: 201 Created or 200 OK
    - expect: Response contains productId field
    - expect: Response contains all submitted fields
    - expect: Product is stored in database
    - expect: Response time is less than 2 seconds

#### 3.2. KAN-3-AC2-TC10: Create product with missing name returns 400

**File:** `tests/KAN-3/post-endpoints.spec.ts`

**Steps:**
  1. Send POST request to /Product/Create without name field
    - expect: HTTP Status Code: 400 Bad Request
    - expect: Response contains validation error for 'name'

#### 3.3. KAN-3-AC2-TC11: Create product with invalid product type returns 400

**File:** `tests/KAN-3/post-endpoints.spec.ts`

**Steps:**
  1. Send POST request with invalid product type (e.g., type: 9999)
    - expect: HTTP Status Code: 400 Bad Request or 404 Not Found
    - expect: Response contains error message about invalid ProductType

#### 3.4. KAN-3-AC2-TC12: Create product with POST /Product endpoint

**File:** `tests/KAN-3/post-endpoints.spec.ts`

**Steps:**
  1. Send POST request to /Product with valid product data
    - expect: HTTP Status Code: 201 Created or 200 OK
    - expect: Response contains productId or appropriate success indicator
    - expect: Endpoint functions correctly

#### 3.5. KAN-3-AC2-TC13: Create product with empty name returns 400

**File:** `tests/KAN-3/post-endpoints.spec.ts`

**Steps:**
  1. Send POST request with empty string for name
    - expect: HTTP Status Code: 400 Bad Request
    - expect: Validation error is returned

#### 3.6. KAN-3-AC2-TC14: Create product with duplicate name is handled

**File:** `tests/KAN-3/post-endpoints.spec.ts`

**Steps:**
  1. Create first product with specific name
    - expect: Product created successfully
  2. Create second product with same name
    - expect: Either duplicate is allowed or 409 Conflict is returned consistently

### 4. AC3: GET Calls - Authentication & Product Retrieval

**Seed:** `tests/seed.spec.ts`

#### 4.1. KAN-3-AC3-TC01: Get authentication info without token returns 401

**File:** `tests/KAN-3/get-endpoints.spec.ts`

**Steps:**
  1. Send GET request to /api/Authenticate/Get without Authorization header
    - expect: HTTP Status Code: 401 Unauthorized
    - expect: Response contains error message indicating authentication required

#### 4.2. KAN-3-AC3-TC02: Get authentication info with valid token returns 200

**File:** `tests/KAN-3/get-endpoints.spec.ts`

**Steps:**
  1. Generate valid authentication token
    - expect: Token obtained successfully
  2. Send GET request to /api/Authenticate/Get with valid bearer token
    - expect: HTTP Status Code: 200 OK
    - expect: Response contains user information or authentication details
    - expect: Response header 'Content-Type' is 'application/json'

#### 4.3. KAN-3-AC3-TC03: Get authentication info with invalid bearer token returns 401

**File:** `tests/KAN-3/get-endpoints.spec.ts`

**Steps:**
  1. Send GET request to /api/Authenticate/Get with malformed bearer token
    - expect: HTTP Status Code: 401 Unauthorized
    - expect: Invalid token is rejected

#### 4.4. KAN-3-AC3-TC04: Get all products returns 200 with list

**File:** `tests/KAN-3/get-endpoints.spec.ts`

**Steps:**
  1. Send GET request to /Product/GetProducts with valid authentication
    - expect: HTTP Status Code: 200 OK
    - expect: Response is an array of product objects
    - expect: Each product contains expected fields (productId, name, type, description)
    - expect: Response time is less than 3 seconds

#### 4.5. KAN-3-AC3-TC05: Get all products returns 401 without token

**File:** `tests/KAN-3/get-endpoints.spec.ts`

**Steps:**
  1. Send GET request to /Product/GetProducts without authentication
    - expect: HTTP Status Code: 401 Unauthorized

#### 4.6. KAN-3-AC3-TC06: Get product by valid ID returns 200

**File:** `tests/KAN-3/get-endpoints.spec.ts`

**Steps:**
  1. Send GET request to /Product/GetProductById/1 with valid authentication
    - expect: HTTP Status Code: 200 OK
    - expect: Response is a single product object
    - expect: Product ID matches requested ID
    - expect: Response contains all product fields

#### 4.7. KAN-3-AC3-TC07: Get product by invalid ID returns 404

**File:** `tests/KAN-3/get-endpoints.spec.ts`

**Steps:**
  1. Send GET request to /Product/GetProductById/999999
    - expect: HTTP Status Code: 404 Not Found
    - expect: Response contains appropriate error message

#### 4.8. KAN-3-AC3-TC08: Get product by non-numeric ID returns 400

**File:** `tests/KAN-3/get-endpoints.spec.ts`

**Steps:**
  1. Send GET request to /Product/GetProductById/invalid with non-numeric ID
    - expect: HTTP Status Code: 400 Bad Request
    - expect: Response indicates invalid ID format

#### 4.9. KAN-3-AC3-TC09: Get product by name returns matching products

**File:** `tests/KAN-3/get-endpoints.spec.ts`

**Steps:**
  1. Send GET request to /Product/GetProductByName/TestProduct (replacing with existing product name)
    - expect: HTTP Status Code: 200 OK
    - expect: Response contains product(s) matching the name
    - expect: Product name matches search criteria

#### 4.10. KAN-3-AC3-TC10: Get product by non-existent name returns 404 or empty list

**File:** `tests/KAN-3/get-endpoints.spec.ts`

**Steps:**
  1. Send GET request to /Product/GetProductByName/NonExistentProductXYZ
    - expect: HTTP Status Code: 200 OK with empty list or 404 Not Found
    - expect: Consistent behavior for non-existent products

### 5. AC3: GET Calls - Components & Advanced Filtering

**Seed:** `tests/seed.spec.ts`

#### 5.1. KAN-3-AC3-TC11: Get all components returns list

**File:** `tests/KAN-3/get-endpoints.spec.ts`

**Steps:**
  1. Send GET request to /Components/GetAllComponents with valid authentication
    - expect: HTTP Status Code: 200 OK
    - expect: Response is an array of component objects
    - expect: Each component contains expected fields (componentId, name, productId, description)
    - expect: Response time is less than 3 seconds

#### 5.2. KAN-3-AC3-TC12: Get all components without token returns 401

**File:** `tests/KAN-3/get-endpoints.spec.ts`

**Steps:**
  1. Send GET request to /Components/GetAllComponents without bearer token
    - expect: HTTP Status Code: 401 Unauthorized

#### 5.3. KAN-3-AC3-TC13: Get components by valid ProductId returns list

**File:** `tests/KAN-3/get-endpoints.spec.ts`

**Steps:**
  1. Send GET request to /Components/GetComponentsByProductId/1
    - expect: HTTP Status Code: 200 OK
    - expect: Response is an array of component objects
    - expect: All components belong to requested ProductId
    - expect: Response time is less than 2 seconds

#### 5.4. KAN-3-AC3-TC14: Get components by invalid ProductId returns 404 or empty

**File:** `tests/KAN-3/get-endpoints.spec.ts`

**Steps:**
  1. Send GET request to /Components/GetComponentsByProductId/999999
    - expect: HTTP Status Code: 200 OK with empty list or 404 Not Found
    - expect: Consistent behavior for non-existent products

#### 5.5. KAN-3-AC3-TC15: Get single component by ProductId returns component

**File:** `tests/KAN-3/get-endpoints.spec.ts`

**Steps:**
  1. Send GET request to /Components/GetComponentByProductId/1
    - expect: HTTP Status Code: 200 OK
    - expect: Response is a single component object (or first matching component)
    - expect: Component belongs to requested ProductId

#### 5.6. KAN-3-AC3-TC16: Get product by ID and name returns matching product

**File:** `tests/KAN-3/get-endpoints.spec.ts`

**Steps:**
  1. Send GET request to /Product/GetProductByIdAndName with id and name query parameters
    - expect: HTTP Status Code: 200 OK
    - expect: Response contains product matching both ID and name
    - expect: Product details are complete

#### 5.7. KAN-3-AC3-TC17: Get product by ID and name with mismatched values returns 404

**File:** `tests/KAN-3/get-endpoints.spec.ts`

**Steps:**
  1. Send GET request with ID and name that don't match same product
    - expect: HTTP Status Code: 404 Not Found
    - expect: Appropriate error message is returned

#### 5.8. KAN-3-AC3-TC18: Get product file by filename

**File:** `tests/KAN-3/get-endpoints.spec.ts`

**Steps:**
  1. Send GET request to /Product/{filename} with existing filename
    - expect: HTTP Status Code: 200 OK
    - expect: File is returned or appropriate response
    - expect: Content-Type header is set correctly

#### 5.9. KAN-3-AC3-TC19: Get non-existent product file returns 404

**File:** `tests/KAN-3/get-endpoints.spec.ts`

**Steps:**
  1. Send GET request to /Product/nonexistentfile.pdf
    - expect: HTTP Status Code: 404 Not Found
    - expect: Error message indicates file not found

#### 5.10. KAN-3-AC3-TC20: GET request with query parameters is handled

**File:** `tests/KAN-3/get-endpoints.spec.ts`

**Steps:**
  1. Send GET request with multiple query parameters (e.g., pagination, filtering)
    - expect: HTTP Status Code: 200 OK (if parameters valid) or 400 (if invalid)
    - expect: Response is filtered/paginated according to parameters
    - expect: Documents support for query parameter handling

### 6. AC4: Error Handling & Edge Cases

**Seed:** `tests/seed.spec.ts`

#### 6.1. KAN-3-AC4-TC01: Invalid HTTP method on endpoint returns 405

**File:** `tests/KAN-3/error-handling.spec.ts`

**Steps:**
  1. Send PUT request to /Product/GetProducts (which only supports GET)
    - expect: HTTP Status Code: 405 Method Not Allowed
    - expect: Response indicates supported methods

#### 6.2. KAN-3-AC4-TC02: Malformed JSON body returns 400

**File:** `tests/KAN-3/error-handling.spec.ts`

**Steps:**
  1. Send POST request to /Components/CreateComponent with malformed JSON body
    - expect: HTTP Status Code: 400 Bad Request
    - expect: Response contains error about invalid JSON format

#### 6.3. KAN-3-AC4-TC03: Missing Content-Type header in POST returns appropriate error

**File:** `tests/KAN-3/error-handling.spec.ts`

**Steps:**
  1. Send POST request without Content-Type header
    - expect: Either 400 Bad Request or request is processed
    - expect: Consistent behavior documented

#### 6.4. KAN-3-AC4-TC04: Expired bearer token returns 401

**File:** `tests/KAN-3/error-handling.spec.ts`

**Steps:**
  1. Generate token and wait for expiration (or use manually expired token)
    - expect: HTTP Status Code: 401 Unauthorized
    - expect: Response indicates token is expired

#### 6.5. KAN-3-AC4-TC05: Bearer token with wrong signature returns 401

**File:** `tests/KAN-3/error-handling.spec.ts`

**Steps:**
  1. Modify valid bearer token and send request
    - expect: HTTP Status Code: 401 Unauthorized
    - expect: Tampered token is detected and rejected

#### 6.6. KAN-3-AC4-TC06: Response status code validation for successful create

**File:** `tests/KAN-3/error-handling.spec.ts`

**Steps:**
  1. Create new product/component and validate response
    - expect: HTTP Status Code: 200 OK or 201 Created (consistent)
    - expect: Location header is present if 201 is returned
    - expect: Response body contains created resource

#### 6.7. KAN-3-AC4-TC07: Response header validation for all requests

**File:** `tests/KAN-3/error-handling.spec.ts`

**Steps:**
  1. Send request and validate all response headers
    - expect: Content-Type is 'application/json' or appropriate MIME type
    - expect: Content-Length header is present
    - expect: Cache-Control header is appropriate
    - expect: Security headers are present (if configured)

#### 6.8. KAN-3-AC4-TC08: Large payload handling in POST request

**File:** `tests/KAN-3/error-handling.spec.ts`

**Steps:**
  1. Send POST request with very large description field (e.g., 10MB)
    - expect: Either 413 Payload Too Large or request is processed
    - expect: Server doesn't crash or timeout
    - expect: Appropriate error message if rejected

#### 6.9. KAN-3-AC4-TC09: Numeric boundary values in request

**File:** `tests/KAN-3/error-handling.spec.ts`

**Steps:**
  1. Send request with boundary numeric values (e.g., ID: -1, 0, max int)
    - expect: Requests are processed consistently
    - expect: Invalid values return appropriate error codes

#### 6.10. KAN-3-AC4-TC10: CORS headers are present in response

**File:** `tests/KAN-3/error-handling.spec.ts`

**Steps:**
  1. Send request and check CORS headers
    - expect: Access-Control-Allow-Origin header is present
    - expect: CORS policy is properly configured

### 7. AC4: Concurrent Requests & Data Integrity

**Seed:** `tests/seed.spec.ts`

#### 7.1. KAN-3-AC4-TC11: Concurrent product creation handles race conditions

**File:** `tests/KAN-3/concurrency.spec.ts`

**Steps:**
  1. Send 5 concurrent POST requests to create products simultaneously
    - expect: All requests succeed with appropriate status codes
    - expect: Each product is assigned unique ID
    - expect: No data corruption occurs
    - expect: Database maintains consistency

#### 7.2. KAN-3-AC4-TC12: Concurrent component creation maintains data integrity

**File:** `tests/KAN-3/concurrency.spec.ts`

**Steps:**
  1. Send 5 concurrent POST requests to create components for same product
    - expect: All components are created successfully
    - expect: Each component has unique ID
    - expect: No duplicate or lost data
    - expect: Product relationship is maintained

#### 7.3. KAN-3-AC4-TC13: Concurrent read and write operations are handled

**File:** `tests/KAN-3/concurrency.spec.ts`

**Steps:**
  1. While creating product, simultaneously read all products
    - expect: Both operations complete successfully
    - expect: Newly created product appears in subsequent reads
    - expect: No stale data is returned

#### 7.4. KAN-3-AC4-TC14: Data persists after create operation

**File:** `tests/KAN-3/data-integrity.spec.ts`

**Steps:**
  1. Create product with specific data
    - expect: Product created successfully with HTTP 200/201
  2. Retrieve same product by ID
    - expect: All data is returned exactly as submitted
    - expect: No data loss or corruption

#### 7.5. KAN-3-AC4-TC15: Component data persists and links to product

**File:** `tests/KAN-3/data-integrity.spec.ts`

**Steps:**
  1. Create component linked to specific product
    - expect: Component created successfully
  2. Retrieve components by product ID
    - expect: Created component appears in results
    - expect: ComponentId matches created component
    - expect: ProductId reference is correct

#### 7.6. KAN-3-AC4-TC16: Verify response schema matches documentation

**File:** `tests/KAN-3/schema-validation.spec.ts`

**Steps:**
  1. Send request to each endpoint and validate response against schemas
    - expect: Response contains all required fields
    - expect: Field data types match schema definition
    - expect: No additional unexpected fields
    - expect: Schema validation passes

#### 7.7. KAN-3-AC4-TC17: Pagination/filtering with multiple query parameters

**File:** `tests/KAN-3/query-parameters.spec.ts`

**Steps:**
  1. Send GET request with pagination parameters (skip, take) or filter params
    - expect: HTTP Status Code: 200 OK
    - expect: Results are paginated/filtered correctly
    - expect: Total count indicates correct dataset size

#### 7.8. KAN-3-AC4-TC18: Invalid query parameter values return 400

**File:** `tests/KAN-3/query-parameters.spec.ts`

**Steps:**
  1. Send GET request with invalid parameter values (e.g., skip: 'abc', take: -1)
    - expect: HTTP Status Code: 400 Bad Request
    - expect: Error message indicates invalid parameter
    - expect: Valid default or error handling applied

#### 7.9. KAN-3-AC4-TC19: Case sensitivity in string parameters is handled

**File:** `tests/KAN-3/query-parameters.spec.ts`

**Steps:**
  1. Search for product by name with different case variations
    - expect: Results are consistent (either case-sensitive or case-insensitive documented)
    - expect: Expected results are returned

#### 7.10. KAN-3-AC4-TC20: Special characters in query parameters are properly encoded

**File:** `tests/KAN-3/query-parameters.spec.ts`

**Steps:**
  1. Search with special characters in name parameter (e.g., '&', '%', '#')
    - expect: Special chars are properly URL encoded
    - expect: Search results are accurate
    - expect: No parsing errors occur

### 8. AC4: Response Validation & Additional Coverage

**Seed:** `tests/seed.spec.ts`

#### 8.1. KAN-3-AC4-TC21: Bearer token is validated in Authorization header

**File:** `tests/KAN-3/authentication-advanced.spec.ts`

**Steps:**
  1. Send request with properly formatted bearer token
    - expect: Request is authenticated and authorized
    - expect: No 401 error is returned

#### 8.2. KAN-3-AC4-TC22: Bearer token without 'Bearer' prefix returns 401

**File:** `tests/KAN-3/authentication-advanced.spec.ts`

**Steps:**
  1. Send request with token only (missing 'Bearer' prefix)
    - expect: HTTP Status Code: 401 Unauthorized
    - expect: Token format is validated

#### 8.3. KAN-3-AC4-TC23: Multiple Authorization headers behavior

**File:** `tests/KAN-3/authentication-advanced.spec.ts`

**Steps:**
  1. Send request with multiple Authorization headers
    - expect: Either first header is used, last is used, or 400 Bad Request
    - expect: Behavior is documented and consistent

#### 8.4. KAN-3-AC4-TC24: Response time meets performance requirements

**File:** `tests/KAN-3/performance.spec.ts`

**Steps:**
  1. Measure response time for GET requests to all endpoints
    - expect: Response time for simple GET endpoints < 1 second
    - expect: Response time for list endpoints < 3 seconds
    - expect: Response time for POST endpoints < 2 seconds

#### 8.5. KAN-3-AC4-TC25: Empty array is returned when no results match

**File:** `tests/KAN-3/response-validation.spec.ts`

**Steps:**
  1. Query for products/components that don't exist
    - expect: HTTP Status Code: 200 OK
    - expect: Response is empty array [] (not null)
    - expect: Array structure is valid

#### 8.6. KAN-3-AC4-TC26: Consistent date/time format in responses

**File:** `tests/KAN-3/response-validation.spec.ts`

**Steps:**
  1. Check date/time fields in all responses (if present)
    - expect: All timestamps use consistent format (ISO 8601 recommended)
    - expect: Timezone information is included
    - expect: Dates are parseable

#### 8.7. KAN-3-AC4-TC27: Null vs empty string handling in responses

**File:** `tests/KAN-3/response-validation.spec.ts`

**Steps:**
  1. Create entities with optional fields and check response
    - expect: Optional empty fields are consistently handled (either null or empty string)
    - expect: Behavior is documented and consistent

#### 8.8. KAN-3-AC4-TC28: Numeric precision in response values

**File:** `tests/KAN-3/response-validation.spec.ts`

**Steps:**
  1. Retrieve numeric values and verify precision
    - expect: Prices/decimals maintain correct decimal places
    - expect: IDs are returned as integers
    - expect: No rounding errors occur

#### 8.9. KAN-3-AC4-TC29: Unicode and non-ASCII characters are handled

**File:** `tests/KAN-3/internationalization.spec.ts`

**Steps:**
  1. Create product with non-ASCII characters (e.g., Chinese, Arabic, emoji)
    - expect: Characters are properly stored and retrieved
    - expect: No encoding issues occur
    - expect: Response is valid UTF-8

#### 8.10. KAN-3-AC4-TC30: Server error responses have appropriate structure

**File:** `tests/KAN-3/error-handling.spec.ts`

**Steps:**
  1. Trigger server error conditions (if possible) and check response
    - expect: HTTP Status Code: 500 Internal Server Error (when applicable)
    - expect: Response contains error message
    - expect: No sensitive information is exposed

---

## Test Data Requirements

### Authentication Credentials
- Valid: username: 'admin', password: 'admin'
- Invalid: Various combinations of wrong credentials

### API Endpoints Summary
- POST /api/Authenticate/Login - Get bearer token
- GET /api/Authenticate/Get - Verify authentication
- POST /Components/CreateComponent - Create component
- GET /Components/GetAllComponents - Get all components
- GET /Components/GetComponentsByProductId/{id} - Get components by product
- POST /Product/Create - Create product
- GET /Product/GetProducts - Get all products
- GET /Product/GetProductById/{id} - Get product by ID
- GET /Product/GetProductByName/{name} - Get product by name

### Test Data Categories
- Valid data: Standard products, components, user data
- Invalid data: Non-existent IDs, wrong credentials, malformed JSON
- Edge cases: Empty strings, very long strings, special characters, boundary values
- Security: SQL injection attempts, token tampering, authorization tests

---

## Success Criteria

- All 72+ test cases execute
- Minimum 90% pass rate expected
- API response times within acceptable limits
- No data corruption or loss
- Proper error handling and messages

---

**Test Plan Created**: April 11, 2026  
**Version**: 1.0  
**Status**: Ready for Automation Implementation
