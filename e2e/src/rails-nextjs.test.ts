import { describe, it, expect, beforeAll, afterAll } from "vitest";
import axios from "axios";
import {
  DockerComposeEnvironment,
  StartedDockerComposeEnvironment,
} from "testcontainers";
import path from "path";

describe("Docker Compose Integration Test", () => {
  let apiEnvironment: StartedDockerComposeEnvironment;
  let apiUrl: string;

  beforeAll(async () => {
    const apiPath = path.resolve(__dirname, "../../apps/api");
    const apiComposeFileName = "docker-compose.yml";
    apiEnvironment = await new DockerComposeEnvironment(
      apiPath,
      apiComposeFileName
    ).up();

    const apiContainer = apiEnvironment.getContainer("testcontainers_api");
    const host = apiContainer.getHost();
    const port = apiContainer.getMappedPort(3000);
    apiUrl = `http://${host}:${port}`;
  });

  afterAll(async () => {
    await apiEnvironment.down();
  });

  it("should access the /todos endpoint and return data", async () => {
    const response = await axios.get(`${apiUrl}/todos`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    console.log("Todos response:", response.data);
  });
});
