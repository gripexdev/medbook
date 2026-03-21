import { redirect } from "next/navigation";
import AuthExperience from "@/components/AuthExperience";
import { getSessionUser, sanitizeRedirectPath } from "@/lib/auth";

type LoginPageProps = {
  searchParams?: {
    redirectTo?: string | string[];
  };
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const requestedRedirect = Array.isArray(searchParams?.redirectTo)
    ? searchParams?.redirectTo[0]
    : searchParams?.redirectTo;
  const redirectTo = sanitizeRedirectPath(requestedRedirect);
  const user = await getSessionUser();

  if (user) {
    redirect(redirectTo);
  }

  return <AuthExperience mode="login" redirectTo={redirectTo} />;
}
