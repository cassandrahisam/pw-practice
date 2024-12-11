import { test, expect } from "@playwright/test";
import HomePage from "../pages/home.page";
import Common from "../pages/common.page";
import ContactList from "../pages/contactList.page";
import { faker } from "@faker-js/faker";
import apiController from "../controller/apiController";
import { createUser } from "../controller/apiResponseModels";
import { authController } from "../utils/auth.setup";

let homePage: HomePage;
let common: Common;
let contactList: ContactList;
let shouldSkipCleanup = false;

const firstName = faker.person.firstName();
const lastName = faker.person.lastName();
const email = faker.internet.email();
const pass = faker.internet.password();
const date = faker.date.birthdate();
const birthdate = new Date(date).toISOString().split("T")[0];
const street1 = faker.location.street();
const street2 = faker.location.streetAddress();
const city = faker.location.city();
const stateProvince = faker.location.state();
const postalCode = faker.location.zipCode();
const country = faker.location.country();

test.beforeAll(async () => {
  await authController.init();

  const userDetails: createUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: pass,
  };

  await authController.createUser(userDetails);
  await apiController.init();
});

test.beforeEach(async ({ page }) => {
  common = new Common(page);
  homePage = new HomePage(page, common);
  contactList = new ContactList(page, common);

  await common.openUrl();
});

test.afterAll(async () => {
  // Delete created user
  if (shouldSkipCleanup) {
    console.log('Skipping cleanup for this test.');
    return;
  }
  await apiController.deleteUser();
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

test.describe("Contact List Feature", () => {
  test.beforeEach(async ({ page }) => {
    common = new Common(page);
    homePage = new HomePage(page, common);
    contactList = new ContactList(page, common);

    await common.openUrl();
    await homePage.login(email, pass);
  });

  test('Clicking "Add a New Contact" button opens Add contact page', async () => {
    await contactList.clickAddContactButton();
    expect(await common.getUrl()).toContain("/addContact");
  });

  test("User can log out", async () => {
    shouldSkipCleanup = true;
    await contactList.clickLogoutButton();
    expect(await common.getUrl()).toContain("/logout");
    expect(await common.getPageTitleText()).toContain("Contact List App");
  });

  test('"Return to Contact List" button redirects to Contact list page', async () => {
    // Create new contact
    await common.openUrl("addContact");
    await contactList.addNewContact(
      firstName,
      lastName,
      birthdate,
      street1,
      street2,
      stateProvince,
      city,
      postalCode,
      country
    );
    await common.clickSubmitButton();
    await expect(common.table).toBeVisible();

    // Verify return button
    await contactList.clickContact();
    expect(await common.getPageTitleText()).toBe("Contact Details");
    await contactList.clickReturnButton();
    await expect(common.table).toBeVisible();
  });

  test("Contact can be added", async () => {
    await common.openUrl("addContact");
    await contactList.addNewContact(
      firstName,
      lastName,
      birthdate,
      street1,
      street2,
      stateProvince,
      city,
      postalCode,
      country
    );
    await common.clickSubmitButton();
    await expect(common.table).toBeVisible();
    expect(await contactList.getNameFromTable()).toBe(
      firstName + " " + lastName
    );
  });
});
