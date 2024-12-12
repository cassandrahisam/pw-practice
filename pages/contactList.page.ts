import { Page, Locator } from "@playwright/test";
import Common from "./common.page";

let common: Common;

class ContactList {
  page: Page;

  tableHeader: Locator;
  tableRow: Locator;
  addContactButton: Locator;
  logoutButton: Locator;
  firstNameLabel: Locator;
  lastNameLabel: Locator;
  birthdate: Locator;
  phone: Locator;
  street1: Locator;
  street2: Locator;
  city: Locator;
  stateProvince: Locator;
  postalCode: Locator;
  country: Locator;
  cancelButton: Locator;
  errorMessage: Locator;
  editContactButton: Locator;
  returnButton: Locator;

  constructor(page: Page, commonInstance: Common) {
    this.page = page;
    common = commonInstance;

    this.tableHeader = page.locator("table > thead");
    this.tableRow = page.locator("table > tr");
    this.addContactButton = page.locator("#add-contact");
    this.logoutButton = page.locator("#logout");
    this.firstNameLabel = page.locator("label", { hasText: " * First Name:" });
    this.lastNameLabel = page.locator("label", { hasText: " * Last Name:" });
    this.birthdate = page.locator("#birthdate");
    this.phone = page.locator("#phone");
    this.street1 = page.locator("#street1");
    this.street2 = page.locator("#street2");
    this.city = page.locator("#city");
    this.stateProvince = page.locator("#stateProvince");
    this.postalCode = page.locator("#postalCode");
    this.country = page.locator("#country");
    this.cancelButton = page.locator("#cancel");
    this.errorMessage = page.locator("#error");
    this.returnButton = page.locator("#return");
  }

  async clickAddContactButton() {
    return this.addContactButton.click();
  }

  async clickLogoutButton() {
    return this.logoutButton.click();
  }

  async getNameFromTable() {
    return await this.tableRow.locator("td:nth-child(2)").textContent();
  }

  async addNewContact(
    firstName,
    lastName,
    birthdate,
    street1,
    street2,
    stateProvince,
    city,
    postalCode,
    country
  ) {
    await common.inputValue(common.firstNameField, firstName);
    await common.inputValue(common.lastNameField, lastName);
    await common.inputValue(this.birthdate, birthdate);
    await common.inputValue(this.street1, street1);
    await common.inputValue(this.street2, street2);
    await common.inputValue(this.stateProvince, stateProvince);
    await common.inputValue(this.city, city);
    await common.inputValue(this.postalCode, postalCode);
    await common.inputValue(this.country, country);
  }

  async getErrorMessageText() {
    await this.errorMessage.isVisible();
    return await this.errorMessage.textContent();
  }

  async clickContact() {
    await this.tableRow.click();
    await this.returnButton.isVisible();
  }

  async clickReturnButton() {
    await this.returnButton.click();
  }
}

export default ContactList;
