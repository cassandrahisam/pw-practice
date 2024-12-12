import { test, expect } from "@playwright/test";
import apiController from "../controller/apiController";
import { addContact, createUser, GetContacts } from "../controller/apiResponseModels";
import { authController } from "../utils/auth.setup";
import { faker } from "@faker-js/faker";

const firstName = faker.person.firstName();
const lastName = faker.person.lastName();
const email = faker.internet.email();
const pass = faker.internet.password();

test.beforeAll(async () => {
  // Create new user
  await authController.init();

  const userDetails: createUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: pass,
  };

  await authController.createUser(userDetails);

  // Create contact for the created user
  await apiController.init();

  const randomFirstName = faker.person.firstName();
  const randomLastName = faker.person.lastName();
  const contactData = {
    firstName: randomFirstName,
    lastName: randomLastName,
  };

  const req = await apiController.addContacts(contactData);
  await expect(req).toBeOK();
});

test.afterAll(async () => {
  // Delete created user
  await apiController.deleteUser();
});

test.describe("GET API tests", () => {
  test("GET all contacts", async () => {
    const contacts: GetContacts[] = await apiController.getContacts();

    const expectedResponse = {
      _id: expect.any(String),
      firstName: expect.any(String),
      lastName: expect.any(String),
      owner: expect.any(String),
      __v: expect.any(Number),
    };

    expect(contacts[0]).toMatchObject(expectedResponse);
  });
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

    const req = await apiController.addContacts(contactData);
    const addedContact = await req.json();

    await expect(req).toBeOK();
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

    const req = await apiController.addContacts(contactData);
    const addedContact = await req.json();

    await expect(req).not.toBeOK();
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

    const req = await apiController.addContacts(contactData);
    const addedContact = await req.json();

    await expect(req).not.toBeOK();
    expect(addedContact.errors.birthdate.message).toBe("Birthdate is invalid");
  });
});
