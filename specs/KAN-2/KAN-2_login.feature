Feature: SauceDemo Login Validation
  As a customer
  I want to ensure I am able to login successfully when I use the correct username and password
  So that I can access the application features securely

  Background:
    Given I am on the SauceDemo login page "https://www.saucedemo.com"

  @positive @smoke @high @ac1
  Scenario Outline: AC1 - Valid user login with correct credentials
    When I enter "<username>" in the username field
    And I enter "secret_sauce" in the password field
    And I click the Login button
    Then I should be redirected to the inventory page "/inventory.html"
    And I should not see any error messages

    Examples:
      | username      | test_id      |
      | standard_user | TC-KAN2-001 |
      | problem_user  | TC-KAN2-002 |
      | visual_user   | TC-KAN2-003 |

  @negative @high @ac2
  Scenario Outline: AC2 - Invalid user login attempts
    When I enter "<invalid_username>" in the username field
    And I enter "secret_sauce" in the password field
    And I click the Login button
    Then I should remain on the login page
    And I should see the error message "Epic sadface: Username and password do not match any user in this service"
    And the error message should be dismissible

    Examples:
      | invalid_username | test_id      |
      | invalid_user     | TC-KAN2-004 |
      | test             | TC-KAN2-005 |
      | test_user        | TC-KAN2-006 |

  @negative @validation @high
  Scenario: TC-KAN2-007 - Empty username field validation
    When I leave the username field empty
    And I enter "secret_sauce" in the password field
    And I click the Login button
    Then I should remain on the login page
    And I should see the error message "Epic sadface: Username is required"
    And the error message should be dismissible

  @negative @validation @high
  Scenario: TC-KAN2-008 - Empty password field validation
    When I enter "standard_user" in the username field
    And I leave the password field empty
    And I click the Login button
    Then I should remain on the login page
    And I should see the error message "Epic sadface: Password is required"
    And the error message should be dismissible

  @negative @validation @high
  Scenario: TC-KAN2-009 - Both fields empty validation
    When I leave both username and password fields empty
    And I click the Login button
    Then I should remain on the login page
    And I should see the error message "Epic sadface: Username is required"
    And the error message should be dismissible

  @negative @security @high
  Scenario: TC-KAN2-010 - Locked out user cannot login
    When I enter "locked_out_user" in the username field
    And I enter "secret_sauce" in the password field
    And I click the Login button
    Then I should remain on the login page
    And I should see the error message "Epic sadface: Sorry, this user has been locked out."
    And the error message should be dismissible

  @functional @medium
  Scenario: TC-KAN2-011 - Error message dismissal functionality
    Given I have triggered a login error by entering invalid credentials
    When I click the error dismiss button X
    Then the error message should no longer be visible
    And the login form should remain functional

  @ui @low
  Scenario: TC-KAN2-012 - Login form placeholder text verification
    Then the username field should display placeholder text "Username"
    And the password field should display placeholder text "Password"

  @security @ui @medium
  Scenario: TC-KAN2-013 - Password field masking verification
    When I enter "testpassword" in the password field
    Then the password field should have type "password" attribute
    And the password text should be visually masked

  @negative @security @low
  Scenario: TC-KAN2-014 - Special characters in username handling
    When I enter "user@#$%" in the username field
    And I enter "secret_sauce" in the password field
    And I click the Login button
    Then the application should handle the input gracefully
    And I should see the error message "Epic sadface: Username and password do not match any user in this service"

  @security @high
  Scenario: TC-KAN2-015 - SQL injection protection
    When I enter "admin' OR '1'='1' --" in the username field
    And I enter "secret_sauce" in the password field
    And I click the Login button
    Then the login attempt should fail
    And I should see the error message "Epic sadface: Username and password do not match any user in this service"
    And no unauthorized access should be granted

  @boundary @low
  Scenario: TC-KAN2-016 - Very long string input handling
    When I enter a string of 500 characters in the username field
    And I enter a string of 500 characters in the password field
    And I click the Login button
    Then the application should handle the long inputs gracefully
    And there should be no UI breaking or layout overflow
    And an appropriate error message should be displayed
