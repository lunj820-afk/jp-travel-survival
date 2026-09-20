import { Metadata } from "next";

export const metadata: Metadata = {
  title: "關於我們",
  description: "全台浪浪救援地圖的資料使用說明與核心精神。",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 text-sm text-coffee leading-relaxed">
      <h1 className="text-2xl font-black">關於全台浪浪救援地圖</h1>

      <section>
        <h2 className="font-bold text-lg mb-2">我們在做什麼</h2>
        <p>
          全台浪浪救援地圖希望建立一個完整、可搜尋、可依縣市分類、可在地圖上瀏覽的台灣動物救援與收容資料庫，
          收錄政府公立收容所，也收錄民間狗園、私人救援、動物保護協會、中途之家等單位。
        </p>
      </section>

      <section>
        <h2 className="font-bold text-lg mb-2">我們不做什麼</h2>
        <p>
          網站不會替使用者決定「哪個狗園最好」，不會做狗園排名、星級評分或「最推薦」榜單。
          我們只呈現資料、來源與更新時間，讓每個人自己判斷。
        </p>
      </section>

      <section>
        <h2 className="font-bold text-lg mb-2">已驗證 vs 搜尋到</h2>
        <p>
          我們嚴格區分「已驗證」與「曾被搜尋到／提及」的資料。每筆資料都有明確的
          <code className="mx-1 px-1 bg-chip rounded">verification_status</code>
          （已驗證／部分驗證／待確認／已確認停止營運／狀態不明），查不到的欄位一律顯示「尚未確認」，
          絕不自行編造地址、電話、認養或捐款資訊。
        </p>
      </section>

      <section className="card p-4">
        <h2 className="font-bold text-lg mb-2">資料使用說明</h2>
        <p>
          本網站資料來源包含政府公開資料、動物保護組織、公開網站、公開社群資訊及使用者回報。
          民間救援單位的資訊可能因搬遷、停止收容、聯絡方式變更或人力狀況而改變，前往前請先與單位確認。
          本網站不代表任何收容所、狗園或動物保護組織。地址涉及私人住宅者，基於隱私與安全考量，
          不一定公開完整地址。
        </p>
      </section>
    </div>
  );
}
