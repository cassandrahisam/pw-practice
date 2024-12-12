import { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

class Common {
  page: Page;
  baseUrl: string;
  pageTitle: Locator;
  emailField: Locator;
  passField: Locator;
  submitButton: Locator;
  cancelButton: Locator;
  table: Locator;
  firstNameField: Locator;
  lastNameField: Locator;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl =
      process.env.BASE_URL ||
      "https://thinking-tester-contact-list.herokuapp.com/";
    this.pageTitle = page.locator("h1");
    this.emailField = page.locator("#email");
    this.passField = page.locator("#password");
    this.submitButton = page.locator("#submit");
    this.cancelButton = page.locator("#cancel");
    this.table = page.locator("table");
    this.firstNameField = page.locator("#firstName");
    this.lastNameField = page.locator("#lastName");
  }

  async openUrl(path: string = "") {
    const fullUrl = path ? `${this.baseUrl}${path}` : this.baseUrl;
    await this.page.goto(fullUrl);
    await this.page.waitForLoadState("load");
  }

  async getUrl() {
    return this.page.url();
  }

  async getPageTitleText() {
    await expect(this.pageTitle).toBeVisible();
    return await this.pageTitle.textContent();
  }

  async clickCancelButton() {
    await this.cancelButton.click();
  }

  async clickSubmitButton() {
    await this.submitButton.click();
  }

  async inputValue(field: Locator, value: string) {
    await field.fill(value);
  }

  async addNewUser(
    firstName: string,
    lastName: string,
    email: string,
    pass: string
  ) {
    await this.inputValue(this.firstNameField, firstName);
    await this.inputValue(this.lastNameField, lastName);
    await this.inputValue(this.emailField, email);
    await this.inputValue(this.passField, pass);
    await this.clickSubmitButton();
    await expect(this.pageTitle).toBeVisible();
  }
}

export default Common;
