Feature: SauceDemo Login Validation
  As a customer
  I want to ensure I am able to login successfully when I use the correct username and password
  So that I can access the SauceDemo application

  Background:
    Given I navigate to "https://www.saucedemo.com/"
    And the login page is displayed
    And I can see the username field, password field, and login button

  # -----------------------------------------------
  # AC1: Successful Login (Happy Path)
  # -----------------------------------------------

  @happy-path @AC1
  Scenario Outline: Successful login with valid credentials
    When I enter "<username>" in the username field
    And I enter "<password>" in the password field
    And I click the login button
    Then I should be redirected to the inventory page
    And the URL should contain "/inventory.html"
    And I should see the products page header

    Examples:
      | username      | password     |
      | standard_user | secret_sauce |
      | problem_user  | secret_sauce |
      | visual_user   | secret_sauce |

  # -----------------------------------------------
  # AC2: Invalid Login (Negative Tests)
  # -----------------------------------------------

  @negative @AC2
  Scenario Outline: Login failure with invalid credentials
    When I enter "<username>" in the username field
    And I enter "<password>" in the password field
    And I click the login button
    Then I should see the error message "Epic sadface: Username and password do not match any user in this service"
    And I should remain on the login page
    And error icons should appear next to the input fields

    Examples:
      | username     | password     |
      | test_user    | secret_sauce |
      | test         | secret_sauce |
      | invalid_user | secret_sauce |

  # -----------------------------------------------
  # Field Validation (Edge Cases)
  # -----------------------------------------------

  @validation @edge-cases
  Scenario Outline: Field validation errors
    When I enter "<username>" in the username field
    And I enter "<password>" in the password field
    And I click the login button
    Then I should see the error message "<expected_error>"
    And I should remain on the login page

    Examples:
      | username      | password     | expected_error                     |
      |               | secret_sauce | Epic sadface: Username is required |
      | standard_user |              | Epic sadface: Password is required |
      |               |              | Epic sadface: Username is required |

  # -----------------------------------------------
  # Locked User
  # -----------------------------------------------

  @locked-user @negative
  Scenario: Locked out user cannot login
    When I enter "locked_out_user" in the username field
    And I enter "secret_sauce" in the password field
    And I click the login button
    Then I should see the error message "Epic sadface: Sorry, this user has been locked out."
    And I should remain on the login page
    And error icons should appear next to the input fields

  # -----------------------------------------------
  # UI Interaction
  # -----------------------------------------------

  @ui-interaction
  Scenario: Error message can be dismissed
    Given I have triggered an error by entering invalid credentials
    When I click the error message close button
    Then the error message should disappear
    And the error icons should be removed from the input fields
    And the form should be ready for new input

  @ui-validation
  Scenario: Helper text is displayed correctly on the login page
    Then I should see "Accepted usernames are:" heading
    And I should see the list of valid usernames including "standard_user"
    And I should see "Password for all users:" heading
    And I should see the password "secret_sauce"

  @ui-validation
  Scenario: Input field attributes are correct
    Then the username field should have placeholder "Username"
    And the password field should have placeholder "Password"
    And the password field should mask entered characters
    And the login button should be enabled by default

  # -----------------------------------------------
  # Security / Edge Cases
  # -----------------------------------------------

  @security @edge-cases
  Scenario Outline: Application handles special characters and security attempts safely
    When I enter "<test_input>" in the username field
    And I enter "secret_sauce" in the password field
    And I click the login button
    Then I should see the error message "Epic sadface: Username and password do not match any user in this service"
    And the application should handle the input gracefully
    And no system errors should occur

    Examples:
      | test_input                     |
      | !@#$%^&*()                     |
      | '; DROP TABLE users; --        |
      | <script>alert('xss')</script>  |
      | aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa |
