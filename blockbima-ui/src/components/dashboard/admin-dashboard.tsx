import { StatCard } from "./stat-card";

interface AdminDashboardProps {
  orgCount: number;
  totalContracts: number;
  totalPremiums: number;
  totalSettled: number;
}

export function AdminDashboard({ orgCount, totalContracts, totalPremiums, totalSettled }: AdminDashboardProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Organizations" value={orgCount} />
        <StatCard title="Total Contracts" value={totalContracts.toLocaleString()} />
        <StatCard title="Total Premiums" value={`$${totalPremiums.toLocaleString()}`} />
        <StatCard title="Settled" value={totalSettled.toLocaleString()} />
      </div>
    </div>
  );
}
