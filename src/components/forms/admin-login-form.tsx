"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LockKeyhole } from "lucide-react";
import { useTranslations } from "@/lib/messages";
import { useForm } from "react-hook-form";

import { loginAdminAction } from "@/actions/admin-auth.actions";
import {
  adminLoginSchema,
  type AdminLoginValues,
} from "@/features/auth/admin-login.schema";
import { useRouter } from "@/lib/navigation";

import { SubmissionError } from "@/components/forms/submission-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLoginForm() {
  const t = useTranslations("AdminAuth");
  const common = useTranslations("Common.errors");
  const router = useRouter();
  const [submitError, setSubmitError] = useState<{
    message: string;
    requestId?: string;
  } | null>(null);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
    mode: "onBlur",
  });

  return (
    <form
      className="space-y-5"
      noValidate
      onSubmit={handleSubmit(async (values) => {
        setSubmitError(null);
        const result = await loginAdminAction(values);

        if (result.success) {
          router.replace("/admin");
          router.refresh();
          return;
        }

        setSubmitError(
          {
            message:
              result.code === "INVALID_CREDENTIALS"
                ? t("invalidCredentials")
                : result.code === "VALIDATION_ERROR"
                  ? t("validationError")
                  : t("serverError"),
            requestId: result.requestId,
          },
        );
      })}
    >
      <div className="space-y-2">
        <Label htmlFor="admin-identifier">{t("identifier")}</Label>
        <Input
          autoComplete="username"
          aria-invalid={Boolean(errors.identifier)}
          dir="ltr"
          id="admin-identifier"
          placeholder={t("identifierPlaceholder")}
          type="text"
          {...register("identifier")}
        />
        {errors.identifier ? (
          <p className="text-xs text-destructive">{t("identifierError")}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="admin-password">{t("password")}</Label>
        <Input
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          dir="ltr"
          id="admin-password"
          placeholder={t("passwordPlaceholder")}
          type="password"
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-xs text-destructive">{t("passwordError")}</p>
        ) : null}
      </div>
      {submitError ? (
        <SubmissionError
          message={submitError.message}
          referenceLabel={common("reference")}
          requestId={submitError.requestId}
        />
      ) : null}
      <Button className="w-full" disabled={isSubmitting} size="lg" type="submit">
        {isSubmitting ? (
          <Loader2 aria-hidden="true" className="animate-spin" />
        ) : (
          <LockKeyhole aria-hidden="true" />
        )}
        {isSubmitting ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
