import { redirect } from "next/navigation";
import BookingExperience from "@/components/BookingExperience";
import { getSessionUser } from "@/lib/auth";
import { siteConfig } from "@/config/site";

type BookingPageProps = {
  searchParams?: {
    service?: string | string[];
  };
};

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const requestedService = Array.isArray(searchParams?.service)
    ? searchParams?.service[0]
    : searchParams?.service;
  const initialServiceId = siteConfig.services.some((service) => service.id === requestedService)
    ? String(requestedService)
    : siteConfig.services[0]?.id || "";
  const user = await getSessionUser();

  if (!user) {
    const redirectTo = requestedService ? `/booking?service=${encodeURIComponent(requestedService)}` : "/booking";
    redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  return <BookingExperience initialServiceId={initialServiceId} user={user} />;
}
