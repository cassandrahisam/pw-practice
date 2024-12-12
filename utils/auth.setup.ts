import { APIRequestContext, request } from "@playwright/test";
import config from "../playwright.config";
import { createUser } from "../controller/apiResponseModels";

class AuthController {
  private authRequest: APIRequestContext;
  private token: string | null = null;

  async init() {
    if (!config.use || !config.use.baseURL) {
      throw new Error("Base URL is not defined in the config");
    }

    this.authRequest = await request.newContext({
      baseURL: config.use.baseURL,
    });
  }

  async createUser(userDetails: createUser) {
    const response = await this.authRequest.post("/users", {
      data: userDetails,
    });

    if (response.ok()) {
      const responseBody = await response.json();
      this.token = responseBody.token;
      return responseBody;
    } else {
      throw new Error(`Failed to create user: ${response.status()}`);
    }
  }

  getAuthToken() {
    if (!this.token) {
      throw new Error("Bearer token is not available");
    }
    return this.token;
  }
}

export const authController = new AuthController();
