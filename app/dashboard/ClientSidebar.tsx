"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function ClientSidebar({ email }: { email: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
        ☰ Menu
      </button>
      
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ fontSize: "1.25rem", fontWeight: "bold", letterSpacing: "-1px" }}>
            Lead<span style={{ color: "var(--primary)" }}>Enrich</span> AI
          </Link>
          <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
        </div>
        
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
          <Link href="/dashboard" onClick={() => setIsOpen(false)} style={{ padding: "0.75rem 1rem", borderRadius: "0.5rem", fontWeight: "500", background: pathname === "/dashboard" ? "rgba(255,255,255,0.05)" : "transparent", color: pathname === "/dashboard" ? "white" : "var(--muted)" }}>Overview</Link>
          <Link href="/dashboard/apikeys" onClick={() => setIsOpen(false)} style={{ padding: "0.75rem 1rem", borderRadius: "0.5rem", fontWeight: "500", background: pathname === "/dashboard/apikeys" ? "rgba(255,255,255,0.05)" : "transparent", color: pathname === "/dashboard/apikeys" ? "white" : "var(--muted)" }}>API Keys</Link>
          <div style={{ padding: "0.75rem 1rem", borderRadius: "0.5rem", fontWeight: "500", color: "var(--muted)", cursor: "not-allowed", opacity: 0.5 }}>Usage Logs (Pro)</div>
          <div style={{ padding: "0.75rem 1rem", borderRadius: "0.5rem", fontWeight: "500", color: "var(--muted)", cursor: "not-allowed", opacity: 0.5 }}>Billing</div>
        </nav>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
          <div style={{ fontSize: "0.875rem", color: "var(--muted)", marginBottom: "1rem", wordBreak: "break-all" }}>{email}</div>
          <Link href="/login" style={{ fontSize: "0.875rem", color: "#ef4444", fontWeight: "600" }}>Sign Out</Link>
        </div>
      </aside>
      
      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}
    </>
  );
}
