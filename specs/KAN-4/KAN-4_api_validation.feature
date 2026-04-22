Feature: KAN-4 REST API Endpoint Validation
  As a QA engineer
  I want to validate all public REST API endpoints for https://api.restful-api.dev
  So that the API behaves correctly across all CRUD operations

  Background:
    Given the base URL is "https://api.restful-api.dev"
    And the API requires no authentication

  # ─── GET Tests ───────────────────────────────────────────────────────────────

  Scenario: TC-001 GET all objects returns array with expected schema
    When I send a GET request to "/objects"
    Then the response status should be 200
    And the response body should be a JSON array
    And each item in the array should have fields "id" and "name"

  Scenario: TC-002 GET single object by valid ID
    When I send a GET request to "/objects/7"
    Then the response status should be 200
    And the response body should contain "id" equal to "7"
    And the response body should contain "name" equal to "Apple MacBook Pro 16"
    And the response body "data.year" should equal 2019

  Scenario: TC-003 GET single object by invalid ID returns 404
    When I send a GET request to "/objects/99999"
    Then the response status should be 404

  Scenario: TC-004 GET multiple objects by query params
    When I send a GET request to "/objects?id=3&id=5&id=10"
    Then the response status should be 200
    And the response body should be a JSON array with 3 items

  Scenario: TC-013 Response Content-Type is application/json
    When I send a GET request to "/objects"
    Then the response header "Content-Type" should contain "application/json"

  # ─── POST Tests ──────────────────────────────────────────────────────────────

  Scenario: TC-005 POST create object with name and data
    When I send a POST request to "/objects" with body:
      """
      {
        "name": "Test Laptop KAN4",
        "data": {
          "year": 2024,
          "price": 999.99,
          "CPU model": "Apple M3"
        }
      }
      """
    Then the response status should be 200
    And the response body should contain an "id" field
    And the response body "name" should equal "Test Laptop KAN4"
    And the response body "data.year" should equal 2024

  Scenario: TC-006 POST create object without data field
    When I send a POST request to "/objects" with body:
      """
      {
        "name": "Minimal Object KAN4"
      }
      """
    Then the response status should be 200
    And the response body should contain an "id" field
    And the response body "name" should equal "Minimal Object KAN4"

  # ─── PUT Tests ───────────────────────────────────────────────────────────────

  Scenario: TC-007 PUT full replace of existing object
    Given I have created an object with name "Original Laptop KAN4" and data '{"price": 500}'
    When I send a PUT request to "/objects/{createdId}" with body:
      """
      {
        "name": "Replaced Laptop KAN4",
        "data": { "price": 1299.99 }
      }
      """
    Then the response status should be 200
    And the response body "name" should equal "Replaced Laptop KAN4"
    And the response body "data.price" should equal 1299.99

  Scenario: TC-008 PUT with name only sets data to null
    Given I have created an object with name "Full Object KAN4" and data '{"price": 500}'
    When I send a PUT request to "/objects/{createdId}" with body:
      """
      { "name": "Name Only KAN4" }
      """
    Then the response status should be 200
    And the response body "name" should equal "Name Only KAN4"

  # ─── PATCH Tests ─────────────────────────────────────────────────────────────

  Scenario: TC-009 PATCH partial update name only
    Given I have created an object with name "Patch Test KAN4" and data '{"color":"Blue"}'
    When I send a PATCH request to "/objects/{createdId}" with body:
      """
      { "name": "Patched Name KAN4" }
      """
    Then the response status should be 200
    And the response body "name" should equal "Patched Name KAN4"

  Scenario: TC-010 PATCH partial update data only
    Given I have created an object with name "Data Patch KAN4" and data '{"color":"Blue"}'
    When I send a PATCH request to "/objects/{createdId}" with body:
      """
      { "data": { "color": "Red" } }
      """
    Then the response status should be 200
    And the response body "data.color" should equal "Red"
    And the response body "name" should equal "Data Patch KAN4"

  # ─── DELETE Tests ─────────────────────────────────────────────────────────────

  Scenario: TC-011 DELETE created object returns success
    Given I have created an object with name "Delete Me KAN4" and data '{}'
    When I send a DELETE request to "/objects/{createdId}"
    Then the response status should be 200
    And the response body should contain a deletion confirmation message

  Scenario: TC-012 DELETE non-existent object returns 404
    When I send a DELETE request to "/objects/99999"
    Then the response status should be 404

  # ─── Lifecycle Test ───────────────────────────────────────────────────────────

  Scenario: TC-014 Full CRUD lifecycle POST-GET-PATCH-DELETE
    When I send a POST request to "/objects" with body:
      """
      { "name": "Lifecycle Object KAN4", "data": { "step": 1 } }
      """
    Then the response status should be 200
    And I store the "id" from the response as "lifecycleId"
    When I send a GET request to "/objects/{lifecycleId}"
    Then the response status should be 200
    When I send a PATCH request to "/objects/{lifecycleId}" with body:
      """
      { "data": { "step": 2 } }
      """
    Then the response status should be 200
    When I send a DELETE request to "/objects/{lifecycleId}"
    Then the response status should be 200
    When I send a GET request to "/objects/{lifecycleId}"
    Then the response status should be 404
