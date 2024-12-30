import { Locator, Page } from "@playwright/test";

export class TodoPage {
  page: Page;
  newTodoInput: Locator;
  addButton: Locator;
  todoItems: Locator;
  todoCheckbox: (name: string) => Locator;
  deleteButton: (name: string) => Locator;
  saveAllButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newTodoInput = page.getByPlaceholder("Add a new todo");
    this.addButton = page.getByRole("button", { name: "Add" });
    this.todoItems = page.locator(".todo-list li");
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
   * Get all visible todo items.
   */
  async getTodos() {
    return this.todoItems.allTextContents();
  }
}
