# KAN-2 Exploratory Testing Notes

## Scope
- Application: https://www.saucedemo.com/
- Story: Login validation for valid and invalid credentials.

## Observations
- Stable locators available using data-test attributes:
  - Username: [data-test="username"]
  - Password: [data-test="password"]
  - Login button: [data-test="login-button"]
  - Error container: [data-test="error"]
- Successful login lands on /inventory.html and shows Products page.
- Invalid credentials show message:
  - Epic sadface: Username and password do not match any user in this service
- Empty field validations:
  - Username required
  - Password required

## Notes for Automation
- Prefer exact assertion on URL for success flow and root login URL for failure flow.
- Use data-test selectors over text selectors.
- Keep one assertion for message text and one for page URL to avoid false positives.
