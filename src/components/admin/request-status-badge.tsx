import type { LeadStatus } from "@/core/admin-request";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";

const statusStyles: Record<LeadStatus, string> = {
  NEW: "border-cyan-200 bg-cyan-50 text-cyan-700",
  IN_REVIEW: "border-blue-200 bg-blue-50 text-blue-700",
  CONTACTED: "border-violet-200 bg-violet-50 text-violet-700",
  QUALIFIED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  WON: "border-green-200 bg-green-50 text-green-700",
  LOST: "border-rose-200 bg-rose-50 text-rose-700",
  ARCHIVED: "border-slate-200 bg-slate-100 text-slate-600",
};

export function RequestStatusBadge({
  label,
  status,
}: {
  label: string;
  status: LeadStatus;
}) {
  return (
    <Badge
      className={cn("whitespace-nowrap shadow-none", statusStyles[status])}
      variant="outline"
    >
      {label}
    </Badge>
  );
}
