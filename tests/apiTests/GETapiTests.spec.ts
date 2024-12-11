import { test, expect } from "@playwright/test";
import apiController from "../../controller/apiController";
import { GetContacts } from "../../controller/apiResponseModels";

test.beforeAll(async () => {
  await apiController.init();
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
