import { fetchTodos } from "@/pages/todo/action";
import Page from "@/pages/todo/page";

export default async function Home() {
  const todos = await fetchTodos();
  return (
    <Page todos={todos} />
  );
}
