import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🐶</span>
          <div>
            <div className="font-bold text-coffee leading-tight">全台浪浪救援地圖</div>
            <div className="text-[11px] text-muted leading-tight">找到牠們，也找到幫助牠們的方法</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-coffee">
          <Link href="/map">地圖</Link>
          <Link href="/facilities">單位列表</Link>
          <Link href="/adoption">我要領養</Link>
          <Link href="/volunteer">我要當志工</Link>
          <Link href="/donation">物資需求</Link>
          <Link href="/about">關於我們</Link>
        </nav>
      </div>
    </header>
  );
}
