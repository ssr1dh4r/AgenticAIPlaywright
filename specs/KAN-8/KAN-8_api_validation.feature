Feature: DummyJSON API Validation - Complete REST API Testing

  Background:
    Given the DummyJSON API is available at "https://api.dummyjson.com"
    And the base timeout is set to 5000 milliseconds
    And all responses are validated against Swagger schema

  # AC1: Validate POST Calls
  Feature: POST Endpoint Validation

    Scenario: Create product with all mandatory fields
      Given I prepare a POST request to "/products/add"
      When I send the request with payload containing: title, description, price, brand, category
      Then the response status should be 200
      And the response should contain an auto-generated id
      And the response should echo all input fields
      And the response should match the Product schema

    Scenario: Create product missing mandatory field
      Given I prepare a POST request to "/products/add"
      When I send the request with payload missing the "title" field
      Then the response status should be 400
      And the response should contain an error message indicating "title is required"

    Scenario: Create product with invalid field type
      Given I prepare a POST request to "/products/add"
      When I send the request with payload where "price" is a string instead of number
      Then the response status should be 400
      And the response should contain type mismatch error

    Scenario: Create cart with valid products
      Given I prepare a POST request to "/carts/add"
      When I send the request with payload containing products array with valid product ids
      Then the response status should be 200
      And the response should contain a cart id
      And the products array should be preserved

  # AC2: Validate GET Calls
  Feature: GET Endpoint Validation

    Scenario: Retrieve all products
      Given I prepare a GET request to "/products"
      When I send the request
      Then the response status should be 200
      And the response should be a JSON array
      And each product should have mandatory fields: id, title, description, price
      And the response should match the Products schema

    Scenario: Retrieve product by valid ID
      Given I prepare a GET request to "/products/1"
      When I send the request
      Then the response status should be 200
      And the response should contain a product object
      And the id field should equal 1
      And the response should match the Product schema

    Scenario: Retrieve product by invalid ID
      Given I prepare a GET request to "/products/99999"
      When I send the request
      Then the response status should be 404
      And the response should contain an error message

    Scenario: Get products with skip parameter
      Given I prepare a GET request to "/products" with query parameter "skip=5"
      When I send the request
      Then the response status should be 200
      And the first product id should be >= 6 (accounting for skip=5)
      And the response should match the Products schema

    Scenario: Get products with limit parameter
      Given I prepare a GET request to "/products" with query parameter "limit=5"
      When I send the request
      Then the response status should be 200
      And the response array length should be <= 5
      And the response should match the Products schema

    Scenario: Retrieve all users
      Given I prepare a GET request to "/users"
      When I send the request
      Then the response status should be 200
      And the response should be a JSON array
      And each user should have mandatory fields: id, username, email, firstName, lastName
      And the response should match the Users schema

    Scenario: Retrieve user by valid ID
      Given I prepare a GET request to "/users/1"
      When I send the request
      Then the response status should be 200
      And the user id should equal 1
      And the response should match the User schema

    Scenario: Retrieve all carts
      Given I prepare a GET request to "/carts"
      When I send the request
      Then the response status should be 200
      And the response should be a JSON array of cart objects
      And the response should match the Carts schema

  # AC3: Validate DELETE Calls
  Feature: DELETE Endpoint Validation

    Scenario: Delete existing product
      Given a product with id 1 exists
      When I send a DELETE request to "/products/1"
      Then the response status should be 200
      And a subsequent GET request to "/products/1" should return 404

    Scenario: Delete non-existent product
      Given product id 99999 does not exist
      When I send a DELETE request to "/products/99999"
      Then the response status should be 404

    Scenario: Delete product idempotency
      Given a product exists with id 10
      When I send the first DELETE request to "/products/10"
      Then the response status should be 200
      And when I send a second DELETE request to "/products/10"
      Then the response status should be 404 or 200 (idempotent behavior)

    Scenario: Delete cart
      Given a cart with id 1 exists
      When I send a DELETE request to "/carts/1"
      Then the response status should be 200
      And a subsequent GET request to "/carts/1" should return 404

  # AC4: Validate PUT Calls
  Feature: PUT Endpoint Validation

    Scenario: Update entire product
      Given I prepare a PUT request to "/products/1"
      When I send the request with payload: title="Updated", price=199.99
      Then the response status should be 200
      And the response title field should equal "Updated"
      And the response price field should equal 199.99
      And the response id should still be 1
      And the response should match the Product schema

    Scenario: Update product missing mandatory field
      Given I prepare a PUT request to "/products/1"
      When I send the request with incomplete payload missing mandatory fields
      Then the response status should be 400
      And the response should contain error message

    Scenario: Update non-existent product
      Given product id 99999 does not exist
      When I send a PUT request to "/products/99999" with valid payload
      Then the response status should be 404 or 201 (per API behavior)

    Scenario: Validate full replacement semantics for PUT
      Given a product exists with fields: title, description, price, brand, category
      When I send a PUT request with only title field
      Then the other fields should either be cleared or API should reject incomplete payload

  # AC5: Validate PATCH Calls
  Feature: PATCH Endpoint Validation

    Scenario: Partially update product - single field
      Given a product with id 1 exists with price=100
      When I send a PATCH request to "/products/1" with payload: price=149.99
      Then the response status should be 200
      And the response price field should equal 149.99
      And other fields (title, description, etc.) should remain unchanged
      And the response should match the Product schema

    Scenario: Partially update product - multiple fields
      Given a product with id 1 exists
      When I send a PATCH request with payload: title="New Title", price=149.99
      Then the response status should be 200
      And the response title should be "New Title"
      And the response price should be 149.99
      And other fields should remain unchanged

    Scenario: Patch non-existent product
      Given product id 99999 does not exist
      When I send a PATCH request to "/products/99999" with payload: price=149.99
      Then the response status should be 404

    Scenario: Patch with invalid field type
      Given a product with id 1 exists
      When I send a PATCH request with payload: price="invalid-string"
      Then the response status should be 400
      And the response should contain type validation error

    Scenario: Verify partial update semantics
      Given a product with multiple fields set
      When I send a PATCH to update a single nested field
      Then only that field should be updated
      And all other fields should remain exactly as they were

  # Cross-cutting Concerns
  Feature: API Robustness and Error Handling

    Scenario: Handle API timeout gracefully
      Given the API request timeout is 5 seconds
      When the API takes longer than timeout to respond
      Then the test should fail with timeout error
      And the error should be distinguishable from other errors

    Scenario: Validate response headers
      Given any API response
      Then the response should contain "Content-Type: application/json"
      And the response should contain proper HTTP status code
      And response headers should not expose sensitive information

    Scenario: Validate no unexpected fields in response
      Given any API response
      Then the response should only contain fields defined in Swagger schema
      And no additional debug/internal fields should be exposed
      And all required fields per schema should be present

    Scenario: Consistent response format
      Given multiple API endpoints
      When I call different endpoints
      Then all responses should use consistent JSON structure
      And error responses should follow consistent error format
      And all responses should be valid JSON
