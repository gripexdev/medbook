import { redirect } from "next/navigation";
import AuthExperience from "@/components/AuthExperience";
import { getSessionUser, sanitizeRedirectPath } from "@/lib/auth";

type RegisterPageProps = {
  searchParams?: {
    redirectTo?: string | string[];
  };
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const requestedRedirect = Array.isArray(searchParams?.redirectTo)
    ? searchParams?.redirectTo[0]
    : searchParams?.redirectTo;
  const redirectTo = sanitizeRedirectPath(requestedRedirect);
  const user = await getSessionUser();

  if (user) {
    redirect(redirectTo);
  }

  return <AuthExperience mode="register" redirectTo={redirectTo} />;
}
