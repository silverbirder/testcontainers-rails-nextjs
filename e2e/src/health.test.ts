import { chromium } from "@playwright/test";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import axios from "axios";
import { StartedTestContainer } from "testcontainers";
import { setupApiContainer, setupWebContainer } from "./setup";

describe("Health check", () => {
  let apiContainer: StartedTestContainer;
  let webContainer: StartedTestContainer;
  let apiPublicUrl: string;
  let apiInternalUrl: string;
  let webHost: string;
  let teardownApi: () => Promise<void>;
  let teardownWeb: () => Promise<void>;

  beforeAll(async () => {
    const apiSetup = await setupApiContainer();
    apiContainer = apiSetup.apiContainer;
    apiInternalUrl = apiSetup.apiInternalUrl;
    apiPublicUrl = apiSetup.apiPublicUrl;
    const networkName = apiSetup.networkName;
    teardownApi = apiSetup.teardown;

    const webSetup = await setupWebContainer(apiInternalUrl, networkName);
    webContainer = webSetup.webContainer;
    webHost = webSetup.webHost;
    teardownWeb = webSetup.teardown;
  });

  afterAll(async () => {
    await teardownWeb();
    await teardownApi();
  });

  it("should perform a web health check", async () => {
    // Arrange
    const todosPageUrl = `${webHost}`;

    // Act
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(todosPageUrl);

    // Assert
    expect(await page.title()).toBe("Create Next App");
  });

  it("should perform an API health check", async () => {
    // Arrange
    const todosEndpoint = `${apiPublicUrl}/todos`;

    // Act
    const response = await axios.get(todosEndpoint);

    // Assert
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });
});
