Feature: KAN-2 - SauceDemo Login Validation
  As a customer
  I want to ensure I am able to login successfully when I use the correct username and password
  So that I can access the application and manage my purchases

  Background:
    Given I navigate to https://www.saucedemo.com/

  # ============================================================================
  # AC1: Successful Login
  # ============================================================================

  @AC1 @positive @login-success
  Scenario Outline: AC1-001: Successful login with valid credentials
    When I enter username "<username>" in the Username field
    And I enter password "secret_sauce" in the Password field
    And I click the Login button
    Then I should be redirected to https://www.saucedemo.com/inventory.html
    And the Inventory page should load with product list
    And no error messages should be displayed

    Examples:
      | username              |
      | standard_user         |
      | problem_user          |
      | visual_user           |

  # ============================================================================
  # AC2: Invalid Login & Error Handling
  # ============================================================================

  @AC2 @negative @login-failure
  Scenario: AC2-001: Login with invalid username
    When I enter username "invalid_user" in the Username field
    And I enter password "secret_sauce" in the Password field
    And I click the Login button
    Then the page should remain on https://www.saucedemo.com/
    And the error message "Epic sadface: Username and password do not match any user in this service" should be displayed
    And the Inventory page should NOT be loaded

  @AC2 @negative @login-failure
  Scenario: AC2-002: Login with invalid password
    When I enter username "standard_user" in the Username field
    And I enter password "wrong_password" in the Password field
    And I click the Login button
    Then the page should remain on https://www.saucedemo.com/
    And the error message "Epic sadface: Username and password do not match any user in this service" should be displayed
    And the Inventory page should NOT be loaded

  @AC2 @negative @login-failure
  Scenario: AC2-003: Login with locked out user
    When I enter username "locked_out_user" in the Username field
    And I enter password "secret_sauce" in the Password field
    And I click the Login button
    Then the page should remain on https://www.saucedemo.com/
    And the error message "Epic sadface: Sorry, this user has been locked out." should be displayed
    And the Inventory page should NOT be loaded

  @AC2 @negative @validation
  Scenario: AC2-004: Login with empty username field
    When I leave the Username field empty
    And I enter password "secret_sauce" in the Password field
    And I click the Login button
    Then the page should remain on https://www.saucedemo.com/
    And an error message should be displayed
    And the Inventory page should NOT be loaded

  @AC2 @negative @validation
  Scenario: AC2-005: Login with empty password field
    When I enter username "standard_user" in the Username field
    And I leave the Password field empty
    And I click the Login button
    Then the page should remain on https://www.saucedemo.com/
    And an error message should be displayed
    And the Inventory page should NOT be loaded

  @AC2 @negative @validation
  Scenario: AC2-006: Login with both fields empty
    When I leave the Username field empty
    And I leave the Password field empty
    And I click the Login button
    Then the page should remain on https://www.saucedemo.com/
    And an error message should be displayed
    And the Inventory page should NOT be loaded

  @AC2 @negative @ui
  Scenario: AC2-007: Error message can be closed
    When I enter username "invalid_user" in the Username field
    And I enter password "secret_sauce" in the Password field
    And I click the Login button
    And an error message is displayed
    And I click the close button on the error message
    Then the error message should disappear
    And I should be able to attempt login again

  @AC2 @negative @security
  Scenario: AC2-008: Multiple failed login attempts
    When I attempt login 3 times with invalid credentials
    Then I should see error messages after each failed attempt
    And the system should not lock me out
    And I should still be able to attempt login with valid credentials

  # ============================================================================
  # UI Validation & Form Behavior
  # ============================================================================

  @UI @validation @form-elements
  Scenario: UI-001: Login form elements are visible and accessible
    Then the username input field should be visible
    And the password input field should be visible
    And the login button should be visible and enabled
    And the swag labs logo should be visible

  @UI @validation @password-security
  Scenario: UI-002: Password field masks input
    When I enter password "secret_sauce" in the Password field
    Then the password should be masked with bullet points
    And the actual password should not be visible

  @UI @validation @help-section
  Scenario: UI-003: Help section is accessible
    When I click on the help icon or link
    Then the help section should be displayed or opened
    And help information should be readable

  @UI @validation @form-behavior
  Scenario: UI-004: Form functionality is restored after error
    When I enter invalid credentials and attempt login
    And the error message is displayed
    And I clear the fields
    Then I should be able to enter new credentials
    And I should be able to click login again

  # ============================================================================
  # Edge Cases & Security
  # ============================================================================

  @edge-case @security @injection
  Scenario: Security-001: SQL injection attempt in credentials
    When I enter username "' OR '1'='1" in the Username field
    And I enter password "' OR '1'='1" in the Password field
    And I click the Login button
    Then the page should remain on https://www.saucedemo.com/
    And an error message should be displayed
    And no application error should occur

  @edge-case @security @xss
  Scenario: Security-002: XSS attempt in credentials
    When I enter username "<script>alert('XSS')</script>" in the Username field
    And I enter password "test" in the Password field
    And I click the Login button
    Then the page should remain on https://www.saucedemo.com/
    And no JavaScript alert should appear
    And an error message should be displayed

  @edge-case @boundary @input-length
  Scenario: Edge-001: Very long username
    When I enter a username with 500 characters in the Username field
    And I enter password "secret_sauce" in the Password field
    And I click the Login button
    Then the page should remain on https://www.saucedemo.com/
    And an error message should be displayed

  @edge-case @boundary @input-length
  Scenario: Edge-002: Very long password
    When I enter username "standard_user" in the Username field
    And I enter a password with 500 characters in the Password field
    And I click the Login button
    Then the page should remain on https://www.saucedemo.com/
    And an error message should be displayed

  @edge-case @special-characters
  Scenario: Edge-003: Special characters in username
    When I enter username "user!@#$%^&*()" in the Username field
    And I enter password "secret_sauce" in the Password field
    And I click the Login button
    Then the page should remain on https://www.saucedemo.com/
    And an error message should be displayed

  @edge-case @unicode
  Scenario: Edge-004: Unicode characters in credentials
    When I enter username "用户" in the Username field
    And I enter password "密码" in the Password field
    And I click the Login button
    Then the page should remain on https://www.saucedemo.com/
    And an error message should be displayed

  @edge-case @whitespace
  Scenario: Edge-005: Whitespace in username field
    When I enter username " standard_user " in the Username field
    And I enter password "secret_sauce" in the Password field
    And I click the Login button
    Then the login behavior should be one of:
      | behavior                          |
      | Login fails with error message    |
      | Whitespace is trimmed and login succeeds |

  @edge-case @case-sensitivity
  Scenario: Case-001: Case sensitivity in username
    When I enter username "STANDARD_USER" in the Username field
    And I enter password "secret_sauce" in the Password field
    And I click the Login button
    Then the page should remain on https://www.saucedemo.com/
    And an error message should be displayed
