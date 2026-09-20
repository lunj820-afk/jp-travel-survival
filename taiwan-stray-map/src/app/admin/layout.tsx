import Link from "next/link";
import { isAdminAuthed } from "@/lib/adminAuth";
import LogoutButton from "./LogoutButton";
import LoginForm from "./LoginForm";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAdminAuthed();

  if (!authed) {
    return (
      <div className="max-w-md mx-auto px-4 py-10">
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h1 className="text-xl font-black text-coffee">🛠 管理後台</h1>
        <LogoutButton />
      </div>
      <nav className="flex gap-4 text-sm font-semibold text-coffee mb-6 border-b border-border pb-2">
        <Link href="/admin">總覽</Link>
        <Link href="/admin/facilities">單位管理</Link>
        <Link href="/admin/facilities/new">新增單位</Link>
        <Link href="/admin/reports">使用者回報</Link>
      </nav>
      {children}
    </div>
  );
}
