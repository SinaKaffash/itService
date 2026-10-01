"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { useTranslations } from "@/lib/messages";

import { deleteAdminContentAction } from "@/actions/admin-content.actions";
import type { ContentEntityType } from "@/core/admin-content";
import { useRouter } from "@/lib/navigation";

import { Button } from "@/components/ui/button";

export function ContentDeleteButton({
  entity,
  id,
}: {
  entity: ContentEntityType;
  id: string;
}) {
  const router = useRouter();
  const t = useTranslations("AdminContent");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <Button
        aria-label={t("delete")}
        disabled={isPending}
        onClick={() => {
          if (!window.confirm(t("deleteConfirm"))) return;
          startTransition(async () => {
            setError(null);
            const result = await deleteAdminContentAction({
              entity,
              id,
            });
            if (result.success) {
              router.refresh();
            } else {
              setError(t("deleteError"));
            }
          });
        }}
        size="icon"
        variant="ghost"
      >
        {isPending ? (
          <Loader2 aria-hidden="true" className="animate-spin" />
        ) : (
          <Trash2 aria-hidden="true" />
        )}
      </Button>
      {error ? <p className="sr-only">{error}</p> : null}
    </div>
  );
}
