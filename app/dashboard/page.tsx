import dbConnect from "@/lib/mongodb";
import ApiKey from "@/models/ApiKey";
import User from "@/models/User";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardOverview() {
  const session = await getAuthSession();
  if (!session) redirect("/login");

  await dbConnect();
  const user = await User.findById(session.userId);
  const apiKeys = await ApiKey.find({ userId: session.userId });

  const totalUsed = apiKeys.reduce((acc, key) => acc + key.requestsUsed, 0);
  const totalLimit = apiKeys.reduce((acc, key) => acc + key.requestsLimit, 0);

  return (
    <div className="animate-fade-in dashboard-wrapper" style={{ padding: "0" }}>
      <header className="dashboard-header">
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: "700" }}>Dashboard</h1>
          <p style={{ color: "var(--muted)" }}>Welcome back, {user?.email}</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href="/dashboard/apikeys" className="btn-primary">Manage Keys</Link>
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="premium-card">
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Total Usage</p>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold" }}>{totalUsed.toLocaleString()}</div>
          <p style={{ fontSize: "0.875rem", color: "var(--accent)", marginTop: "0.5rem" }}>Across {apiKeys.length} keys</p>
        </div>
        <div className="premium-card">
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Monthly Limit</p>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold" }}>{totalLimit.toLocaleString()}</div>
          <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: "0.5rem" }}>Plan: <span style={{ color: "var(--primary)", textTransform: "uppercase", fontWeight: "600" }}>{user?.plan}</span></p>
        </div>
        <div className="premium-card">
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Utility Health</p>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold" }}>100%</div>
          <p style={{ fontSize: "0.875rem", color: "var(--accent)", marginTop: "0.5rem" }}>All systems operational</p>
        </div>
      </div>

      <div className="premium-card" style={{ padding: "0" }}>
        <div style={{ padding: "2rem", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: "1.25rem" }}>Recent API Usage</h3>
        </div>
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--muted)" }}>
          {totalUsed === 0 ? (
            <div style={{ padding: "4rem 0" }}>
              <p>No usage data available yet.</p>
              <Link href="/dashboard/apikeys" style={{ color: "var(--primary)", display: "block", marginTop: "1rem" }}>Generate an API key to get started &rarr;</Link>
            </div>
          ) : (
            <div style={{ textAlign: "left" }}>
              {/* Detailed logs would go here, fetching from UsageLog model */}
              <p>Detailed logs implementation in progress...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
