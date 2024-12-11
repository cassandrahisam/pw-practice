import { APIRequestContext, request } from "@playwright/test";
import config from "../playwright.config";
import { GetContacts } from "./apiResponseModels";
import { authController } from "../utils/auth.setup";

class APIController {
  private apiRequest: APIRequestContext;
  private token: string | null = null;

  async init() {
    const token = authController.getAuthToken();

    if (!config.use || !config.use.baseURL) {
      throw new Error("Base URL is not defined in the config");
    }

    this.apiRequest = await request.newContext({
      baseURL: config.use.baseURL,
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
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

    return response;
  }

  async createUser(userDetails) {
    const response = await this.apiRequest.post("/users", {
      data: userDetails,
    });

    return response;
  }

  async deleteUser() {
    const response = await this.apiRequest.delete("/users/me");

    if (response.ok()) {
      return response;
    } else {
      throw new Error(
        `Failed to delete user. STATUS: ${response.status()}\n RESPONSE BODY: ${await response.text()}`
      );
    }
  }
}

export default new APIController();
