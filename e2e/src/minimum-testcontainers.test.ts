import { describe, it, expect } from "vitest";
import { MySqlContainer } from "@testcontainers/mysql";

describe("MySQL Container Test", () => {
  it("should start a MySQL container and connect", async () => {
    // Arrange
    const container = await new MySqlContainer()
      .withDatabase("testdb")
      .withUsername("testuser")
      .withRootPassword("testpass")
      .start();

    // Act
    const host = container.getHost();
    const port = container.getPort();
    const database = container.getDatabase();
    const username = container.getUsername();
    const password = container.getRootPassword();

    // Assert
    expect(host).toBe("localhost");
    expect(port).toBeGreaterThan(0);
    expect(database).toBe("testdb");
    expect(username).toBe("testuser");
    expect(password).toBe("testpass");

    // Teardown
    await container.stop();
  });
});
