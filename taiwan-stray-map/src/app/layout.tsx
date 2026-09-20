import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import SiteHeader from "@/components/SiteHeader";

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "全台浪浪救援地圖｜找到牠們，也找到幫助牠們的方法",
    template: "%s｜全台浪浪救援地圖",
  },
  description:
    "整理台灣公立動物收容所、民間狗園、動物保護協會與中途之家的地址、認養、志工與物資資訊，每筆資料標示來源與最後確認日期，讓真正需要幫助的單位更容易被找到。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-Hant" className={`${notoSansTC.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col pb-16">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
