"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/dashboard");
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--background)" }}>
      <div className="glass" style={{ width: "100%", maxWidth: "400px", padding: "3rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link href="/" style={{ fontSize: "1.5rem", fontWeight: "bold", letterSpacing: "-1px" }}>
            Lead<span style={{ color: "var(--primary)" }}>Enrich</span>
          </Link>
          <h2 style={{ marginTop: "1rem", fontSize: "1.25rem" }}>{isLogin ? "Welcome back" : "Create your account"}</h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", color: "var(--muted)", marginBottom: "0.5rem" }}>Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass" 
              style={{ width: "100%", padding: "0.75rem 1rem", color: "white" }} 
              placeholder="alex@example.com"
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", color: "var(--muted)", marginBottom: "0.5rem" }}>Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass" 
              style={{ width: "100%", padding: "0.75rem 1rem", color: "white" }} 
              placeholder="••••••••"
            />
          </div>

          {error && <p style={{ color: "#ff5f56", fontSize: "0.875rem", textAlign: "center" }}>{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary" 
            style={{ marginTop: "1rem", width: "100%", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Please wait..." : (isLogin ? "Sign In" : "Sign Up")}
          </button>
        </form>

        <p style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.875rem", color: "var(--muted)" }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ background: "none", color: "var(--primary)", fontWeight: "600", marginLeft: "0.5rem" }}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
