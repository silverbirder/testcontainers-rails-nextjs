import { chromium } from "@playwright/test";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import axios from "axios";
import {
  DockerComposeEnvironment,
  GenericContainer,
  StartedDockerComposeEnvironment,
  StartedTestContainer,
} from "testcontainers";
import path from "path";

describe("Docker Compose Integration Test", () => {
  let apiEnvironment: StartedDockerComposeEnvironment;
  let apiUrl: string;
  let webContainer: StartedTestContainer;
  let webUrl: string;

  beforeAll(async () => {
    const apiPath = path.resolve(__dirname, "../../apps/api");
    const apiComposeFileName = "docker-compose.yml";
    apiEnvironment = await new DockerComposeEnvironment(
      apiPath,
      apiComposeFileName
    ).up();

    const apiContainer = apiEnvironment.getContainer("testcontainers_api");
    const networks = apiContainer.getNetworkNames();
    const networkName = networks[0] ?? "";
    const host = apiContainer.getIpAddress(networkName);
    const port = apiContainer.getMappedPort(3000);
    apiUrl = `http://${host}:${port}`;
    console.log({ apiUrl });

    const webPath = path.resolve(__dirname, "../../apps/web");
    webContainer = await (
      await GenericContainer.fromDockerfile(webPath).build()
    )
      .withEnvironment({ NEXT_PUBLIC_API_URL: apiUrl })
      .withExposedPorts(3200)
      .withNetworkMode(networkName)
      .start();

    const webPort = webContainer.getMappedPort(3200);
    webUrl = `http://${webContainer.getHost()}:${webPort}`;
  });

  afterAll(async () => {
    await webContainer.stop({ remove: true, removeVolumes: true });
    await apiEnvironment.down({ removeVolumes: true });
  });

  // beforeEach(async () => {
  //   const apiContainer = apiEnvironment.getContainer("testcontainers_api");
  //   await apiContainer.exec(["bin/rails", "db:reset"]);
  // });

  // it("should access the /todos endpoint and return data", async () => {
  //   // Act
  //   const response = await axios.get(`${apiUrl}/todos`);

  //   // Assert
  //   expect(response.status).toBe(200);
  //   expect(response.data).toHaveLength(3);
  // });

  // it("should delete all todos using a Rails command", async () => {
  //   // Arrange
  //   const apiContainer = apiEnvironment.getContainer("testcontainers_api");
  //   await apiContainer.exec(["bin/rails", "runner", "Todo.delete_all"]);

  //   // Act
  //   const response = await axios.get(`${apiUrl}/todos`);

  //   // Assert
  //   expect(response.status).toBe(200);
  //   expect(response.data).toEqual([]);
  // });

  it("Access web", async () => {
    const todosPageUrl = `${webUrl}`;

    // Act
    const response = await axios.get(todosPageUrl);

    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(todosPageUrl);
    await page.screenshot({ path: "screenshots/screenshot-1.png" });

    // Assert
    expect(response.status).toBe(200);
  });
});
