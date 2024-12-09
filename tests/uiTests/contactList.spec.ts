import { test, expect } from "@playwright/test";
import Common from "../../pages/common.page";
import ContactList from "../../pages/contactList.page";
import HomePage from "../../pages/home.page";
import { faker } from "@faker-js/faker";

let common: Common;
let contactList: ContactList;
let homePage: HomePage;

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

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  common = new Common(page);

  // Create new user
  await common.openUrl("addUser");
  await common.addNewUser(firstName, lastName, email, pass);
  await expect(common.table).toBeVisible();
  await page.close();
});

test.beforeEach(async ({ page }) => {
  common = new Common(page);
  homePage = new HomePage(page, common);
  contactList = new ContactList(page, common);

  await common.openUrl();
  await homePage.login(email, pass);
});

test.describe("Contact List Feature", () => {
  test('Clicking "Add a New Contact" button opens Add contact page', async () => {
    await contactList.clickAddContactButton();
    expect(await common.getUrl()).toContain("/addContact");
  });

  test("User can log out", async () => {
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
});

test.describe("Add contact feature", () => {
  test("[Add contact]Contact can be added", async () => {
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
