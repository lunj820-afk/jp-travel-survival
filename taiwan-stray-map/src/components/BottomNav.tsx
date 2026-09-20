"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", icon: "🏠", label: "首頁" },
  { href: "/map", icon: "🗺", label: "地圖" },
  { href: "/adoption", icon: "🐶", label: "認養" },
  { href: "/donation", icon: "❤️", label: "幫助浪浪" },
  { href: "/facilities", icon: "🔎", label: "搜尋" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border flex justify-around py-1.5 md:hidden">
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-[11px] ${
              active ? "text-brand font-bold" : "text-muted"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
