#!/usr/bin/env bash
# 建立 GitHub Pages 用的純靜態預覽版。
#
# admin/ 用了 cookies()、api/ 用了 Request/fs，兩者都無法靜態匯出，
# 所以這裡暫時把它們搬出 src/app，build 完再搬回來，確保不會留下未還原的狀態。
set -euo pipefail
cd "$(dirname "$0")/.."

TMP_DIR=".pages-export-tmp"
mkdir -p "$TMP_DIR"

restore() {
  [ -d "$TMP_DIR/admin" ] && mv "$TMP_DIR/admin" src/app/admin
  [ -d "$TMP_DIR/api" ] && mv "$TMP_DIR/api" src/app/api
  rmdir "$TMP_DIR" 2>/dev/null || true
}
trap restore EXIT

mv src/app/admin "$TMP_DIR/admin"
mv src/app/api "$TMP_DIR/api"

GITHUB_PAGES_EXPORT=true npx next build

echo "靜態檔案已輸出到 out/（admin 與 api 路由已排除，僅供 GitHub Pages 預覽用）"
