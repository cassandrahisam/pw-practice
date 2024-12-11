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
        Authorization: `Bearer {token}`,
      },
    });
  }

  async getContacts() {
    const response = await this.apiRequest.get("contacts");
    const responseBody: GetContacts[] = await response.json();
    return responseBody;
  }

  async addContacts(contactData) {
    const response = await this.apiRequest.post("/contacts", {
      data: contactData,
    });

    return await response.json();
  }

  async addUser(userDetails) {
    const response = await this.apiRequest.post("/contacts", {
      data: userDetails,
    });

    return await response.json();
  }
}

export default new APIController();
