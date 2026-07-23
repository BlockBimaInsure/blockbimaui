import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";

export default async function LoginPage() {
  await auth0.startInteractiveLogin();
  redirect("/");
}
