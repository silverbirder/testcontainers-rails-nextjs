import { describe, it, beforeAll, afterAll, beforeEach, expect } from "vitest";
import { StartedTestContainer } from "testcontainers";
import { setupApiContainer, setupWebContainer } from "../setup";
import { chromium } from "@playwright/test";
import { TodoPage } from "../pages";

describe("Todo App", () => {
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

    const webSetup = await setupWebContainer(
      apiInternalUrl,
      apiPublicUrl,
      networkName
    );
    webContainer = webSetup.webContainer;
    webHost = webSetup.webHost;
    teardownWeb = webSetup.teardown;
  });

  afterAll(async () => {
    await teardownWeb();
    await teardownApi();
  });

  beforeEach(async () => {
    await apiContainer.exec(["bin/rails", "runner", "Todo.delete_all"]);
  });

  it("should allow adding, toggling, and deleting a todo item successfully", async () => {
    // Arrange
    const todosPageUrl = `${webHost}`;
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const todoPage = new TodoPage(page);
    await todoPage.navigate(todosPageUrl);

    // Act
    const newTodo = "new Todo";
    await todoPage.addTodo(newTodo);
    await todoPage.toggleTodo(newTodo);
    await todoPage.deleteTodoByName(newTodo);

    // Assert
    const todos = await todoPage.getTodos();
    expect(todos).toHaveLength(0);

    await browser.close();
  });

  it("should save a todo item and persist it after reload", async () => {
    // Arrange
    const todosPageUrl = `${webHost}`;
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const todoPage = new TodoPage(page);
    await todoPage.navigate(todosPageUrl);

    // Act
    const newTodo = "persistent Todo";
    await todoPage.addTodo(newTodo);
    await todoPage.saveAllTodos();
    await page.waitForTimeout(1000); // BAD!
    await todoPage.navigate(todosPageUrl);

    // Assert
    const todos = await todoPage.getTodos();
    expect(todos).toHaveLength(1);
    expect(todos[0]).toEqual({ name: newTodo, checked: false });

    await browser.close();
  });
});
