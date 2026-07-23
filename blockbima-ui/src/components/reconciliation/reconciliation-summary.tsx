import { StatCard } from "@/components/dashboard/stat-card";

interface ReconciliationSummaryProps {
  totalCollected: number;
  totalOwed: number;
  outstanding: number;
}

export function ReconciliationSummary({ totalCollected, totalOwed, outstanding }: ReconciliationSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard title="Premiums Collected" value={`$${totalCollected.toLocaleString()}`} />
      <StatCard title="Owed to Insurer" value={`$${totalOwed.toLocaleString()}`} />
      <StatCard
        title="Outstanding"
        value={`$${outstanding.toLocaleString()}`}
        description={outstanding > 0 ? "Amount remaining" : "All settled"}
      />
    </div>
  );
}
