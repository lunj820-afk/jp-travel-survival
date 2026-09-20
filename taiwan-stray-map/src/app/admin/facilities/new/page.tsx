import AdminFacilityForm from "../AdminFacilityForm";

export default function NewFacilityPage() {
  return (
    <div>
      <h2 className="font-bold text-coffee mb-4">新增單位</h2>
      <AdminFacilityForm mode="new" />
    </div>
  );
}
