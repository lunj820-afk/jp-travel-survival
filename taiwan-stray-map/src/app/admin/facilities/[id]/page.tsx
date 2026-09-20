import { notFound } from "next/navigation";
import { getMergedFacilityById } from "@/lib/adminStore";
import AdminFacilityForm from "../AdminFacilityForm";

export default async function EditFacilityPage(props: PageProps<"/admin/facilities/[id]">) {
  const { id } = await props.params;
  const facility = await getMergedFacilityById(id);
  if (!facility) notFound();

  return (
    <div>
      <h2 className="font-bold text-coffee mb-4">編輯：{facility.name}</h2>
      <AdminFacilityForm mode="edit" initial={facility} />
    </div>
  );
}
