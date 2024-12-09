# pw-practice

Hi there 👋 

This project is designed to practice UI and API automation testing with Playwright.
Test app used: https://thinking-tester-contact-list.herokuapp.com/

## Dependencies

- `playwright`: A framework for automating web browsers for testing.
- `faker`: A library for generating fake data (e.g., names, addresses, emails) used in tests.
- `eslint`: A linting tool to maintain code quality and style.
- `prettier`: An opinionated code formatter for maintaining consistent formatting.
- `allure report`: A reporter for visualizing the results of a test run.

## Installation

1. Clone the repository:
``` git clone https://github.com/your-username/playwright-test-automation.git ```
2. Install dependencies:
First, make sure you have Node.js installed.
Then, run the following to install the necessary dependencies:
```npm install```
3. Install playwright
```npm init playwright@latest```

## Usage

Running tests locally:
```npx playwright test```
Headless Mode
By default, Playwright runs in headless mode (without opening a browser window). To run tests with the browser UI visible:
```npx playwright test --headed```
