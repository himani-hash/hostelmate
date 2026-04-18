import { recentLeadsData } from "./_components/crm.config";
import { OverviewCards } from "./_components/overview-cards";
import { RecentLeadsTable } from "./_components/recent-leads-table/table";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <OverviewCards />
      <RecentLeadsTable data={recentLeadsData} />
    </div>
  );
}
