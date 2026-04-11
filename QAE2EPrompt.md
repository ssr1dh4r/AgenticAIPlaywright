# QA End-to-End Agentic Workflow Prompt

This prompt guides an AI agent to execute a complete QA workflow using AI agents and MCP servers — from user story analysis to GitHub commit.

---

## ✅ Step 1: Read Jira Ticket

**Prompt:** Find all tickets in project 'QE AI Kanban' that have the status 'To Do'.

For each ticket found:
- Move the ticket to "In Progress"
- Read the Acceptance Criteria
- If it passes (Step 6), move the ticket to 'Done' and post the results as a comment
- If it fails (Step 6), leave a comment with the error and keep it in 'In Progress'

**Extract and summarize:**
- Key requirements
- Acceptance criteria
- Application URL
- Test credentials
- Key features to test

**Expected Output:**
- Summary of user story
- List of acceptance criteria
- Features to validate

---

## ✅ Step 2: Create Test Plan

**Prompt:** For each ticket found in Jira from step 1:

Use **Playwright Test Planner Agent** to:
- Read user story and acceptance criteria
- Open application URL using Playwright MCP
- Explore all workflows

Create a **comprehensive test plan** including:
- Happy path scenarios
- Negative scenarios
- Edge cases
- Boundary conditions
- UI validations
- Navigation flows

**Save artifacts:**
- Test plan markdown file in `specs/` folder (prefixed with Jira ticket ID)
- Feature files in `tests/features/` folder (Gherkin BDD format)

Each test scenario must include:
- Test ID
- Test case title (self-explanatory)
- Description
- Preconditions (including test data requirements)
- Steps
- Expected result

**Expected Output:**
- Complete test plan markdown file saved to specs/
- Organized test scenarios with clear structure
- Browser exploration screenshots (if needed)
- Feature files in Gherkin format for stakeholder review

---

## ✅ Step 3: Perform Exploratory Testing

**Prompt:** For each ticket found:

Perform manual exploratory testing using **Playwright MCP (browser tools)**:
- Execute test scenarios from test plan
- Perform manual exploratory testing
- Validate expected vs actual results
- Capture screenshots if applicable
- Record observations

**Expected Output:**
- Execution notes
- Screenshots (if applicable)
- Bugs / observations
- Issues discovered during exploration

---

## ✅ Step 4: Generate Automation Scripts

**Prompt:** For each ticket found:

Create automated test scripts using **Playwright Test Generator Agent**

**Input:**
- Test plan from specs/ (Step 2)
- Exploratory findings (Step 3)

**Implementation Guidelines:**
- Leverage element selectors discovered during exploration
- Follow SOLID design principles
- Create separate folders for each Jira ticket
- Use stable element properties (IDs, data attributes, roles)
- Apply wait strategies observed during manual testing
- Reference Swagger documentation for API validation
- Save scripts under `tests/` with Jira ticket ID as folder name

**Language & Framework:**
- Language: TypeScript / JavaScript
- Framework: Playwright

**Requirements:**
- Follow Playwright best practices
- One test per scenario
- Separate .ts files to group related test scenarios
- Use proper assertions
- Use stable locators for UI tests
- Test mandatory and optional fields per API documentation
- Include comments explaining test logic
- Add waits where needed for UI tests

**Browser Support:**
- Chromium
- Firefox
- WebKit

After generating scripts, run them to verify they pass.

**Expected Output:**
- Test suite files created in tests/{TICKET_ID}/ folder
- scripts using robust selectors
- All scripts follow Playwright best practices

---

## ✅ Step 5: Execute and Heal Tests

**Prompt:** Use **Playwright Test Healer Agent**:
- Execute all tests
- Detect failures
- Automatically fix:
  - Broken locators (UI tests)
  - Timing issues
  - Minor script issues
- Re-run tests after healing

**Expected Output:**
- Final execution status
- List of fixed issues
- Test results summary

---

## ✅ Step 6: Generate Test Report

**Prompt:** Create a combined detailed test execution report:

**Save file:**
```
reports/{TICKET_ID}_test_execution_report.md
```

**Include:**
- Executive summary in table format (categorized by Jira tickets)
- Manual testing results
- Automation results
- Pass/Fail summary
- Defects found
- Coverage details
- Recommendations

---

## ✅ Step 7: Update Jira Ticket Status

**Prompt:** If there are no open defects or all tests have passed:
- Move the Jira ticket to "Done"
- Post execution summary as comment

---

## 🚀 Final Instruction

Execute all above steps sequentially using:
- Playwright Test Planner Agent
- Playwright Test Generator Agent
- Playwright Test Healer Agent
- Playwright MCP Server
- GitHub MCP Server

Use natural language understanding and autonomous decision-making.

Perform the complete QA workflow end-to-end.

---

**Version:** 1.0  
**Last Updated:** April 11, 2026  
**Status:** Production Ready
