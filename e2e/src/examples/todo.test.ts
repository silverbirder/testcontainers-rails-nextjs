import { expect, test } from "@playwright/test";
import { TodoPage } from "../pages/todo/todo.page";

test("sample todo page", async ({ page }) => {
  const todoPage = new TodoPage(page);
  await todoPage.navigate("http://localhost:3200");
  const newTodo = "new todo";
  await todoPage.addTodo(newTodo);
  await todoPage.toggleTodo(newTodo);
  await todoPage.saveAllTodos();
  await todoPage.navigate("http://localhost:3200");

  const todos = await todoPage.getTodos();
  expect(todos).toContainEqual({ name: newTodo, checked: true });
});
