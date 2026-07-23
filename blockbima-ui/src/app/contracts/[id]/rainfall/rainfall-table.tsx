"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DailyRainfall } from "@/lib/api-client";
import { Download } from "lucide-react";

interface RainfallTableProps {
  readings: DailyRainfall[];
  threshold: number;
}

export function RainfallTable({ readings, threshold }: RainfallTableProps) {
  const sorted = [...readings].sort((a, b) => b.date.localeCompare(a.date));

  const exportCSV = () => {
    const header = "Date,Rainfall (mm),Status,Variance from Threshold\n";
    const rows = sorted
      .map((r) => {
        const status = r.amountMm >= threshold ? "Above" : "Below";
        const variance = r.amountMm - threshold;
        return `${r.date},${r.amountMm},${status},${variance >= 0 ? "+" : ""}${variance.toFixed(1)}mm`;
      })
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rainfall-feed.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={exportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Rainfall (mm)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Variance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((r) => {
              const above = r.amountMm >= threshold;
              const variance = r.amountMm - threshold;
              return (
                <TableRow
                  key={r.date}
                  className={above ? "border-l-2 border-l-amber-500" : ""}
                >
                  <TableCell className="font-mono text-xs">{r.date}</TableCell>
                  <TableCell className="text-right font-medium">{r.amountMm}</TableCell>
                  <TableCell>
                    <Badge variant={above ? "destructive" : "secondary"} className="text-xs">
                      {above ? "⚠ Above" : "✓ Below"}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right text-xs ${above ? "text-amber-600" : "text-muted-foreground"}`}>
                    {variance >= 0 ? "+" : ""}{variance.toFixed(1)}mm
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
