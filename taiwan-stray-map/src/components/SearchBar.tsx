"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ placeholder }: { placeholder?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/facilities?q=${encodeURIComponent(q)}`);
      }}
      className="flex gap-2 w-full"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder ?? "搜尋：縣市／行政區／狗園名稱／協會名稱"}
        className="flex-1 rounded-full border border-border bg-surface px-4 py-3 text-sm text-coffee outline-none focus:ring-2 focus:ring-brand"
      />
      <button
        type="submit"
        className="rounded-full bg-brand text-white px-5 py-3 text-sm font-bold whitespace-nowrap"
      >
        🔍 搜尋
      </button>
    </form>
  );
}
