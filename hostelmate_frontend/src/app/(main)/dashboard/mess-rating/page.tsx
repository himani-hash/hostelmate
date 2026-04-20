import { ProposalSectionsTable } from "./_components/proposal-sections-table/table";
import { SectionCards } from "./_components/section-cards";

export default function Page() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCards />
      <ProposalSectionsTable data={[]} />
    </div>
  );
}
