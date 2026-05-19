"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Invalid password. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-[#0C0D1F] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#DDED3C] rounded-xl mb-4">
            <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
              <text x="5" y="28" fontSize="20" fontWeight="900" fill="#0C0D1F" fontFamily="sans-serif">
                JF
              </text>
            </svg>
          </div>
          <h1 className="text-2xl font-black text-white">Admin Login</h1>
          <p className="text-white/40 text-sm mt-1">Enter your password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#13142B] rounded-2xl p-6">
          <label className="block text-sm font-medium text-white/60 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#0C0D1F] border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#DDED3C] transition-colors mb-4"
            placeholder="Enter password..."
            required
            autoFocus
          />

          {error && (
            <p className="text-red-400 text-sm mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#DDED3C] text-[#0C0D1F] font-bold py-3 rounded-xl hover:bg-[#c8d836] transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
