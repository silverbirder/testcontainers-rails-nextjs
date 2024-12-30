export type Todo = {
  id: number;
  name: string;
  checked: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch(`${API_URL}/todos`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }
  return response.json();
}

export async function createTodo(
  name: string,
  checked?: boolean
): Promise<Todo> {
  const response = await fetch(`${API_URL}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ todo: { name, checked: checked ?? false } }),
  });

  if (!response.ok) {
    throw new Error("Failed to create todo");
  }

  return response.json();
}

export async function deleteTodos(): Promise<void> {
  const response = await fetch(`${API_URL}/todos`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete todos");
  }
}
