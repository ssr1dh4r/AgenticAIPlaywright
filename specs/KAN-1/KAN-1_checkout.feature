Feature: SauceDemo Checkout Process Validation
  As a customer
  I want to complete my purchase through a checkout process
  So that I can order products online

  Background:
    Given I am on the SauceDemo login page "https://www.saucedemo.com"
    And I log in with username "standard_user" and password "secret_sauce"
    And I am redirected to the inventory page

  # ============================================================
  # AC1 + AC2 + AC3 + AC4: Happy Path
  # ============================================================

  @smoke @happy-path @AC1 @AC2 @AC3 @AC4
  Scenario: TC001 - Complete checkout process with a single item
    Given I add "Sauce Labs Backpack" to my cart
    When I navigate to the cart page
    Then I should see "Sauce Labs Backpack" with price "$29.99" and quantity "1"
    And I should see "Continue Shopping" and "Checkout" buttons
    When I click "Checkout"
    Then I should be on the checkout information page "/checkout-step-one.html"
    When I enter first name "John", last name "Doe", and postal code "12345"
    And I click "Continue"
    Then I should be on the checkout overview page "/checkout-step-two.html"
    And I should see "Sauce Labs Backpack" in the order summary
    And I should see payment information "SauceCard #31337"
    And I should see shipping information "Free Pony Express Delivery!"
    And I should see item total, tax, and final total amounts
    When I click "Finish"
    Then I should be on the order confirmation page "/checkout-complete.html"
    And I should see the message "Thank you for your order!"
    When I click "Back Home"
    Then I should be on the inventory page
    And my cart should be empty

  @happy-path @AC1 @AC3
  Scenario: TC002 - Complete checkout with multiple items and verify price totals
    Given I add the following items to my cart:
      | Item                    | Price  |
      | Sauce Labs Backpack     | $29.99 |
      | Sauce Labs Bike Light   | $9.99  |
      | Sauce Labs Bolt T-Shirt | $15.99 |
    When I navigate to the cart page
    Then I should see 3 items in my cart with correct details
    When I proceed through checkout with first name "Jane", last name "Smith", postal code "90210"
    Then the checkout overview should show all 3 items
    And the item total should be "$55.97"
    And the final total should include tax on "$55.97"
    When I complete the order
    Then I should see the order confirmation message

  # ============================================================
  # AC1: Cart Management
  # ============================================================

  @cart-management @AC1
  Scenario: TC003 - Add and remove items from inventory page
    When I click "Add to cart" for "Sauce Labs Backpack"
    Then the cart badge should show "1"
    And the button for "Sauce Labs Backpack" should display "Remove"
    When I click "Remove" for "Sauce Labs Backpack"
    Then the cart badge should not be displayed
    And the button for "Sauce Labs Backpack" should display "Add to cart"

  @cart-management @AC1
  Scenario: TC004 - Remove an item from the cart page
    Given I have added "Sauce Labs Backpack" and "Sauce Labs Bike Light" to my cart
    And I navigate to the cart page
    When I remove "Sauce Labs Backpack" from the cart
    Then "Sauce Labs Backpack" should no longer appear in the cart
    And "Sauce Labs Bike Light" should still be in the cart
    And the cart badge should show "1"

  @cart-management @AC1
  Scenario: TC005 - Continue shopping from cart preserves cart state
    Given I have added "Sauce Labs Backpack" to my cart
    And I navigate to the cart page
    When I click "Continue Shopping"
    Then I should be on the inventory page
    And the cart badge should show "1"
    And "Sauce Labs Backpack" should show a "Remove" button

  # ============================================================
  # AC2 + AC5: Form Validation
  # ============================================================

  @validation @negative @AC2 @AC5
  Scenario Outline: TC006 - Checkout form mandatory field validation
    Given I have "Sauce Labs Backpack" in my cart
    And I am on the checkout information page
    When I enter first name "<firstName>", last name "<lastName>", and postal code "<postalCode>"
    And I click "Continue"
    Then I should see the error message "<errorMessage>"
    And I should remain on the checkout information page

    Examples:
      | firstName | lastName | postalCode | errorMessage                   |
      |           |          |            | Error: First Name is required  |
      | John      |          |            | Error: Last Name is required   |
      | John      | Doe      |            | Error: Postal Code is required |

  @validation @negative @AC5
  Scenario: TC007 - Checkout form handles invalid and special character input
    Given I have "Sauce Labs Backpack" in my cart
    And I am on the checkout information page
    When I enter first name "!@#$%", last name "123", and postal code "ABC"
    And I click "Continue"
    Then the application should display appropriate validation feedback

  @validation @AC5
  Scenario: TC008 - Error message can be dismissed and form recovers
    Given I have "Sauce Labs Backpack" in my cart
    And I am on the checkout information page
    When I click "Continue" without filling any fields
    Then I should see an error message
    When I click the error close button
    Then the error message should disappear
    When I enter first name "John", last name "Doe", and postal code "12345"
    And I click "Continue"
    Then I should be on the checkout overview page

  # ============================================================
  # AC2 + AC3: Cancel / Navigation
  # ============================================================

  @navigation @AC2
  Scenario: TC009 - Cancel from checkout information returns to cart
    Given I have "Sauce Labs Backpack" in my cart
    And I am on the checkout information page
    When I click "Cancel"
    Then I should be on the cart page "/cart.html"
    And "Sauce Labs Backpack" should still be in the cart

  @navigation @AC3
  Scenario: TC010 - Cancel from checkout overview returns to inventory
    Given I have completed the checkout information with valid data
    And I am on the checkout overview page
    When I click "Cancel"
    Then I should be on the inventory page "/inventory.html"
    And my cart items should be preserved
    And no order should have been placed

  # ============================================================
  # Edge Cases and Boundary Conditions
  # ============================================================

  @edge-cases
  Scenario: TC012 - Empty cart checkout handling
    Given my cart is empty
    When I navigate to the cart page
    Then the cart should display no items
    And the checkout button behavior should handle the empty cart appropriately

  @edge-cases @AC3
  Scenario: TC013 - Price calculation accuracy with multiple products
    Given I add the following items to my cart:
      | Item                      | Price  |
      | Sauce Labs Onesie         | $7.99  |
      | Sauce Labs Fleece Jacket  | $49.99 |
    When I proceed through checkout with first name "Mike", last name "Brown", postal code "10001"
    Then the item total on the overview should be "$57.98"
    And the tax should be a percentage of "$57.98"
    And the total should equal the item total plus tax
    And all amounts should use "$" currency formatting

  @edge-cases
  Scenario: TC014 - Add to cart works correctly regardless of sort order
    When I change the sort order to "Price (low to high)"
    And I add "Sauce Labs Onesie" to my cart
    And I change the sort order to "Price (high to low)"
    And I add "Sauce Labs Fleece Jacket" to my cart
    Then the cart badge should show "2"
    And both items should appear in the cart

  # ============================================================
  # UI Validation
  # ============================================================

  @ui-validation
  Scenario: TC017 - Add to cart button provides immediate visual feedback
    When I click "Add to cart" for "Sauce Labs Backpack"
    Then the button text should immediately change to "Remove"
    And the cart badge should appear and show "1"

  @ui-validation @responsive
  Scenario Outline: TC018 - Checkout is usable at different viewport sizes
    Given I set the viewport to <width>x<height>
    And I have "Sauce Labs Backpack" in my cart
    When I complete the full checkout flow with valid data
    Then the checkout should complete successfully
    And all form fields should have been accessible

    Examples:
      | width | height |
      | 390   | 844    |
      | 768   | 1024   |
      | 1440  | 900    |

  # ============================================================
  # Integration / End-to-End
  # ============================================================

  @integration @smoke
  Scenario: TC019 - End-to-end checkout workflow with all product types
    Given I start with a fresh session
    When I log in with username "standard_user" and password "secret_sauce"
    And I add all available products to the cart
    And I navigate to the cart and verify all items are present
    And I proceed through checkout with first name "Test", last name "User", postal code "99999"
    And I verify the order overview totals are mathematically correct
    And I click "Finish"
    Then I should see the order confirmation
    And clicking "Back Home" should return to a reset inventory page with empty cart
