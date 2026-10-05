import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar email={session.email} />
      <main className="min-h-screen px-5 pb-12 pt-24 md:ml-64 md:px-8 md:pt-12">
        {children}
      </main>
    </div>
  );
}
