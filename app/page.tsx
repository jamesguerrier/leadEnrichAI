import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="container animate-fade-in" style={{ padding: "4rem 0", position: "relative" }}>
      {/* Decorative Blobs */}
      <div style={{ position: "fixed", top: "-10%", right: "-10%", width: "50%", height: "50%", background: "radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 70%)", filter: "blur(100px)", zIndex: -1 }}></div>
      <div style={{ position: "fixed", bottom: "-10%", left: "-10%", width: "40%", height: "40%", background: "radial-gradient(circle, rgba(129, 140, 248, 0.08) 0%, transparent 70%)", filter: "blur(100px)", zIndex: -1 }}></div>

      {/* Navbar */}
      <nav className="nav-container">
        <div style={{ fontSize: "1.75rem", fontWeight: "800", letterSpacing: "-0.04em", fontFamily: "var(--font-display)" }}>
          Lead<span style={{ color: "var(--primary)" }}>Enrich</span> AI
        </div>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <Link href="/login" style={{ color: "var(--muted)", fontWeight: "500", fontSize: "0.95rem" }}>Login</Link>
          <Link href="/dashboard" className="btn-primary" style={{ fontSize: "0.95rem" }}>Get API Key</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ textAlign: "center", marginBottom: "10rem" }}>
        <h1 className="text-gradient hero-title">
          Trustworthy Lead Enrichment <br /> Powered by AI
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "1.35rem", maxWidth: "800px", margin: "0 auto 3.5rem", lineHeight: "1.5", fontWeight: "400" }}>
          Connect a domain to get verified firmographics, deliverability checks, and AI-inferred pain points. Built for modern B2B SaaS teams.
        </p>
        <div className="flex-center" style={{ gap: "1.5rem" }}>
          <Link href="/dashboard" className="btn-primary" style={{ padding: "1.125rem 3rem", textAlign: "center", fontSize: "1.1rem" }}>Start for free</Link>
          <Link href="#docs" className="glass" style={{ padding: "1.125rem 3rem", borderRadius: "0.75rem", fontWeight: "600", textAlign: "center", background: "rgba(255,255,255,0.03)", fontSize: "1.1rem" }}>View Docs</Link>
        </div>
      </section>

      {/* Code Example Section */}
      <section id="docs" style={{ marginBottom: "10rem" }}>
        <div className="glass" style={{ padding: "0.5rem", borderRadius: "1.75rem", background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)" }}>
          <div className="glass" style={{ padding: "2.5rem", border: "none", background: "rgba(10, 10, 15, 0.4)" }}>
            <div style={{ display: "flex", gap: "0.6rem", marginBottom: "2rem" }}>
              <div style={{ width: "13px", height: "13px", borderRadius: "50%", background: "#ff5f56", opacity: 0.8 }}></div>
              <div style={{ width: "13px", height: "13px", borderRadius: "50%", background: "#ffbd2e", opacity: 0.8 }}></div>
              <div style={{ width: "13px", height: "13px", borderRadius: "50%", background: "#27c93f", opacity: 0.8 }}></div>
            </div>
            <div className="code-block" style={{ background: "rgba(0,0,0,0.4)", padding: "2.5rem", borderRadius: "1rem", border: "1px solid rgba(255,255,255,0.05)", fontFamily: "monospace", fontSize: "0.95rem", lineHeight: "1.7", overflowX: "auto" }}>
              <span style={{ color: "var(--accent)" }}># 1. Send domain to AI Enrichment Engine</span>
              <br />
              <span style={{ color: "var(--primary)" }}>curl</span> -X POST https://api.leadenrich.io/v1/enrich \<br />
              &nbsp;&nbsp;-H <span style={{ color: "var(--accent)" }}>"x-api-key: sk_live_ab12cd...secret"</span> \<br />
              &nbsp;&nbsp;-d <span style={{ color: "var(--accent)" }}>'{"{"}"domain": "stripe.com"{"}"}'</span>
              <br />
              <br />
              <span style={{ color: "var(--accent)" }}># 2. Get Trustworthy, Confidence-Scored JSON</span>
              <br />
              <pre style={{ margin: 0, color: "#cbd5e1" }}>{`{
  "success": true,
  "data": {
    "domain": "stripe.com",
    "firmographics": {
      "industry": "Financial Services",
      "employeeCount": { "range": "5000-10000", "confidence": 0.7, "source": "ai_inference" }
    },
    "leadScore": {
      "overall": 92,
      "interpretation": "High Fit: Enterprise fintech leader..."
    }
  }
}`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid-3" style={{ marginBottom: "12rem", gap: "2.5rem" }}>
        <div className="premium-card">
          <div style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>🤖</div>
          <h3 style={{ marginBottom: "1rem", fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>Gemini AI Core</h3>
          <p style={{ color: "var(--muted)", fontSize: "1.05rem" }}>Powered by advanced LLMs to infer pain points, categorize tech stacks, and assign accurate lead scores automatically.</p>
        </div>
        <div className="premium-card">
          <div style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>🛡️</div>
          <h3 style={{ marginBottom: "1rem", fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>Hallucination-Free</h3>
          <p style={{ color: "var(--muted)", fontSize: "1.05rem" }}>Every payload enforces strict confidence scores. Verified fields (DNS, MX, SPF) are flagged directly to ensure 100% trust.</p>
        </div>
        <div className="premium-card">
          <div style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>🌍</div>
          <h3 style={{ marginBottom: "1rem", fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>Real-Time Freshness</h3>
          <p style={{ color: "var(--muted)", fontSize: "1.05rem" }}>No stale batch data. Each request performs a live scrape and injects a real-time ISO timestamp for data freshness.</p>
        </div>
      </section>

      {/* Pricing / CTA */}
      <section className="pricing-section glass" style={{ textAlign: "center", padding: "6rem 2rem", background: "linear-gradient(135deg, rgba(56, 189, 248, 0.05) 0%, rgba(129, 140, 248, 0.05) 100%)", borderRadius: "3rem", border: "1px solid rgba(56, 189, 248, 0.1)" }}>
        <h2 style={{ fontSize: "3.5rem", marginBottom: "1.5rem", fontFamily: "var(--font-display)", fontWeight: "800" }}>Simple, usage-based pricing</h2>
        <p style={{ color: "var(--muted)", fontSize: "1.25rem", marginBottom: "3.5rem" }}>1,000 requests for free. $10 for every 5,000 additional requests.</p>
        <Link href="/dashboard" className="btn-primary" style={{ padding: "1.35rem 4rem", fontSize: "1.25rem" }}>Get Your API Key Now</Link>
      </section>

      <footer style={{ marginTop: "10rem", padding: "5rem 0", borderTop: "1px solid var(--border)", textAlign: "center", color: "var(--muted)", fontSize: "0.95rem" }}>
        &copy; 2026 LeadEnrich AI. Built for modern B2B SaaS.
      </footer>
    </main>
  );
}
