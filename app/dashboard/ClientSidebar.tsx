"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function ClientSidebar({ email }: { email: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg> },
    { label: "API Keys", href: "/dashboard/apikeys", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg> },
  ];

  return (
    <>
      <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)} style={{ background: "rgba(56, 189, 248, 0.1)", color: "var(--primary)", border: "1px solid rgba(56, 189, 248, 0.2)" }}>
        ☰ Menu
      </button>
      
      <aside className={`sidebar ${isOpen ? "open" : ""}`} style={{ background: "rgba(2, 6, 23, 0.8)", backdropFilter: "blur(20px)", borderRight: "1px solid var(--border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
          <Link href="/" style={{ fontSize: "1.25rem", fontWeight: "800", letterSpacing: "-0.04em", fontFamily: "var(--font-display)" }}>
            Lead<span style={{ color: "var(--primary)" }}>Enrich</span> AI
          </Link>
          <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
        </div>
        
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1 }}>
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              onClick={() => setIsOpen(false)} 
              style={{ 
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.875rem 1.25rem", 
                borderRadius: "0.75rem", 
                fontWeight: "500", 
                fontSize: "0.95rem",
                transition: "all 0.3s ease",
                background: pathname === item.href ? "rgba(56, 189, 248, 0.08)" : "transparent", 
                color: pathname === item.href ? "var(--primary)" : "var(--muted)",
                border: pathname === item.href ? "1px solid rgba(56, 189, 248, 0.1)" : "1px solid transparent"
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
          
          <div style={{ padding: "0.875rem 1.25rem", borderRadius: "0.75rem", fontWeight: "500", color: "var(--muted)", cursor: "not-allowed", opacity: 0.4, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Usage Logs (Pro)
          </div>
          <div style={{ padding: "0.875rem 1.25rem", borderRadius: "0.75rem", fontWeight: "500", color: "var(--muted)", cursor: "not-allowed", opacity: 0.4, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
            Billing
          </div>
        </nav>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "2rem", marginTop: "2rem" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "1rem", wordBreak: "break-all", opacity: 0.8, fontWeight: "500" }}>{email}</div>
          <Link 
            href="/login" 
            className="logout-link"
            style={{ 
              fontSize: "0.9rem", 
              color: "#ef4444", 
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 0",
              transition: "opacity 0.2s ease"
            }}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Sign Out
          </Link>
        </div>
      </aside>
      
      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}></div>}
    </>
  );
}
