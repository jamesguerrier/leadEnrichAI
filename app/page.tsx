import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="container animate-fade-in" style={{ padding: "4rem 0" }}>
      {/* Navbar */}
      <nav className="nav-container">
        <div style={{ fontSize: "1.5rem", fontWeight: "bold", letterSpacing: "-1px" }}>
          Lead<span style={{ color: "var(--primary)" }}>Enrich</span> AI
        </div>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <Link href="/login" style={{ color: "var(--muted)", fontWeight: "500" }}>Login</Link>
          <Link href="/dashboard" className="btn-primary">Get API Key</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ textAlign: "center", marginBottom: "8rem" }}>
        <h1 className="text-gradient hero-title">
          Trustworthy Lead Enrichment <br /> Powered by AI
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "1.25rem", maxWidth: "700px", margin: "0 auto 3rem" }}>
          Connect a domain to get verified firmographics, deliverability checks, and AI-inferred pain points. Built for modern B2B SaaS teams.
        </p>
        <div className="flex-center">
          <Link href="/dashboard" className="btn-primary" style={{ padding: "1rem 2.5rem", textAlign: "center" }}>Start for free</Link>
          <Link href="#docs" style={{ border: "1px solid var(--border)", padding: "1rem 2.5rem", borderRadius: "0.5rem", fontWeight: "600", textAlign: "center" }}>View Docs</Link>
        </div>
      </section>

      {/* Code Example Section */}
      <section id="docs" style={{ marginBottom: "8rem" }}>
        <div className="glass" style={{ padding: "2rem", overflow: "hidden" }}>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff5f56" }}></div>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ffbd2e" }}></div>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#27c93f" }}></div>
          </div>
          <div className="code-block" style={{ background: "rgba(0,0,0,0.3)", padding: "2rem", borderRadius: "0.5rem", fontFamily: "monospace", fontSize: "0.9rem", lineBreak: "anywhere", overflowX: "auto" }}>
            <span style={{ color: "var(--muted)" }}># 1. Send domain to AI Enrichment Engine</span>
            <br />
            curl -X POST https://api.leadenrich.io/v1/enrich \<br />
            &nbsp;&nbsp;-H "x-api-key: sk_live_ab12cd...secret" \<br />
            &nbsp;&nbsp;-d '{`{"domain": "stripe.com"}`}'
            <br />
            <br />
            <span style={{ color: "var(--muted)" }}># 2. Get Trustworthy, Confidence-Scored JSON</span>
            <br />
<pre style={{ margin: 0 }}>{`{
  "success": true,
  "data": {
    "domain": "stripe.com",
    "firmographics": {
      "industry": "Financial Services",
      "employeeCount": { "range": "5000-10000", "confidence": 0.7, "source": "ai_inference" }
    },
    "dataFreshness": {
      "firmographics": "2026-03-24T12:00:00.000Z"
    },
    "leadScore": {
      "overall": 92,
      "interpretation": "High Fit: Enterprise fintech leader with extensive tech adoption."
    },
    "domainIntelligence": {
      "spf": { "value": "v=spf1 include:_spf.google.com ~all", "confidence": 1.0, "source": "verified" }
    }
  }
}`}</pre>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid-3" style={{ marginBottom: "8rem" }}>
        <div className="premium-card">
          <h3 style={{ marginBottom: "1rem" }}>🤖 Gemini AI Core</h3>
          <p style={{ color: "var(--muted)" }}>Powered by advanced LLMs to infer pain points, categorize tech stacks, and assign accurate lead scores automatically.</p>
        </div>
        <div className="premium-card">
          <h3 style={{ marginBottom: "1rem" }}>🛡️ Hallucination-Free</h3>
          <p style={{ color: "var(--muted)" }}>Every payload enforces strict confidence scores. Verified fields (DNS, MX, SPF) are flagged directly to ensure 100% trust.</p>
        </div>
        <div className="premium-card">
          <h3 style={{ marginBottom: "1rem" }}>🌍 Real-Time Freshness</h3>
          <p style={{ color: "var(--muted)" }}>No stale batch data. Each request performs a live scrape and injects a real-time ISO timestamp for data freshness.</p>
        </div>
      </section>

      {/* Pricing / CTA */}
      <section className="pricing-section" style={{ textAlign: "center", padding: "6rem", background: "linear-gradient(180deg, var(--background) 0%, rgba(99, 102, 241, 0.05) 100%)", borderRadius: "2rem" }}>
        <h2 style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>Simple, usage-based pricing</h2>
        <p style={{ color: "var(--muted)", marginBottom: "3rem" }}>1,000 requests for free. $10 for every 5,000 additional requests.</p>
        <Link href="/dashboard" className="btn-primary" style={{ padding: "1.25rem 3rem", fontSize: "1.1rem" }}>Get Your API Key Now</Link>
      </section>

      <footer style={{ marginTop: "8rem", padding: "4rem 0", borderTop: "1px solid var(--border)", textAlign: "center", color: "var(--muted)" }}>
        &copy; 2026 LeadEnrich AI. Built for modern B2B SaaS.
      </footer>
    </main>
  );
}
