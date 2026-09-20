import { Facility, FacilityType, AnimalType } from "@/types/facility";
import { createFacility, source } from "./helpers";

/**
 * 民間狗園／私人救援／協會等候選名單。
 *
 * 這份清單來自使用者提供的研究筆記，屬於「曾經被提及／查到名稱」的候選資料，
 * 絕大多數尚未逐筆確認是否仍存在、是否可認養、是否接受志工或捐款。
 * 因此一律建立為 verification_status = "needs_verification"，
 * 不主動填入地址、電話、認養或志工狀態 —— 這些欄位維持「尚未確認」，
 * 待後續逐筆走訪十二步驗證流程後再更新。
 *
 * 例外：白媽媽狗園（台南市西港區）已有使用者提供的地址與交叉來源，
 * 因此標記為 partial_verified，並在檔案最後獨立定義。
 */

function guessType(name: string): FacilityType {
  if (name.includes("協會")) return "animal_protection_association";
  if (name.includes("中途")) return "foster_home";
  return "dog_shelter";
}

function guessAnimal(name: string): AnimalType {
  if (name.includes("貓狗") || name.includes("犬貓") || name.includes("貓")) return "dog_and_cat";
  return "dog";
}

function candidate(name: string, county: string, district?: string, note?: string): Facility {
  const id = `private-${county}-${name}`.replace(/\s+/g, "");
  const f = createFacility({
    id,
    name,
    county,
    district,
    facility_type: guessType(name),
    organization_nature: name.includes("協會") ? "nonprofit" : "unknown",
    animal_type: guessAnimal(name),
  });
  f.sources = [
    source({
      source_name: "民間資料整理筆記（網路搜尋線索，尚未逐筆查證）",
      source_type: "other",
      verification_status: "needs_verification",
      note: note ?? "僅為曾在網路上出現過的名稱線索，存在與否、地址、認養／志工／捐款狀態均待確認。",
    }),
  ];
  return f;
}

const NORTH: Array<[string, string, string?, string?]> = [
  ["張媽媽流浪動物之家", "新北市", undefined, "原始清單列於「新北／台北」分區，縣市為暫列分類，待確認實際所在縣市。"],
  ["陳醫師狗園", "新北市", undefined, "原始清單列於「新北／台北」分區，縣市為暫列分類，待確認實際所在縣市。"],
  ["流浪動物花園", "新北市", undefined, "原始清單列於「新北／台北」分區，縣市為暫列分類，待確認實際所在縣市。"],
  ["王富美浪浪家園", "新北市", undefined, "原始清單列於「新北／台北」分區，縣市為暫列分類，待確認實際所在縣市。"],
  ["社團法人中華民國保護動物協會八里保育場", "新北市", "八里區"],
];

const TAOYUAN: Array<[string, string, string?]> = [
  ["浪愛一生", "桃園市"],
  ["台灣樂活動物協會", "桃園市"],
];

const MIAOLI: Array<[string, string, string?]> = [
  ["苗栗楊媽媽貓狗園", "苗栗縣"],
  ["唐愛媽", "苗栗縣"],
  ["黎愛媽", "苗栗縣"],
  ["廖愛媽狗園", "苗栗縣"],
  ["梁爸毛小孩", "苗栗縣"],
  ["公館葉媽媽貓狗園", "苗栗縣", "公館鄉"],
  ["林愛媽狗園", "苗栗縣"],
];

const TAICHUNG: Array<[string, string, string?]> = [
  ["太平許媽媽狗園", "台中市", "太平區"],
  ["陳媽流浪動物", "台中市"],
  ["楊愛媽", "台中市"],
  ["賴媽之家", "台中市"],
  ["王媽毛小孩", "台中市"],
  ["紀媽狗園", "台中市"],
  ["犬山居", "台中市"],
  ["TCASA台灣同伴動物扶助協會", "台中市"],
  ["台灣之心愛護動物協會", "台中市"],
];

const CHANGHUA: Array<[string, string, string?]> = [
  ["董媽浪孩園區", "彰化縣"],
  ["許媽流浪動物", "彰化縣"],
  ["蔡愛媽貓狗園", "彰化縣"],
];

const NANTOU: Array<[string, string, string?]> = [
  ["洪愛媽", "南投縣"],
  ["黃媽園區", "南投縣"],
  ["全愛爸", "南投縣"],
  ["巫愛媽", "南投縣"],
  ["楊愛媽", "南投縣"],
  ["廖媽狗園", "南投縣"],
  ["劉爸狗園", "南投縣"],
  ["草屯狗園", "南投縣", "草屯鎮"],
  ["埔里旺媽狗場", "南投縣", "埔里鎮"],
  ["陳老師園區", "南投縣"],
];

const YUNLIN: Array<[string, string, string?]> = [
  ["侯媽貓狗園", "雲林縣"],
  ["斗六張愛媽", "雲林縣", "斗六市"],
  ["北港黃愛媽", "雲林縣", "北港鎮"],
  ["雲林張媽園區", "雲林縣"],
  ["林內尹愛媽", "雲林縣", "林內鄉"],
];

const CHIAYI: Array<[string, string, string?, string?]> = [
  ["嘉義王愛媽", "嘉義縣", undefined, "「嘉義」原始清單未區分嘉義市／嘉義縣，暫列嘉義縣待確認。"],
  ["梅山陳愛爸", "嘉義縣", "梅山鄉"],
  ["民雄陳媽媽園區", "嘉義縣", "民雄鄉"],
  ["中埔吳愛媽", "嘉義縣", "中埔鄉"],
  ["劉媽媽狗園", "嘉義縣", undefined, "「嘉義」原始清單未區分嘉義市／嘉義縣，暫列嘉義縣待確認。"],
  ["嘉義林爸狗園", "嘉義縣", undefined, "「嘉義」原始清單未區分嘉義市／嘉義縣，暫列嘉義縣待確認。"],
  ["梅媽狗園", "嘉義縣", undefined, "「嘉義」原始清單未區分嘉義市／嘉義縣，暫列嘉義縣待確認。"],
];

const TAINAN_OTHERS: Array<[string, string, string?]> = [
  ["馬媽媽狗園", "台南市"],
  ["安南黃愛媽－開心農場", "台南市", "安南區"],
  ["AM台南林爸貓狗園", "台南市"],
  ["台南官田黃媽媽", "台南市", "官田區"],
  ["台南葉爸狗園", "台南市"],
  ["台南李爸狗園", "台南市"],
  ["台南黃愛媽貓狗園區", "台南市"],
  ["二王園區", "台南市"],
  ["安南吳愛媽", "台南市", "安南區"],
  ["台南黃愛爸狗園", "台南市"],
  ["台南吳媽狗園", "台南市"],
  ["台南鄭愛媽", "台南市"],
  ["台南徐媽園區", "台南市"],
  ["台南安平謝媽媽狗園", "台南市", "安平區"],
  ["台南蘇爸家", "台南市"],
  ["台南張爸浪家園", "台南市"],
  ["徐園長護生園", "台南市"],
  ["徐春水流浪狗之家", "台南市"],
  ["董旺旺狗園／社團法人臺南市董旺旺流浪毛小孩生命照護協會", "台南市"],
  ["毛小孩的窩仁德園區", "台南市", "仁德區"],
  ["樂樂狗園", "台南市"],
  ["永康黃媽媽狗園", "台南市", "永康區"],
  ["姜媽媽狗園", "台南市"],
];

const KAOHSIUNG: Array<[string, string, string?]> = [
  ["大樹陳愛爸狗園", "高雄市", "大樹區"],
  ["燕巢陳愛媽", "高雄市", "燕巢區"],
  ["高雄呂愛爸", "高雄市"],
  ["高雄鄭媽園區", "高雄市"],
  ["前鎮張愛媽", "高雄市", "前鎮區"],
  ["九曲堂李愛媽", "高雄市"],
  ["岡山吳愛媽", "高雄市", "岡山區"],
  ["岡山陳愛媽", "高雄市", "岡山區"],
  ["岡山蘇愛媽狗園", "高雄市", "岡山區"],
  ["高雄盧愛媽貓狗園", "高雄市"],
  ["高雄葉媽狗園", "高雄市"],
  ["高雄林愛媽狗園", "高雄市"],
  ["大寮陳媽貓狗園區", "高雄市", "大寮區"],
  ["高雄吳媽", "高雄市"],
  ["高雄美濃林媽媽狗園", "高雄市", "美濃區"],
  ["高雄安愛媽", "高雄市"],
  ["大寮陳媽園區", "高雄市", "大寮區"],
  ["高雄路竹王愛媽", "高雄市", "路竹區"],
  ["高雄黎麗愛媽", "高雄市"],
  ["龜島羅媽", "高雄市"],
  ["高雄林媽園區", "高雄市"],
  ["高雄茄萣區邱媽媽園區", "高雄市", "茄萣區"],
  ["高雄游媽園區", "高雄市"],
  ["高雄王媽園地", "高雄市"],
  ["高雄王愛媽流浪貓狗園區", "高雄市"],
  ["高雄趙媽園區", "高雄市"],
];

const PINGTUNG: Array<[string, string, string?]> = [
  ["高樹鄉賴媽媽貓狗園", "屏東縣", "高樹鄉"],
  ["翁馬麻之家", "屏東縣"],
  ["潮州李媽媽園區", "屏東縣", "潮州鎮"],
  ["汪媽媽狗園", "屏東縣"],
  ["里港劉愛媽", "屏東縣", "里港鄉"],
  ["蔡爸園區", "屏東縣"],
  ["凌雲董愛媽", "屏東縣"],
  ["胡園長", "屏東縣"],
  ["陳愛媽狗園", "屏東縣"],
  ["朱媽園", "屏東縣"],
  ["長治郭愛爸貓狗園", "屏東縣", "長治鄉"],
  ["葉爸貓狗園區", "屏東縣"],
  ["愛狗人協會－鹽埔園區", "屏東縣", "鹽埔鄉"],
];

const HUALIEN: Array<[string, string, string?]> = [
  ["何媽媽狗園", "花蓮縣"],
  ["花蓮縣動物權益促進會", "花蓮縣"],
];

const ALL_GROUPS: Array<[string, string, string?, string?]> = [
  ...NORTH,
  ...TAOYUAN,
  ...MIAOLI,
  ...TAICHUNG,
  ...CHANGHUA,
  ...NANTOU,
  ...YUNLIN,
  ...CHIAYI,
  ...TAINAN_OTHERS,
  ...KAOHSIUNG,
  ...PINGTUNG,
  ...HUALIEN,
];

export const PRIVATE_SHELTER_CANDIDATES: Facility[] = ALL_GROUPS.map(([name, county, district, note]) =>
  candidate(name, county, district, note)
);

/** 白媽媽狗園 —— 使用者提供了具體地址與交叉來源，因此獨立建立、標記為部分驗證。 */
export const WHITE_MAMA_SHELTER: Facility = (() => {
  const f = createFacility({
    id: "white-mama-dog-shelter",
    name: "白媽媽狗園",
    county: "台南市",
    district: "西港區",
    address: "台南市西港區竹林里11號",
    facility_type: "dog_shelter",
    organization_nature: "nonprofit",
    animal_type: "dog",
    total_animal_count: 265,
    animal_count_as_of: "2024-01-01",
    features: ["高齡犬照護", "身障犬照護"],
    description:
      "白媽媽狗園主要照護被遺忘的高齡與身障毛孩。資料來源顯示曾照護約 265 隻毛孩，但此為歷史紀錄，非即時數字，請以「資料最後確認日期」為準，並建議聯絡單位確認目前實際狀況。",
    verification_status: "partial_verified",
    status: "unknown",
    adoption_available: "unknown",
    volunteer_available: "unknown",
    donation_available: "unknown",
    supplies_available: "unknown",
    visit_available: "unknown",
  });
  f.sources = [
    source({
      source_name: "Homeless Helps",
      source_type: "animal_welfare_group",
      verification_status: "partial_verified",
      note: "曾報導白媽媽狗園之照護紀錄與約265隻毛孩之歷史數字。",
    }),
    source({
      source_name: "Google Maps",
      source_type: "google_maps",
      verification_status: "partial_verified",
      note: "地圖上可查得單位名稱與地址，但 Google Maps 收錄不代表已完成官方驗證。",
    }),
    source({
      source_name: "相關紀錄片／媒體報導",
      source_type: "news",
      verification_status: "partial_verified",
    }),
  ];
  f.updates = [
    {
      id: "upd-white-mama-001",
      facility_id: f.id,
      date: "2026-09-20",
      category: "address",
      headline: "白媽媽狗園地址重新確認",
      detail: "依據使用者提供之研究資料建立地址（台南市西港區竹林里11號），已交叉比對 Homeless Helps 與 Google Maps 兩項來源。",
      status_color: "green",
    },
  ];
  return f;
})();
