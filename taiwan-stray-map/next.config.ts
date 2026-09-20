import type { NextConfig } from "next";

// GitHub Pages 靜態預覽版用：`npm run build:pages`（見 scripts/build-pages.sh）
// 會設定 GITHUB_PAGES_EXPORT=true 並暫時移除 src/app/admin 與 src/app/api
// （這兩個資料夾依賴 cookies()／Request，無法靜態匯出）。
// 一般開發與正式部署（例如 Vercel）不要設這個環境變數，維持完整功能。
const isPagesExport = process.env.GITHUB_PAGES_EXPORT === "true";
const repoName = "jp-travel-survival";

const nextConfig: NextConfig = {
  ...(isPagesExport
    ? {
        output: "export",
        basePath: `/${repoName}`,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
