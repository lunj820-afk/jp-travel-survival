import { Facility, VerificationStatus } from "@/types/facility";
import { createFacility, source } from "./helpers";

/**
 * 公立動物收容所／動物之家／動物保護教育園區。
 *
 * 名單與地址／電話資料來源：農業部動物保護資訊網「公立收容所」名單
 * （animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS0000000X 系列頁面），
 * 並以各縣市動保機關官網／官方 Facebook 交叉比對。
 *
 * 重要：受此開發環境網路政策限制，AI 研究助手無法直接開啟 .gov.tw 網域頁面，
 * 因此地址／電話為透過搜尋引擎摘要交叉比對而得，"confidence" 為「高」者已有
 * 多方一致來源，"confidence" 為「中」者代表地址為描述性地址（非完整門牌）
 * 或電話格式待再核對——上線前仍建議人工開啟官方頁面逐筆核對一次。
 *
 * 經緯度：目前完全沒有一筆資料填入 latitude/longitude，因為沒有可靠來源，
 * 絕不自行估測座標。待日後用地理編碼 API 或向各縣市動保機關取得官方座標後再補上。
 */

interface GovInput {
  name: string;
  county: string;
  district?: string;
  address?: string;
  addressIsDescriptive?: boolean;
  phone?: string;
  website?: string;
  facebook?: string;
  sourceUrl?: string;
  confidence: "high" | "medium";
  note?: string;
}

function gov(input: GovInput): Facility {
  const id = `public-${input.county}-${input.name}`.replace(/\s+/g, "");
  const verification_status: VerificationStatus =
    input.confidence === "high" ? "verified" : "partial_verified";
  const f = createFacility({
    id,
    name: input.name,
    county: input.county,
    district: input.district,
    address: input.address,
    phone: input.phone,
    website: input.website,
    facebook: input.facebook,
    facility_type: "public_shelter",
    organization_nature: "government",
    animal_type: "dog_and_cat",
    verification_status,
    status: "normal",
    address_public_note: input.addressIsDescriptive
      ? "地址為描述性地址（非完整門牌），建議出發前先致電確認。"
      : undefined,
  });
  f.sources = [
    source({
      source_name: "農業部動物保護資訊網",
      source_url: input.sourceUrl,
      source_type: "government",
      verification_status,
      note:
        input.note ??
        (input.confidence === "high"
          ? "地址／電話已交叉比對縣市動保機關官網／官方社群，一致無矛盾。"
          : "地址或電話尚有描述性/格式疑義，建議上線前人工再核對官方頁面一次。"),
    }),
  ];
  return f;
}

export const PUBLIC_SHELTERS: Facility[] = [
  gov({
    name: "基隆市寵物銀行",
    county: "基隆市",
    district: "七堵區",
    address: "基隆市七堵區大華三路45-12號（欣欣安樂園旁）",
    phone: "02-24560148",
    website: "https://www.klaphio.klcg.gov.tw/tw/klaphio/1328.html",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000002",
    confidence: "high",
  }),
  gov({
    name: "臺北市動物之家",
    county: "台北市",
    district: "內湖區",
    address: "臺北市內湖區安美街191號",
    phone: "02-8791-3254（轉3254/3255）",
    website: "https://www.tcapo.gov.taipei/",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000001",
    confidence: "high",
  }),
  gov({
    name: "新北市板橋區公立動物之家",
    county: "新北市",
    district: "板橋區",
    address: "新北市板橋區板城路28-1號",
    phone: "02-89662158",
    website: "https://www.ahiqo.ntpc.gov.tw/",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000003",
    confidence: "high",
  }),
  gov({
    name: "新北市新店區公立動物之家",
    county: "新北市",
    district: "新店區",
    address: "新北市新店區安泰路235號",
    phone: "02-22159462",
    facebook: "https://www.facebook.com/xindian.animalsfamily",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000004",
    confidence: "high",
  }),
  gov({
    name: "新北市中和區公立動物之家",
    county: "新北市",
    district: "中和區",
    address: "新北市中和區興南路三段100號",
    phone: "02-86685547",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000005",
    confidence: "high",
  }),
  gov({
    name: "新北市淡水區公立動物之家",
    county: "新北市",
    district: "淡水區",
    address: "新北市淡水區下圭柔山91-3號",
    phone: "02-26267558",
    facebook: "https://www.facebook.com/tamsuishelter/",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000006",
    confidence: "high",
  }),
  gov({
    name: "新北市瑞芳區公立動物之家",
    county: "新北市",
    district: "瑞芳區",
    address: "新北市瑞芳區靜安路四段（106縣道74.5K清潔隊場區內）",
    addressIsDescriptive: true,
    phone: "02-24063481",
    website: "https://www.ahiqo.ntpc.gov.tw/cht/index.php?code=list&flag=detail&ids=27&article_id=101",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000007",
    confidence: "medium",
  }),
  gov({
    name: "新北市五股區公立動物之家",
    county: "新北市",
    district: "五股區",
    address: "新北市五股區外寮路9-9號",
    phone: "02-82925265",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000008",
    confidence: "high",
  }),
  gov({
    name: "新北市八里區公立動物之家",
    county: "新北市",
    district: "八里區",
    address: "新北市八里區長坑村6鄰長道路36號",
    phone: "02-26194428",
    website: "https://www.ahiqo.ntpc.gov.tw/cht/index.php?code=list&ids=36",
    confidence: "high",
    note: "農業部 PS 編號未逐一核對，其餘資料已交叉比對新北市動保處官網。",
  }),
  gov({
    name: "新北市三芝區公立動物之家",
    county: "新北市",
    district: "三芝區",
    address: "新北市三芝區圓山村二坪頂（北18鄉道）白沙安樂園附近",
    addressIsDescriptive: true,
    phone: "02-26365436",
    facebook: "https://www.facebook.com/Sanzhidog/",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000010",
    confidence: "medium",
  }),
  gov({
    name: "桃園市動物保護教育園區",
    county: "桃園市",
    district: "新屋區",
    address: "桃園市新屋區永興里3鄰藻礁路1668號",
    phone: "(03)486-1760",
    website: "https://taw.tycg.gov.tw/",
    facebook: "https://www.facebook.com/TaoyuanAnimal/",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000011",
    confidence: "high",
  }),
  gov({
    name: "新竹市動物保護教育園區",
    county: "新竹市",
    address: "新竹市南寮里海濱路250號",
    phone: "03-5368329",
    website: "https://puppy.hccg.gov.tw/",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000012",
    confidence: "high",
  }),
  gov({
    name: "新竹縣動物保護教育園區",
    county: "新竹縣",
    district: "竹北市",
    address: "新竹縣竹北市縣政五街192號",
    phone: "03-5519548",
    website: "https://apc.hsinchu.gov.tw/",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000013",
    confidence: "high",
  }),
  gov({
    name: "苗栗縣動物保護教育園區",
    county: "苗栗縣",
    district: "銅鑼鄉",
    address: "苗栗縣銅鑼鄉朝陽村6鄰朝北55-1號",
    phone: "037-320049（防疫所代表號）／037-558228（園區）",
    website: "https://animal.miaoli.gov.tw/",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000014",
    confidence: "high",
  }),
  gov({
    name: "臺中市動物之家南屯園區",
    county: "台中市",
    district: "南屯區",
    address: "臺中市南屯區中台路601號",
    phone: "04-23850949",
    website: "https://www.animal.taichung.gov.tw/",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000015",
    confidence: "high",
  }),
  gov({
    name: "臺中市動物之家后里園區",
    county: "台中市",
    district: "后里區",
    address: "臺中市后里區堤防路370號",
    phone: "04-25588024",
    website: "https://www.animal.taichung.gov.tw/",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000016",
    confidence: "high",
  }),
  gov({
    name: "彰化縣流浪狗中途之家臨時收容所",
    county: "彰化縣",
    district: "員林市",
    address: "彰化縣員林市大峰里阿寶巷426號（入口實際由芬園鄉大彰路一段875巷進入）",
    addressIsDescriptive: true,
    phone: "04-8590638",
    website: "https://www.chcgadcc.gov.tw/dog.asp",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000032",
    confidence: "high",
  }),
  gov({
    name: "南投縣公立動物收容所",
    county: "南投縣",
    district: "南投市",
    address: "南投縣南投市嶺興路36-1號",
    phone: "049-2225440",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000018",
    confidence: "high",
  }),
  gov({
    name: "嘉義市動物保護教育園區",
    county: "嘉義市",
    district: "東區",
    address: "嘉義市東區芳草里彌陀路31號",
    phone: "05-2168661",
    website: "https://ccap.chiayi.gov.tw/",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000022",
    confidence: "high",
  }),
  gov({
    name: "嘉義縣動物保護教育園區",
    county: "嘉義縣",
    district: "民雄鄉",
    address: "嘉義縣民雄鄉松山村後山仔37之2號",
    phone: "05-2721119",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000023",
    confidence: "high",
    note: "主管機關為嘉義縣家畜疾病防治所（http://www.ldcc.gov.tw/），未查到園區專屬官網。",
  }),
  gov({
    name: "臺南市動物之家灣裡站",
    county: "台南市",
    district: "南區",
    address: "臺南市南區省躬里14鄰萬年路580巷92號",
    phone: "06-2964439",
    website: "https://ahipo.tainan.gov.tw/",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000024",
    confidence: "high",
  }),
  gov({
    name: "臺南市動物之家善化站",
    county: "台南市",
    district: "善化區",
    address: "臺南市善化區昌隆里東勢寮1~19號",
    phone: "06-5832399",
    website: "https://ahipo.tainan.gov.tw/",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000025",
    confidence: "high",
  }),
  gov({
    name: "高雄市壽山動物保護教育園區",
    county: "高雄市",
    district: "鼓山區",
    address: "高雄市鼓山區萬壽路350號",
    phone: "(07)551-9059",
    website: "https://livestock.kcg.gov.tw/Pets/DongwuShourong/YuanquJieshao/YuanquJieshao01.htm",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000026",
    confidence: "high",
  }),
  gov({
    name: "高雄市燕巢動物保護關愛園區",
    county: "高雄市",
    district: "燕巢區",
    address: "高雄市燕巢區師大路98號",
    phone: "07-6051002",
    website: "https://livestock.kcg.gov.tw/Pets/DongwuShourong/YuanquJieshao/YuanquJieshao02.htm",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000027",
    confidence: "high",
  }),
  gov({
    name: "屏東縣公立犬貓中途之家",
    county: "屏東縣",
    district: "內埔鄉",
    address: "屏東縣內埔鄉學府路1號（屏東科技大學內，由社團法人愛狗人協會協助管理）",
    phone: "08-7740413",
    website: "https://www.pthg.gov.tw/plantou/",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000028",
    confidence: "high",
  }),
  gov({
    name: "屏東縣動物之家",
    county: "屏東縣",
    district: "麟洛鄉",
    address: "屏東縣麟洛鄉信義路101號",
    phone: "08-7221090／0910-959768",
    facebook: "https://www.facebook.com/adoptmeloveme/",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000033",
    confidence: "high",
  }),
  gov({
    name: "宜蘭縣流浪動物中途之家",
    county: "宜蘭縣",
    district: "五結鄉",
    address: "宜蘭縣五結鄉成興村利寶路60號",
    phone: "(03)960-2350",
    website: "https://animal.e-land.gov.tw/cl.aspx?n=5896",
    facebook: "https://www.facebook.com/shelteranimal/",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000019",
    confidence: "high",
  }),
  gov({
    name: "花蓮縣狗貓躍動園區",
    county: "花蓮縣",
    district: "鳳林鎮",
    address: "花蓮縣鳳林鎮林榮里永豐路255號",
    phone: "(03)8421452",
    website: "https://acdc.hl.gov.tw/cp.aspx?n=27059",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000020",
    confidence: "high",
  }),
  gov({
    name: "臺東縣流浪動物收容中心",
    county: "台東縣",
    district: "台東市",
    address: "臺東縣臺東市中華路四段999巷600-1號",
    phone: "089-362011",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000021",
    confidence: "high",
    note: "主管機關為臺東縣動物防疫所，未查到園區專屬官網。",
  }),
  gov({
    name: "澎湖縣流浪動物收容中心",
    county: "澎湖縣",
    district: "馬公市",
    address: "澎湖縣馬公市烏崁里260號、261號",
    phone: "06-9213559",
    website: "https://www.phldcc.gov.tw/home.jsp?id=24",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000031",
    confidence: "high",
  }),
  gov({
    name: "金門縣動物收容中心",
    county: "金門縣",
    district: "金湖鎮",
    address: "金門縣金湖鎮裕民農莊20號",
    phone: "082-336625",
    website: "https://aphin.kinmen.gov.tw/",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000030",
    confidence: "high",
  }),
  gov({
    name: "連江縣流浪犬收容中心",
    county: "連江縣",
    district: "南竿鄉",
    address: "連江縣馬祖南竿鄉復興村223號",
    phone: "0836-25003",
    sourceUrl: "https://animal.moa.gov.tw/Frontend/PublicShelter/Detail/PS00000029",
    confidence: "medium",
    note: "電話號碼格式在不同來源略有差異，建議人工再核對官方頁面一次。",
  }),
];

// 雲林縣：農業部官方資料目前顯示無公立收容所，不建立資料（避免無中生有）。
