import { test, expect } from "@playwright/test";
import HomePage from "../../pages/home.page";
import Common from "../../pages/common.page";
import ContactList from "../../pages/contactList.page";
import { faker } from "@faker-js/faker";

let homePage: HomePage;
let common: Common;
let contactList: ContactList;

const firstName = faker.person.firstName();
const lastName = faker.person.lastName();
const email = faker.internet.email();
const pass = faker.internet.password();

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  common = new Common(page);

  // Create new user
  await common.openUrl("addUser");
  await common.addNewUser(firstName, lastName, email, pass);
  await page.close();
});

test.beforeEach(async ({ page }) => {
  common = new Common(page);
  homePage = new HomePage(page, common);
  contactList = new ContactList(page, common);

  await common.openUrl();
});

test.describe("Homepage feature", () => {
  test("App can be accessed", async () => {
    expect(common.pageTitle).toBeVisible();
    expect(await common.getPageTitleText()).toContain("Contact List App");
  });

  test("Page elements are displayed", async () => {
    await expect(homePage.welcomeMessage).toBeVisible();
    expect(await homePage.getWelcomeText()).toMatch(
      "Welcome! This application is for testing purposes only. The database will be purged as needed to keep costs down."
    );
    await expect(common.emailField).toBeVisible();
    await expect(common.passField).toBeVisible();
    await expect(common.submitButton).toBeVisible();
    await expect(homePage.signupMessage).toBeVisible();
    expect(await homePage.getSignupMessageText()).toMatch(
      "Not yet a user? Click here to sign up!"
    );
    await expect(homePage.signupButton).toBeVisible();
    await expect(homePage.footer).toBeVisible();
  });

  test("Clicking sign up button opens Add User page", async () => {
    await homePage.clickSignupButton();
    expect(await common.getUrl()).toContain("/addUser");
  });

  test("Cancel button redirects to the previous page", async ({ page }) => {
    await homePage.clickSignupButton();
    await common.clickCancelButton();
    await expect(page).toHaveURL(
      "https://thinking-tester-contact-list.herokuapp.com/login"
    );
  });

  test("User cand be added", async () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    const pass = faker.internet.password();

    await common.openUrl("addUser");
    await common.addNewUser(firstName, lastName, email, pass);
    await expect(common.table).toBeVisible();
    await expect(contactList.tableHeader).toBeVisible();
    await expect(contactList.tableRow.first()).toBeHidden();
    expect(await common.getUrl()).toContain("/contactList");
    expect(await common.getPageTitleText()).toMatch("Contact List");
  });

  test("User can log in", async () => {
    await homePage.login(email, pass);
    expect(await common.getUrl()).toContain("/contactList");
  });
});
