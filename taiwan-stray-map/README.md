# 🐶 全台浪浪救援地圖

找到牠們，也找到幫助牠們的方法。

一個整理台灣公立動物收容所、民間狗園、動物保護協會與中途之家的可搜尋資料庫網站。每筆資料標示來源與最後確認日期，嚴格區分「已驗證」與「曾被搜尋到」，不編造地址、電話、認養或捐款資訊。

## 技術架構

- **Frontend**：Next.js 16（App Router）＋ TypeScript ＋ Tailwind CSS 4
- **地圖**：Leaflet ＋ react-leaflet（OpenStreetMap 圖磚，無需 API key）
- **資料層（Phase 1）**：TypeScript 種子資料（`src/data/`），純函式查詢（`src/lib/facilities.ts`）
- **管理後台／使用者回報（Phase 1）**：本機 JSON 檔（`data-store/`，已加入 .gitignore）
- **未來資料庫**：`supabase/schema.sql` 已備妥與 `src/types/facility.ts` 一致的 schema，之後只需把
  `src/lib/facilities.ts`、`src/lib/adminStore.ts`、`src/lib/reportStore.ts` 改接 Supabase client，
  頁面與元件幾乎不需更動。

## 已建立的頁面

| 路徑 | 說明 |
|---|---|
| `/` | 首頁：Hero、搜尋、地圖預覽、統計、快速搜尋、縣市、最新更新、認養／志工／物資 |
| `/map` | 全台地圖 + 篩選（縣市／類型／動物／可做什麼／狀態） |
| `/facilities` | 單位列表 + 搜尋 + 篩選 |
| `/facilities/[slug]` | 單位詳細頁：基本資料、我可以怎麼幫忙、資料可信度、驗證來源、資料完整度、更新紀錄、回報入口 |
| `/county/[slug]` | 縣市總覽：統計 + 地圖 + 列表（22 縣市皆已建立） |
| `/adoption` `/volunteer` `/donation` | 認養／志工／物資導向頁面 |
| `/report` | 使用者回報表單（寫入 `data-store/user-reports.json`） |
| `/about` | 資料使用說明與核心精神 |
| `/admin` | 管理後台（單一密碼保護，見下方環境變數） |

## 資料表（對應 `src/types/facility.ts` 與 `supabase/schema.sql`）

`facilities`、`facility_sources`、`facility_updates`、`supply_needs`、`user_reports`，
以及 Phase 6+ 預留的 `animals`、`adoption_listings`、`volunteer_opportunities`、`donation_needs`。

## 環境變數

```
ADMIN_PASSWORD=你的管理密碼   # 未設定時預設為 strayrescue2026，正式上線務必更改，並改用 Supabase Auth
```

## 資料匯入現況（2026-09-20）

- **公立收容所**：32 間，名單與地址／電話來自農業部動物保護資訊網，經 AI 研究助手以搜尋引擎交叉比對
  縣市動保機關官網／官方社群後填入。29 間信心度「高」標記為 `verified`，3 間（新北瑞芳、新北三芝、
  連江縣）因地址為描述性地址或電話格式待核對，標記為 `partial_verified`。**沒有任何一筆填入經緯度**，
  因為找不到可靠來源，上線前建議用地理編碼 API 或向縣市動保機關取得官方座標。雲林縣依官方資料無公立
  收容所，未建立資料。
- **民間狗園／私人救援／協會**：146 筆，全部為使用者提供的研究筆記中「曾被提及的名稱」，一律標記為
  `needs_verification`，僅記錄名稱、縣市（少數含行政區，取自名稱中明確出現的地名）。除白媽媽狗園外，
  **完全沒有填入地址、電話、認養／志工／捐款狀態**，避免編造。
- **白媽媽狗園**：唯一標記為 `partial_verified` 的民間單位，地址與約 265 隻毛孩的歷史紀錄取自使用者
  提供的研究資料，已交叉比對 Homeless Helps、Google Maps、相關媒體報導三項來源。
- **待確認資料**：112 筆（`needs_verification`），主要是民間狗園候選名單，尚未逐筆完成十二步驗證流程
  （見 `/about` 頁與原始需求文件的驗證流程）。
- **缺地址**：除白媽媽狗園與 32 間公立收容所外，其餘 146 筆民間候選資料目前均無地址。
- **可能重複**：民間候選名單中有多筆「XX愛媽」「XX愛爸」名稱高度相似、縣市相同（例如高雄「大寮陳媽
  貓狗園區」與「大寮陳媽園區」、台南多筆「黃愛媽」相關名稱），需要人工逐筆確認是否為同一單位——網站
  資料模型刻意不以 `name` 作為唯一鍵，已預留人工比對與合併的空間，但 Phase 1 尚未建立自動重複偵測介面。

## Phase 進度

- ✅ Phase 1 網站 UI／Phase 2 地圖／Phase 3 公立收容所資料／Phase 4 民間狗園候選資料／
  Phase 9 使用者回報／Phase 10 管理後台雛形
- 🟡 Phase 5 驗證系統：資料模型與頁面呈現已完成，但 146 筆民間候選資料的實際逐筆查證（打電話／查
  官網／查 Facebook）尚未執行
- 🟡 Phase 6 認養／Phase 7 志工：頁面已建立，但逐隻毛孩的認養檔案（`animals` 表）與逐一志工技能需求
  尚無第一手資料，避免編造，故留白
- 🟡 Phase 8 物資需求：資料模型與「超過 30 天顯示過期提醒」邏輯已完成，但目前沒有任何單位回報的物資
  需求可匯入

## 下一步建議

1. 把 32 間公立收容所的地址拿去做地理編碼（Google Maps Geocoding／TGOS），補上經緯度，地圖才會真正
   顯示公立收容所的位置。
2. 逐筆致電／查證 146 筆民間候選名單，依十二步驗證流程更新 `verification_status`、地址、認養／志工／
   捐款狀態，並把結果搬進 `src/data/facilities/private-shelters.ts`（或改接 Supabase 後直接寫入資料庫）。
3. 針對疑似重複的「XX愛媽」名單，人工比對後在管理後台合併或分別建檔。
4. 正式上線前：把 `ADMIN_PASSWORD` 換成強密碼並評估改用 Supabase Auth；把 `src/lib/facilities.ts`、
   `src/lib/adminStore.ts`、`src/lib/reportStore.ts` 改接 Supabase（schema 已備妥於 `supabase/schema.sql`），
   讓管理後台的新增／編輯／刪除能直接反映在公開頁面（Phase 1 的 JSON overlay 需要重新建置才會生效）。
5. 待有真實認養／志工／物資資料來源後，建立 `animals`、`volunteer_opportunities`、`donation_needs`
   的實際資料與對應 UI 篩選（年齡、體型、個性、技能標籤）。

## 開發指令

```bash
npm run dev     # 開發伺服器
npm run build   # production build（已驗證可成功建置 186 個靜態頁面）
npm run lint    # ESLint
```
