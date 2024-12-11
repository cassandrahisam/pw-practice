import { test, expect } from "@playwright/test";
import apiController from "../../controller/apiController";
import { addContact } from "../../controller/apiResponseModels";
import { faker } from "@faker-js/faker";

test.beforeAll(async () => {
  await apiController.init();
});

test.describe("POST API tests", () => {
  test("POST contacts", async () => {
    const randomFirstName = faker.person.firstName();
    const randomLastName = faker.person.lastName();
    const randomEmail = faker.internet.email();
    const randomPhone = faker.string.numeric(10);
    const date = faker.date.birthdate();
    const randomBirthdate = new Date(date).toISOString().split("T")[0];
    const randomStreet1 = faker.location.street();
    const randomStreet2 = faker.location.streetAddress();
    const randomCity = faker.location.city();
    const randomState = faker.location.state();
    const randomPostalCode = faker.location.zipCode();
    const randomCountry = faker.location.country();

    const contactData: addContact = {
      firstName: randomFirstName,
      lastName: randomLastName,
      birthdate: randomBirthdate,
      email: randomEmail,
      phone: randomPhone,
      street1: randomStreet1,
      street2: randomStreet2,
      city: randomCity,
      stateProvince: randomState,
      postalCode: randomPostalCode,
      country: randomCountry,
    };

    const addedContact = await apiController.addContacts(contactData);

    expect(addedContact).toHaveProperty("_id");
    expect(addedContact.firstName).toBe(randomFirstName);
    expect(addedContact.lastName).toBe(randomLastName);
    expect(addedContact.email.toLowerCase()).toBe(randomEmail.toLowerCase());
  });

  test("POST contacts without required field", async () => {
    const randomFirstName = faker.person.firstName();
    const contactData = {
      firstName: randomFirstName,
    };

    const addedContact = await apiController.addContacts(contactData);
    expect(addedContact.message).toBe(
      "Contact validation failed: lastName: Path `lastName` is required."
    );
  });

  test("POST contacts with invalid data", async () => {
    const randomFirstName = faker.person.firstName();
    const randomLastName = faker.person.lastName();
    const invalidBirthdate = faker.lorem.word();
    const contactData = {
      firstName: randomFirstName,
      lastName: randomLastName,
      birthdate: invalidBirthdate,
    };

    const addedContact = await apiController.addContacts(contactData);
    expect(addedContact.errors.birthdate.message).toBe("Birthdate is invalid");
  });
});
