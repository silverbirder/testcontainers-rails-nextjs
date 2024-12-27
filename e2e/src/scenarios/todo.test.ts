import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { StartedTestContainer } from "testcontainers";
import { setupApiContainer, setupWebContainer } from "../setup";
import { chromium } from "@playwright/test";
import { TodoPage } from "../pages";

describe("Todo", () => {
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
});
