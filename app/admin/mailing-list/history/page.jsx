import { getData } from "@/actions/get";
import { HRassikaTable } from "./_components/hrassilka-table";

// This would typically come from your API or database

export default async function HRassikasPage() {
  const dummyHRassikas = await getData(`/api/hrassikas`, "rassilka");
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">HRassikas History</h1>
      <HRassikaTable hrassikas={dummyHRassikas} />
    </div>
  );
}
