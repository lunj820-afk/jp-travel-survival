import { notFound } from "next/navigation";
import { Metadata } from "next";
import { COUNTIES, getCountyBySlug } from "@/data/counties";
import { getFacilitiesByCounty, getStats } from "@/lib/facilities";
import FacilityExplorer from "@/components/FacilityExplorer";
import StatsGrid from "@/components/StatsGrid";

export function generateStaticParams() {
  return COUNTIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/county/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const county = getCountyBySlug(slug);
  if (!county) return {};
  return {
    title: `${county.name}救援地圖`,
    description: `${county.name}的公立收容所、民間狗園、動物保護協會與中途之家列表與地圖。`,
  };
}

export default async function CountyPage(props: PageProps<"/county/[slug]">) {
  const { slug } = await props.params;
  const county = getCountyBySlug(slug);
  if (!county) notFound();

  const facilities = getFacilitiesByCounty(county.name);
  const stats = getStats(facilities);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-coffee">{county.name}救援地圖</h1>
        <p className="text-sm text-muted mt-1">共收錄 {facilities.length} 個單位</p>
      </div>
      <StatsGrid stats={stats} />
      <FacilityExplorer facilities={facilities} showMap lockedCounty={county.name} />
    </div>
  );
}
