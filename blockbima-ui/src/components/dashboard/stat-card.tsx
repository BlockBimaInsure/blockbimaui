import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { KPISparkline } from "@/components/charts/kpi-sparkline";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: number[];
  trendColor?: string;
  accentColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendColor,
  accentColor,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("stat-glow overflow-hidden", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {Icon && (
            <div
              className="rounded-lg p-2"
              style={{
                backgroundColor: `color-mix(in srgb, ${accentColor ?? "oklch(0.60 0.17 170)"} 10%, transparent)`,
              }}
            >
              <Icon
                className="h-5 w-5"
                style={{ color: accentColor ?? "oklch(0.60 0.17 170)" }}
              />
            </div>
          )}
        </div>
        {trend && trend.length > 1 && (
          <div className="mt-3">
            <KPISparkline data={trend} color={trendColor ?? accentColor ?? "oklch(0.60 0.17 170)"} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
