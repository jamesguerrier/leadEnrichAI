import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ClientSidebar from "./ClientSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();
  if (!session) redirect("/login");

  return (
    <div className="dashboard-layout">
      <ClientSidebar email={session.email} />
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
}
