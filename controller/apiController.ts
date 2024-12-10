import { APIRequestContext, request } from "@playwright/test";
import config from "../playwright.config";
import { GetContacts } from "./apiResponseModels";

class APIController {
  private apiRequest: APIRequestContext;
  async init() {
    if (!config.use || !config.use.baseURL) {
      throw new Error("Base URL is not defined in the config");
    }
    this.apiRequest = await request.newContext({
      baseURL: config.use.baseURL,
      extraHTTPHeaders: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzRmNjE0N2FjODQ0MDAwMTNiN2I1N2MiLCJpYXQiOjE3MzM4MzAxMjF9.WFaOk7pP3u1ySU25tkbacAhTgYYkj0DmO16eSOxbyIA`,
      },
    });
  }

  async getContacts() {
    const response = await this.apiRequest.get("contacts");
    const responseBody: GetContacts[] = await response.json();
    return responseBody;
  }

  async addContacts() {
    const response = await this.apiRequest.post("/users/1/todos", {
      data: {
        firstName: "api",
        lastName: "Test",
        birthdate: "1970-01-01",
        email: "jdoe@fake.com",
        phone: "8005555555",
        street1: "1 Main St.",
        street2: "Apartment A",
        city: "Anytown",
        stateProvince: "KS",
        postalCode: "12345",
        country: "USA",
      },
    });

    return await response.json();
  }
}

export default new APIController();
