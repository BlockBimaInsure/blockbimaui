import { Badge } from "@/components/ui/badge";
import { truncateAddress, blockchainUrl, formatDate } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface BlockchainLinksProps {
  smartContractAddress?: string;
  deployedAt?: string;
  settlementTransactionId?: string;
  settlementAmount?: number;
  settledAt?: string;
}

export function BlockchainLinks({
  smartContractAddress,
  deployedAt,
  settlementTransactionId,
  settlementAmount,
  settledAt,
}: BlockchainLinksProps) {
  return (
    <div className="space-y-4">
      {smartContractAddress && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Contract:</span>
          <a
            href={blockchainUrl("address", smartContractAddress)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-mono text-xs text-primary hover:underline"
          >
            {truncateAddress(smartContractAddress, 8)}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
      {deployedAt && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Deployed:</span>
          <span>{formatDate(deployedAt)}</span>
        </div>
      )}
      {settlementTransactionId && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Settlement TX:</span>
          <a
            href={blockchainUrl("tx", settlementTransactionId)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-mono text-xs text-primary hover:underline"
          >
            {truncateAddress(settlementTransactionId, 8)}
            <ExternalLink className="h-3 w-3" />
          </a>
          {settlementAmount !== undefined && (
            <Badge variant="secondary">${settlementAmount.toLocaleString()}</Badge>
          )}
        </div>
      )}
      {settledAt && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Settled:</span>
          <span>{formatDate(settledAt)}</span>
        </div>
      )}
    </div>
  );
}
