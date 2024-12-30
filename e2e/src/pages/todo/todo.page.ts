import { Locator, Page } from "@playwright/test";

export class TodoPage {
  page: Page;
  newTodoInput: Locator;
  addButton: Locator;
  todoCheckbox: (name: string) => Locator;
  deleteButton: (name: string) => Locator;
  saveAllButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newTodoInput = page.getByPlaceholder("Add a new todo");
    this.addButton = page.getByRole("button", { name: "Add" });
    this.todoCheckbox = (todoName) =>
      page
        .locator(".todo-list li")
        .filter({ hasText: todoName })
        .getByRole("checkbox");
    this.deleteButton = (todoName) =>
      page
        .locator(".todo-list li")
        .filter({ hasText: todoName })
        .getByRole("button");
    this.saveAllButton = page.getByRole("button", { name: "Save All" });
  }

  /**
   * Navigate to the Todo app.
   */
  async navigate(url: string) {
    await this.page.goto(url);
  }

  /**
   * Add a new todo item.
   */
  async addTodo(text: string) {
    await this.newTodoInput.fill(text);
    await this.addButton.click();
  }

  /**
   * Toggle a todo item by its name.
   */
  async toggleTodo(todoName: string) {
    const checkbox = this.todoCheckbox(todoName);
    await checkbox.check();
  }

  /**
   * Delete a todo item by its name.
   */
  async deleteTodoByName(todoName: string) {
    const deleteBtn = this.deleteButton(todoName);
    await deleteBtn.click();
  }

  /**
   * Save all todos.
   */
  async saveAllTodos() {
    await this.saveAllButton.click();
  }

  /**
   * Get all visible todo items with their names and checked status.
   */
  async getTodos() {
    const todoItems = this.page.locator(".todo-list li");
    const results: { name: string; checked: boolean }[] = [];
    const itemsCount = await todoItems.count();

    for (let i = 0; i < itemsCount; i++) {
      const todo = todoItems.nth(i);
      const name = await todo.locator("span").textContent();
      const checked = await todo.locator("input[type='checkbox']").isChecked();
      results.push({ name: name?.trim() || "", checked });
    }

    return results;
  }
}
