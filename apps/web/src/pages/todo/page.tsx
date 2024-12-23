"use client";

import { useState } from "react";
import { createTodo, deleteTodos, fetchTodos, Todo } from "./action";

export default function Page({ todos: initialTodos }: { todos: Todo[] }) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [newTodo, setNewTodo] = useState("");

  const handleAddTodo = () => {
    if (!newTodo.trim()) return;
    setTodos((prevTodos) => [
      ...prevTodos,
      { id: Date.now(), name: newTodo, checked: false },
    ]);
    setNewTodo("");
  };

  const handleToggleTodo = (id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, checked: !todo.checked } : todo
      )
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const handleSaveTodos = async () => {
    await deleteTodos();
    for (const todo of todos) {
      await createTodo(todo.name);
    }
    const updatedTodos = await fetchTodos();
    setTodos(updatedTodos);
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center gap-8">
      <div className="flex gap-4">
        <input
          className="border rounded p-2"
          type="text"
          placeholder="Add a new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleAddTodo}
        >
          Add
        </button>
      </div>
      <ul className="w-full max-w-md">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center border-b py-2"
          >
            <span
              className={`flex-1 cursor-pointer ${
                todo.checked ? "line-through text-gray-500" : ""
              }`}
              onClick={() => handleToggleTodo(todo.id)}
            >
              {todo.name}
            </span>
            <input
              type="checkbox"
              checked={todo.checked}
              onChange={() => handleToggleTodo(todo.id)}
            />
            <button
              className="ml-4 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              data-testid={`delete-todo-${todo.name}`}
              onClick={() => handleDeleteTodo(todo.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        onClick={handleSaveTodos}
      >
        Save All
      </button>
    </div>
  );
}
