"use client";

export function exportToCsv(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((h) => {
          const val = String(row[h] ?? "");
          const sanitized = val.replace(/^[=+\-@\t\r]/, "\u2018$&");
          return sanitized.includes(",") || sanitized.includes('"') || sanitized.includes("\n")
            ? `"${sanitized.replace(/"/g, '""')}"`
            : sanitized;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
}
