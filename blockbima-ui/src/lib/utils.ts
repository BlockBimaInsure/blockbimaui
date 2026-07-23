import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: "USD" | "KES"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "\u2014";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "\u2014";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function truncateAddress(address: string, chars: number = 6): string {
  if (!address) return "";
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    CONTRACT_STATUS_CREATED: "Created",
    CONTRACT_STATUS_DEPLOYED: "Deployed",
    CONTRACT_STATUS_SETTLED: "Settled",
  };
  return labels[status] ?? status;
}

export function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    CONTRACT_STATUS_CREATED: "outline",
    CONTRACT_STATUS_DEPLOYED: "default",
    CONTRACT_STATUS_SETTLED: "secondary",
  };
  return variants[status] ?? "default";
}

export const XRPL_EVM_EXPLORER = "https://explorer.xrp.evm.network";
export const XRPL_EXPLORER = "https://explorer.xrpl.org";

export function blockchainUrl(type: "address" | "tx", value: string): string {
  if (type === "address") return `${XRPL_EVM_EXPLORER}/address/${value}`;
  if (value.length === 66) return `${XRPL_EVM_EXPLORER}/tx/${value}`;
  return `${XRPL_EXPLORER}/transactions/${value}`;
}