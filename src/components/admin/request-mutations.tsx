"use client";

import { useState, useTransition } from "react";
import { Archive, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import {
  archiveRequestAction,
  updateRequestStatusAction,
} from "@/actions/admin-request.actions";
import {
  leadRequestStatuses,
  type LeadStatus,
} from "@/core/admin-request";
import { useRouter } from "@/i18n/navigation";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function RequestMutations({
  requestId,
  status,
}: {
  requestId: string;
  status: LeadStatus;
}) {
  const locale = useLocale() as "fa" | "en";
  const router = useRouter();
  const t = useTranslations("AdminRequests.mutations");
  const statusT = useTranslations("AdminRequests.statuses");
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus>(status);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const errorMessage = (code: string) =>
    code === "UNAUTHORIZED" ? t("unauthorized") : t("error");

  return (
    <div className="space-y-5 rounded-xl border bg-white p-6">
      <div className="space-y-2">
        <Label htmlFor="request-status">{t("statusLabel")}</Label>
        <Select
          disabled={isPending}
          onValueChange={(value) => setSelectedStatus(value as LeadStatus)}
          value={selectedStatus}
        >
          <SelectTrigger id="request-status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {leadRequestStatuses.map((item) => (
              <SelectItem key={item} value={item}>
                {statusT(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        className="w-full"
        disabled={isPending || selectedStatus === status}
        onClick={() =>
          startTransition(async () => {
            setFeedback(null);
            const result = await updateRequestStatusAction({
              id: requestId,
              locale,
              status: selectedStatus,
            });

            if (result.success) {
              setFeedback({ type: "success", message: t("updated") });
              router.refresh();
            } else {
              setFeedback({
                type: "error",
                message: errorMessage(result.code),
              });
            }
          })
        }
      >
        {isPending ? (
          <Loader2 aria-hidden="true" className="animate-spin" />
        ) : null}
        {t("update")}
      </Button>
      <div className="border-t pt-5">
        <Button
          className="w-full"
          disabled={isPending || status === "ARCHIVED"}
          onClick={() => {
            if (!window.confirm(t("archiveConfirm"))) return;

            startTransition(async () => {
              setFeedback(null);
              const result = await archiveRequestAction({
                id: requestId,
                locale,
              });

              if (result.success) {
                setSelectedStatus("ARCHIVED");
                setFeedback({ type: "success", message: t("archived") });
                router.refresh();
              } else {
                setFeedback({
                  type: "error",
                  message: errorMessage(result.code),
                });
              }
            });
          }}
          variant="outline"
        >
          <Archive aria-hidden="true" />
          {status === "ARCHIVED" ? t("alreadyArchived") : t("archive")}
        </Button>
      </div>
      {feedback ? (
        <p
          className={
            feedback.type === "success"
              ? "text-sm text-emerald-700"
              : "text-sm text-destructive"
          }
          role="status"
        >
          {feedback.message}
        </p>
      ) : null}
    </div>
  );
}
