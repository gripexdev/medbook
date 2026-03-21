import DashboardExperience from "@/components/DashboardExperience";
import { requireSessionUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireSessionUser("/dashboard");

  return <DashboardExperience user={user} />;
}
