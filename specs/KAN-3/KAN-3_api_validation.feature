Feature: KAN-3 EA API Endpoint Validation

  Background:
    Given the API base URL is "http://eaapi.somee.com"

  # -----------------------------------------------
  # AC1: Authentication
  # -----------------------------------------------

  @auth @smoke
  Scenario: TC-KAN3-AUTH-001 Successful login returns a valid JWT token
    When I POST "/api/Authenticate/Login" with body:
      | userName | Karthik |
      | password | 123456  |
    Then the response status is 200
    And the response body contains a non-empty token string

  @auth @negative
  Scenario: TC-KAN3-AUTH-002 Login fails with wrong password
    When I POST "/api/Authenticate/Login" with body:
      | userName | Karthik   |
      | password | wrongpass |
    Then the response status is not 200

  @auth @negative
  Scenario: TC-KAN3-AUTH-003 Login fails when username is omitted
    When I POST "/api/Authenticate/Login" with body:
      | password | 123456 |
    Then the response status is 400

  @auth @negative
  Scenario: TC-KAN3-AUTH-004 Login fails when password is omitted
    When I POST "/api/Authenticate/Login" with body:
      | userName | Karthik |
    Then the response status is 400

  @auth @get
  Scenario: TC-KAN3-AUTH-005 Authenticated GET returns array of strings
    Given I have a valid JWT token
    When I GET "/api/Authenticate/Get" with Bearer token
    Then the response status is 200
    And the response body is an array of strings

  @auth @negative
  Scenario: TC-KAN3-AUTH-006 GET Authenticate/Get fails without token
    When I GET "/api/Authenticate/Get" without Authorization header
    Then the response status is 401

  # -----------------------------------------------
  # AC2: Product Endpoints
  # -----------------------------------------------

  @product @get @smoke
  Scenario: TC-KAN3-PROD-001 GET GetProducts returns array of products
    Given I have a valid JWT token
    When I GET "/Product/GetProducts" with Bearer token
    Then the response status is 200
    And the response body is an array matching the Product schema

  @product @get
  Scenario: TC-KAN3-PROD-002 GET GetProductById with valid ID returns matching product
    Given I have a valid JWT token
    When I GET "/Product/GetProductById/1" with Bearer token
    Then the response status is 200
    And the response body matches the Product schema
    And the product's productId is 1

  @product @get @negative
  Scenario: TC-KAN3-PROD-003 GET GetProductById with non-existent ID returns 404
    Given I have a valid JWT token
    When I GET "/Product/GetProductById/999999" with Bearer token
    Then the response status is 404

  @product @get
  Scenario: TC-KAN3-PROD-004 GET GetProductByIdAndName with valid Id and Name
    Given I have a valid JWT token
    When I GET "/Product/GetProductByIdAndName" with query params:
      | Id   | 1               |
      | Name | <existing_name> |
    Then the response status is 200
    And the response body matches the Product schema

  @product @get @negative
  Scenario: TC-KAN3-PROD-005 GET GetProductByIdAndName missing required Name param returns 400
    Given I have a valid JWT token
    When I GET "/Product/GetProductByIdAndName" with query params:
      | Id | 1 |
    Then the response status is 400

  @product @get
  Scenario: TC-KAN3-PROD-006 GET GetProductByName returns matching product
    Given I have a valid JWT token
    When I GET "/Product/GetProductByName/Test" with Bearer token
    Then the response status is 200
    And the response body matches the Product schema

  @product @post @smoke
  Scenario: TC-KAN3-PROD-007 POST Create product with all fields
    Given I have a valid JWT token
    When I POST "/Product/Create" with Bearer token and body:
      | productId   | 0           |
      | name        | TestProduct |
      | description | A test item |
      | price       | 99          |
      | productType | 1           |
    Then the response status is 200
    And the response body matches the Product schema

  @product @post
  Scenario: TC-KAN3-PROD-008 POST Create product with mandatory fields only
    Given I have a valid JWT token
    When I POST "/Product/Create" with Bearer token and body:
      | price       | 10 |
      | productType | 2  |
    Then the response status is 200
    And the response body matches the Product schema

  @product @post @negative
  Scenario: TC-KAN3-PROD-009 POST Create product with invalid productType returns 400
    Given I have a valid JWT token
    When I POST "/Product/Create" with Bearer token and body:
      | productType | 99 |
      | price       | 10 |
    Then the response status is 400

  @product @post
  Scenario: TC-KAN3-PROD-010 POST file upload via /Product
    Given I have a valid JWT token
    When I POST "/Product" with Bearer token and a test file attachment
    Then the response status is 200

  @product @get
  Scenario: TC-KAN3-PROD-011 GET /Product/{filename} downloads uploaded file
    Given I have a valid JWT token
    And a file has been uploaded via POST /Product
    When I GET "/Product/testfile.txt" with Bearer token
    Then the response status is 200

  # -----------------------------------------------
  # AC3: Components Endpoints
  # -----------------------------------------------

  @components @get @smoke
  Scenario: TC-KAN3-COMP-001 GET GetAllComponents returns array of components
    Given I have a valid JWT token
    When I GET "/Components/GetAllComponents" with Bearer token
    Then the response status is 200
    And the response body is an array matching the Components schema

  @components @get
  Scenario: TC-KAN3-COMP-002 GET GetComponentByProductId returns components for product
    Given I have a valid JWT token
    When I GET "/Components/GetComponentByProductId/1" with Bearer token
    Then the response status is 200
    And each component in the response has productId 1

  @components @get
  Scenario: TC-KAN3-COMP-003 GET GetComponentsByProductId returns all components for product
    Given I have a valid JWT token
    When I GET "/Components/GetComponentsByProductId/1" with Bearer token
    Then the response status is 200
    And each component in the response has productId 1

  @components @get @edge
  Scenario: TC-KAN3-COMP-004 GET components for non-existent product returns empty array or 404
    Given I have a valid JWT token
    When I GET "/Components/GetComponentByProductId/999999" with Bearer token
    Then the response status is 200 with empty array or 404

  @components @post @smoke
  Scenario: TC-KAN3-COMP-005 POST CreateComponent with all fields
    Given I have a valid JWT token
    When I POST "/Components/CreateComponent" with Bearer token and body:
      | id          | 0                |
      | name        | TestComponent    |
      | description | A test component |
      | productId   | 1                |
    Then the response status is 200
    And the response body matches the Components schema

  @components @post
  Scenario: TC-KAN3-COMP-006 POST CreateComponent with minimal body
    Given I have a valid JWT token
    When I POST "/Components/CreateComponent" with Bearer token and body:
      | id | 0 |
    Then the response status is 200

  @components @post @negative
  Scenario: TC-KAN3-COMP-007 POST CreateComponent without auth token returns 401
    When I POST "/Components/CreateComponent" without Authorization header and body:
      | id   | 0             |
      | name | TestComponent |
    Then the response status is 401
