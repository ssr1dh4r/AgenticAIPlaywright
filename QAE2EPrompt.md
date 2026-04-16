# QA End-to-End Agentic Workflow Prompt

Set your reasoning mode to 'Strict Procedural'. I need to execute a bulk QA loop.
STEP 1 [Discovery]: Search the atlassian-rovo server for all tickets in project 'QE AI Kanban' with status 'To Do'. Store the list of all Ticket IDs in your memory. 
STEP 2 [Logging]: Output the list of IDs you found so I can see the scope. 
STEP 3 [Execution Loop]: For EVERY ID in that list, perform the following steps Step A to Step G before moving to the next ID:
## ✅ Step A: Read Jira ticket

Prompt:

Move the ticket to "In Progress"

Read the Acceptance Criteria.

* Extract and summarize:

  * Key requirements
  * Acceptance criteria
  * Application URL
  * Test credentials
  * Key features to test

**Expected Output:**

* Summary of user story
* List of acceptance criteria
* Features to validate

---

## ✅ Step C: Create Test Plan

Prompt:

Use **Playwright Test Planner Agent**

* Read user story and acceptance criteria
* Open application URL using Playwright MCP
* Explore all workflows

Create a **comprehensive test plan** including:

* Happy path scenarios
* Negative scenarios
* Edge cases
* Boundary conditions
* UI validations
* Navigation flows
* Feature file with ACs under specs/

Save the test plan for individual Jira ticket in .md for each Jira ticket with Jira ticket ref as the prefix in the file name at specs/


Each test scenario must include:

* Test ID
* Test case title which is self-explanatory
* Description
* Preconditions including test data requirements
* Steps
* Expected result
* Test Plan in .md format saved in specs folder
* Feature files (.feature) with scenarios/scenario outline saved under specs/

**Expected Output:**
Complete test plan markdown file saved to specs/
Orgnaised test scenarios with clear structure
Browser exploration screenshots (if needed)
---

## ✅ Step D: Perform Exploratory Testing

Prompt:

Perform manual exploratory testing using -

Use **Playwright MCP (browser tools)**

* Execute test scenarios from test plan
* Perform manual exploratory testing
* Validate expected vs actual results
* Capture screenshots if applicable
* Record observations

**Expected Output:**

* Execution notes
* Screenshots (if applicable)
* Bugs / observations
* Any issues discovered during exploration

---

## ✅ Step F: Generate Automation Scripts

Prompt:

Create automated test scripts using SOLID principle/modular programming -

Use **Playwright Test Generator Agent**

* Create the test scripts reading the following:

  * Test plan from specs/ (Step 2)
  * Exploratory findings (Step 3)

Using insights from the manual exploratory testing:
- Leverage the element selectors and locators that were successfully used in step 3 in case of UI related tests
- Use SOLID design principle
- Create sepparate folders for each Jira ticket and put relevant ACs under that folder
- Use stable element properties (IDs, data attributes, roles) discovered during exploration in case of UI related tests
- Apply wait strategies and UI behaviours observed during manual testing in case of UI related tests
- Use swagger documentation or any relevant documentation available for API validation
- Save the scripts under tests/ with Jira ticket ref as the folder name and scripts in the folder

Generate Playwright automation scripts for all the test scenarios and test cases listed in the test plan:

* Language: JavaScript / TypeScript
* Framework: Playwright

Requirements:
* Follow Playwright best practices
* One test per scenario
* Add different .ts files in spec to group the test scenarios which is saved in a folder with Jira ticket ref as prefix
* Use proper assertions
* Use stable locators in case of UI tests
* Test mandatory and optional fields/values as per swagger documentation for API tests
* Add comments
* Use waits where needed in case of UI tests
* Follow best practices

Save scripts under:

```
tests/
```

Support browsers just for UI testing:

* Chromium
* Firefox
* WebKit

After generating the scripts, run them to see if they pass

**Expected Output:**
- Test suite files created in tests/saucedemo_checkout/ based on scenarios
- Scripts using robust selectors discovered during exploratory testing
- All test scripts follow Playwright best practices


---

## ✅ Step G: Execute and Heal Tests

Prompt:

Use **Playwright Test Healer Agent**

* Execute all tests
* Detect failures
* Automatically fix:

  * Broken locators in case of UI tests
  * Timing issues
  * Minor script issues

Re-run tests after healing

**Expected Output:**

* Final execution status
* List of fixed issues


---

STEP 4 [Finality]: Do not stop or ask for permission between tickets. Continue until the list from Step 1 is empty.

## ✅ Step H: Consolidate files and folders

Prompt:
Put all the files created in specs/ in newly created folder using the Jira ticket ref. 

## ✅ Step I: Generate Test Report

Prompt:

Save file:

```
reports/test_execution_report.md
```

Include:

* Executive summary preferably in a table format categorised based on Jira tickets
* Manual testing results
* Automation results
* Pass/Fail summary
* Defects found with clear description of the defect in plain English
* Coverage details
* Recommendations
---

## ✅ Step J: Commit to GitHub
Prompt:
Use **GitHub MCP Server**
Repository URL:
```
https://github.com/ssr1dh4r/AgenticAIPlaywright.git
```
Perform:
* Initialize repository (if needed)
* Add all files except reports which is under reports folder
* Commit with message:
  ```
  Complete QA automation workflow with agentic AI
  ```
* Push to main branch
Files to commit:
Everything except reports folder

## ✅ Step K: Update Jira ticket status

Prompt:
If there are no open defects or if all tests have passed then move the Jira ticket to "Done" else leave the ticket "in Progress" and details regarding the failure in the comments section.

Create a comprehensive combined test report with pie chart, graphs and tables and saved it under reports/

## 🚀 Final Instruction

Execute all above steps sequentially using:

* Playwright Test Planner Agent
* Playwright Test Generator Agent
* Playwright Test Healer Agent
* Playwright MCP Server
* GitHub MCP Server

Use natural language understanding and autonomous decision-making.

Perform the complete QA workflow end-to-end.