import { expect, test } from "@playwright/test";
import { TodoPage } from "../pages/todo/todo.page";

test("sample todo page", async ({ page }) => {
  const todoPage = new TodoPage(page);
  await todoPage.navigate("http://localhost:3200");
  const newTodo = "new todo";
  await todoPage.addTodo(newTodo);
  await todoPage.toggleTodo(newTodo);
  await todoPage.deleteTodoByName(newTodo);

  const todos = await todoPage.getTodos();
  expect(todos).not.toContain(newTodo);
});
