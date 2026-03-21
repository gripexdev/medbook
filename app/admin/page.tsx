import AdminExperience from "@/components/AdminExperience";
import { requireAdminUser } from "@/lib/auth";

export default async function AdminPage() {
  const user = await requireAdminUser("/admin");

  return <AdminExperience user={user} />;
}
