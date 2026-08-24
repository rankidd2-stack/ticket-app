import { requireUser } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="flex">
      <Sidebar orgName={user.organization.name} />
      <main className="min-h-screen flex-1 overflow-y-auto px-8 py-8">
        {children}
      </main>
    </div>
  );
}
