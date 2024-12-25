import { describe, it, expect, beforeAll, afterAll } from "vitest";
import {
  DockerComposeEnvironment,
  StartedDockerComposeEnvironment,
} from "testcontainers";
import path from "path";

describe("Docker Compose Integration Test", () => {
  let apiEnvironment: StartedDockerComposeEnvironment;
  beforeAll(async () => {
    const apiPath = path.resolve(__dirname, "../../apps/api");
    const apiComposeFileName = "docker-compose.yml";
    apiEnvironment = await new DockerComposeEnvironment(
      apiPath,
      apiComposeFileName
    ).up();
  });
  afterAll(async () => {
    await apiEnvironment.down();
  });

  it("should start services defined in docker-compose.yml", async () => {
    const mysqlContainer = apiEnvironment.getContainer("testcontainers_api_db");
    const host = mysqlContainer.getHost();
    const port = mysqlContainer.getMappedPort(3306);
    expect(host).toBe("localhost");
    expect(port).toBeGreaterThan(0);
  });
});
