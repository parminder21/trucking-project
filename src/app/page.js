import { redirect } from "next/navigation";

export default function Home() {
  // Immediately redirect to /login when someone visits /
  redirect("/login");
}
