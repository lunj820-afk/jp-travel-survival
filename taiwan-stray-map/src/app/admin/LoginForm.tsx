"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
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
      router.refresh();
    } else {
      setError("密碼錯誤");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-3">
      <h1 className="text-lg font-black text-coffee">🛠 管理後台登入</h1>
      <p className="text-xs text-muted">
        這是 Phase 1 的簡易密碼保護，僅適合開發／內部使用。正式上線請改用 Supabase Auth。
      </p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="管理密碼"
        className="w-full rounded-lg border border-border px-3 py-2 text-sm"
      />
      {error && <p className="text-sm" style={{ color: "var(--status-red)" }}>{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-brand text-white font-bold py-2.5 disabled:opacity-60"
      >
        {loading ? "登入中…" : "登入"}
      </button>
    </form>
  );
}
