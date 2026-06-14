import { redirectIfNotCanonical } from "@/lib/redirect-if-not-canonical";
import { SignInFormSuspense } from "./SignInForm";

export default async function SignInPage() {
  await redirectIfNotCanonical("/signIn");
  return <SignInFormSuspense />;
}
