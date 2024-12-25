import { fetchTodos } from "@/components/todo/action";
import Page from "@/components/todo/page";

export default async function Home() {
  const todos = await fetchTodos();
  return (
    <Page todos={todos} />
  );
}
