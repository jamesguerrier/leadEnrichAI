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
  const totalLimit = apiKeys.length > 0 
    ? apiKeys.reduce((acc, key) => acc + key.requestsLimit, 0)
    : (user?.plan === "pro" ? 10000 : 1000);

  return (
    <div className="animate-fade-in dashboard-wrapper" style={{ padding: "0" }}>
      <header className="dashboard-header">
        <div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "800", fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>Dashboard</h1>
          <p style={{ color: "var(--muted)", fontSize: "1.1rem" }}>Welcome back, <span style={{ color: "var(--foreground)", fontWeight: "500" }}>{user?.email}</span></p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href="/dashboard/apikeys" className="btn-primary">Manage Keys</Link>
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="premium-card" style={{ background: "linear-gradient(135deg, rgba(56, 189, 248, 0.05) 0%, rgba(255,255,255,0.02) 100%)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Usage</p>
            <div style={{ padding: "0.5rem", background: "rgba(56, 189, 248, 0.1)", borderRadius: "0.5rem", color: "var(--primary)" }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
          </div>
          <div style={{ fontSize: "3rem", fontWeight: "800", fontFamily: "var(--font-display)" }}>{totalUsed.toLocaleString()}</div>
          <p style={{ fontSize: "0.9rem", color: "var(--primary)", marginTop: "1rem", fontWeight: "500" }}>Across {apiKeys.length} active keys</p>
        </div>

        <div className="premium-card" style={{ background: "linear-gradient(135deg, rgba(129, 140, 248, 0.05) 0%, rgba(255,255,255,0.02) 100%)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>Monthly Limit</p>
            <div style={{ padding: "0.5rem", background: "rgba(129, 140, 248, 0.1)", borderRadius: "0.5rem", color: "var(--accent)" }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
          <div style={{ fontSize: "3rem", fontWeight: "800", fontFamily: "var(--font-display)" }}>{totalLimit.toLocaleString()}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}>
            <span style={{ fontSize: "0.9rem", color: "var(--muted)" }}>Current Plan:</span>
            <span style={{ fontSize: "0.8rem", background: "var(--accent)", color: "white", padding: "0.2rem 0.6rem", borderRadius: "1rem", fontWeight: "700", textTransform: "uppercase" }}>{user?.plan}</span>
          </div>
        </div>

        <div className="premium-card" style={{ background: "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(255,255,255,0.02) 100%)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>Utility Health</p>
            <div style={{ padding: "0.5rem", background: "rgba(16, 185, 129, 0.1)", borderRadius: "0.5rem", color: "#10b981" }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </div>
          </div>
          <div style={{ fontSize: "3rem", fontWeight: "800", fontFamily: "var(--font-display)" }}>100%</div>
          <p style={{ fontSize: "0.9rem", color: "#10b981", marginTop: "1rem", fontWeight: "500" }}>Enrichment clusters active</p>
        </div>
      </div>

      <div className="glass" style={{ padding: "0", overflow: "hidden", border: "1px solid var(--border)" }}>
        <div style={{ padding: "2rem", borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.01)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "700", fontFamily: "var(--font-display)" }}>Recent API Usage</h3>
          <button style={{ fontSize: "0.875rem", color: "var(--primary)", fontWeight: "600", background: "none" }}>View full logs &rarr;</button>
        </div>
        <div style={{ padding: "3rem", textAlign: "center", color: "var(--muted)" }}>
          {totalUsed === 0 ? (
            <div style={{ padding: "4rem 0" }}>
              <div style={{ width: "64px", height: "64px", margin: "0 auto 1.5rem", background: "rgba(255,255,255,0.03)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <p style={{ fontSize: "1.1rem" }}>No usage data available yet.</p>
              <Link href="/dashboard/apikeys" style={{ color: "var(--primary)", display: "inline-block", marginTop: "1.5rem", fontWeight: "600", textDecoration: "underline" }}>Build your first integration now</Link>
            </div>
          ) : (
            <div style={{ textAlign: "left" }}>
              <p>Detailed logs implementation in progress...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
