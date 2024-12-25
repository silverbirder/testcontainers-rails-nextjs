import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
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
    await apiEnvironment.down({ removeVolumes: true });
  });

  beforeEach(async () => {
    const apiContainer = apiEnvironment.getContainer("testcontainers_api");
    await apiContainer.exec(["bin/rails", "db:reset"]);
  });

  it("should access the /todos endpoint and return data", async () => {
    // Act
    const response = await axios.get(`${apiUrl}/todos`);

    // Assert
    expect(response.status).toBe(200);
    expect(response.data).toHaveLength(3);
  });

  it("should delete all todos using a Rails command", async () => {
    // Arrange
    const apiContainer = apiEnvironment.getContainer("testcontainers_api");
    await apiContainer.exec(["bin/rails", "runner", "Todo.delete_all"]);

    // Act
    const response = await axios.get(`${apiUrl}/todos`);

    // Assert
    expect(response.status).toBe(200);
    expect(response.data).toEqual([]);
  });
});
