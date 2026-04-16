Feature: KAN-3 EA API endpoint validation
  As a QA engineer
  I want to validate Authenticate, Components, and Product endpoints
  So that API behavior aligns with Swagger contract

  Background:
    Given API base URL is "http://eaapi.somee.com"

  @KAN-3 @AC1
  Scenario: Generate token with valid credentials
    When I POST "/api/Authenticate/Login" with userName "Karthik" and password "123456"
    Then response status should be 200
    And response should contain a token value

  @KAN-3 @AC1 @Negative
  Scenario: Login payload validation for missing fields
    When I POST "/api/Authenticate/Login" with empty required fields
    Then response should indicate validation failure

  @KAN-3 @AC2 @GET
  Scenario: Retrieve authentication details
    Given I have a valid auth token
    When I GET "/api/Authenticate/Get"
    Then response status should be 200

  @KAN-3 @AC2 @GET
  Scenario: Get all components
    Given I have a valid auth token
    When I GET "/Components/GetAllComponents"
    Then response status should be 200
    And response should contain component collection

  @KAN-3 @AC2 @GET
  Scenario: Get all products
    Given I have a valid auth token
    When I GET "/Product/GetProducts"
    Then response status should be 200
    And response should contain product collection

  @KAN-3 @AC2 @Negative
  Scenario: Invalid product id lookup
    Given I have a valid auth token
    When I GET "/Product/GetProductById/999999"
    Then response should be handled as not found or validation failure
