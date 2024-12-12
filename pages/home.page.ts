import { Page, Locator } from "@playwright/test";
import Common from "./common.page";
import { expect } from "@playwright/test";

let common: Common;

class HomePage {
  page: Page;
  welcomeMessage: Locator;
  signupMessage: Locator;
  signupButton: Locator;
  footer: Locator;

  constructor(page: Page, commonInstance: Common) {
    this.page = page;
    common = commonInstance;

    this.welcomeMessage = page.getByText("Welcome!");
    this.signupMessage = page.getByText("Click here to sign up!");
    this.signupButton = page.locator("#signup");
    this.footer = page.locator("footer");
  }

  async getWelcomeText() {
    return await this.welcomeMessage.textContent();
  }

  async getSignupMessageText() {
    return await this.signupMessage.textContent();
  }

  async clickSignupButton() {
    await this.signupButton.click();
  }

  async login(email: string, pass: string) {
    await common.inputValue(common.emailField, email);
    await common.inputValue(common.passField, pass);
    await common.clickSubmitButton();
    await expect(common.pageTitle).toBeVisible();
  }
}

export default HomePage;
