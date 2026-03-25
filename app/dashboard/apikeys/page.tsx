"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ApiKeyData {
  _id: string;
  name: string;
  keyPrefix: string;
  requestsUsed: number;
  requestsLimit: number;
  revoked: boolean;
  createdAt: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    // Note: We need another API to list keys, but for now we'll simulate or add the route
    // For the sake of this demo, let's assume this endpoint exists
    try {
      const res = await fetch("/api/apikey/list"); 
      const data = await res.json();
      if (data.success) setKeys(data.data);
    } catch (e) {
      console.error("Failed to fetch keys");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await fetch("/api/apikey/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedKey(data.data.apiKey);
        setNewKeyName("");
        // In a real app, we'd refresh the list or add the new key metadata
      }
    } catch (e) {
      alert("Failed to create key");
    } finally {
      setIsCreating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this key? This cannot be undone.")) return;
    try {
      const res = await fetch("/api/apikey/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyId: id }),
      });
      const data = await res.json();
      if (data.success) {
        setKeys(keys.map(k => k._id === id ? { ...k, revoked: true } : k));
      }
    } catch (e) {
      alert("Failed to revoke key");
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: "2rem" }}>
      <header style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "700" }}>API Keys</h1>
        <p style={{ color: "var(--muted)" }}>Manage your credentials for the LeadEnrich API</p>
      </header>

      {/* New Key Form */}
      <div className="premium-card" style={{ marginBottom: "3rem" }}>
        <h3 style={{ marginBottom: "1.5rem" }}>Generate New API Key</h3>
        {generatedKey ? (
          <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid var(--accent)", padding: "1.5rem", borderRadius: "0.5rem" }}>
            <p style={{ color: "var(--accent)", fontWeight: "600", marginBottom: "0.5rem" }}>Key generated successfully!</p>
            <p style={{ fontSize: "0.875rem", marginBottom: "1rem" }}>Copy this key now. You won't be able to see it again.</p>
            <div className="flex-col-mobile" style={{ display: "flex", gap: "1rem" }}>
              <input readOnly value={generatedKey} className="glass" style={{ flex: 1, padding: "0.75rem", color: "white" }} />
              <button onClick={() => { navigator.clipboard.writeText(generatedKey); alert("Copied!"); }} className="btn-primary">Copy</button>
            </div>
            <button onClick={() => { setGeneratedKey(null); fetchKeys(); }} style={{ marginTop: "1rem", color: "var(--muted)", textDecoration: "underline" }}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="flex-col-mobile" style={{ display: "flex", gap: "1rem" }}>
            <input 
              required 
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="glass" 
              style={{ flex: 1, padding: "0.75rem", color: "white" }} 
              placeholder="e.g. Production Secret Key" 
            />
            <button type="submit" disabled={isCreating} className="btn-primary">
              {isCreating ? "Generating..." : "Generate Key"}
            </button>
          </form>
        )}
      </div>

      {/* Keys List */}
      <div className="premium-card" style={{ padding: "0", overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: "800px", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ color: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
              <th style={{ padding: "1.5rem 2rem" }}>Name</th>
              <th style={{ padding: "1.5rem 2rem" }}>Key</th>
              <th style={{ padding: "1.5rem 2rem" }}>Usage</th>
              <th style={{ padding: "1.5rem 2rem" }}>Status</th>
              <th style={{ padding: "1.5rem 2rem" }}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: "4rem", textAlign: "center" }}>Loading keys...</td></tr>
            ) : keys.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: "4rem", textAlign: "center", color: "var(--muted)" }}>No API keys found.</td></tr>
            ) : (
              keys.map((key) => (
                <tr key={key._id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "1.5rem 2rem", fontWeight: "600" }}>{key.name}</td>
                  <td style={{ padding: "1.5rem 2rem", fontFamily: "monospace", color: "var(--muted)" }}>
                    sk_live_{key.keyPrefix}••••••••
                  </td>
                  <td style={{ padding: "1.5rem 2rem" }}>
                    <div style={{ fontSize: "0.875rem" }}>{key.requestsUsed} / {key.requestsLimit}</div>
                    <div style={{ height: "4px", width: "100px", background: "var(--border)", borderRadius: "2px", marginTop: "0.5rem" }}>
                      <div style={{ height: "100%", borderRadius: "2px", background: "var(--primary)", width: `${Math.min((key.requestsUsed / key.requestsLimit) * 100, 100)}%` }}></div>
                    </div>
                  </td>
                  <td style={{ padding: "1.5rem 2rem" }}>
                    <span style={{ 
                      padding: "0.25rem 0.75rem", 
                      borderRadius: "1rem", 
                      fontSize: "0.75rem", 
                      fontWeight: "bold",
                      background: key.revoked ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
                      color: key.revoked ? "#ef4444" : "#10b981"
                    }}>
                      {key.revoked ? "REVOKED" : "ACTIVE"}
                    </span>
                  </td>
                  <td style={{ padding: "1.5rem 2rem", textAlign: "right" }}>
                    {!key.revoked && (
                      <button onClick={() => handleRevoke(key._id)} style={{ color: "#ef4444", fontWeight: "600", fontSize: "0.875rem" }}>Revoke</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
