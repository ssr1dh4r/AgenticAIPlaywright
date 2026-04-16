Feature: KAN-2 SauceDemo login validation
  As a SauceDemo customer
  I want login to succeed for valid users and fail for invalid users
  So that authentication behavior is reliable

  Background:
    Given I navigate to "https://www.saucedemo.com/"

  @KAN-2 @AC1
  Scenario Outline: Successful login with valid users
    When I login with username "<username>" and password "secret_sauce"
    Then I should be redirected to the inventory page
    And the products header should be visible

    Examples:
      | username      |
      | standard_user |
      | problem_user  |
      | visual_user   |

  @KAN-2 @AC2
  Scenario Outline: Invalid login with invalid users
    When I login with username "<username>" and password "secret_sauce"
    Then I should remain on the login page
    And I should see the authentication error message

    Examples:
      | username     |
      | test_user    |
      | test         |
      | invalid_user |

  @KAN-2 @Validation
  Scenario: Username is mandatory
    When I click login without entering any credentials
    Then I should see "Epic sadface: Username is required"

  @KAN-2 @Validation
  Scenario: Password is mandatory
    When I enter username "standard_user" and keep password empty
    And I click login
    Then I should see "Epic sadface: Password is required"
