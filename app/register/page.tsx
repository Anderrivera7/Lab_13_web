import { redirectIfNotCanonical } from "@/lib/redirect-if-not-canonical";
import RegisterForm from "./RegisterForm";

export default async function RegisterPage() {
  await redirectIfNotCanonical("/register");
  return <RegisterForm />;
}
