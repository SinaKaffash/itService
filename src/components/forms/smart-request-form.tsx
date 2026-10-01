"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "@/lib/messages";
import { Controller, useForm } from "react-hook-form";

import { submitLeadRequestAction } from "@/actions/lead-request.actions";
import {
  leadRequestSchema,
  type LeadRequestFormValues,
} from "@/features/requests/lead-request.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmissionError } from "@/components/forms/submission-error";
import { Textarea } from "@/components/ui/textarea";

export function SmartRequestForm() {
  const locale = useLocale() as "fa" | "en";
  const t = useTranslations("LeadForm");
  const common = useTranslations("Common.errors");
  const [completed, setCompleted] = useState(false);
  const [submitError, setSubmitError] = useState<{
    message: string;
    requestId?: string;
  } | null>(null);
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<LeadRequestFormValues>({
    resolver: zodResolver(leadRequestSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      company: "",
      serviceType: undefined,
      budget: undefined,
      description: "",
      locale,
      honeypot: "",
    },
    mode: "onBlur",
  });

  const validationMessage = (message?: string) =>
    message ? t(`validation.${message}`) : null;

  if (completed) {
    return (
      <div
        className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-success/25 bg-success/10 p-8 text-center"
        role="status"
      >
        <CheckCircle2
          aria-hidden="true"
          className="size-10 text-success"
        />
        <h2 className="mt-5 text-2xl font-bold">{t("successTitle")}</h2>
        <p className="mt-3 max-w-md leading-7 text-muted-foreground">
          {t("successDescription")}
        </p>
      </div>
    );
  }

  return (
    <form
      className="grid gap-6"
      noValidate
      onSubmit={handleSubmit(async (values) => {
        setSubmitError(null);
        const result = await submitLeadRequestAction(values);

        if (result.success) {
          setCompleted(true);
          return;
        }

        setSubmitError(
          {
            message:
              result.code === "VALIDATION_ERROR"
                ? t("validationError")
                : t("submissionError"),
            requestId: result.requestId,
          },
        );
      })}
    >
      <input type="hidden" value={locale} {...register("locale")} />
      <div
        aria-hidden="true"
        className="absolute -start-[9999px] size-px overflow-hidden"
      >
        <Label htmlFor="request-website">{t("honeypot")}</Label>
        <Input
          autoComplete="off"
          id="request-website"
          tabIndex={-1}
          {...register("honeypot")}
        />
      </div>

      <div className="rounded-2xl border bg-background/55 p-4 sm:p-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="request-full-name">{t("fullName")}</Label>
          <Input
            autoComplete="name"
            aria-invalid={Boolean(errors.fullName)}
            id="request-full-name"
            placeholder={t("fullNamePlaceholder")}
            {...register("fullName")}
          />
          {errors.fullName ? (
            <p className="text-xs text-destructive">
              {validationMessage(errors.fullName.message)}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="request-phone">{t("phone")}</Label>
          <Input
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            dir="ltr"
            id="request-phone"
            inputMode="tel"
            placeholder={t("phonePlaceholder")}
            {...register("phone")}
          />
          {errors.phone ? (
            <p className="text-xs text-destructive">
              {validationMessage(errors.phone.message)}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="request-email">{t("emailOptional")}</Label>
          <Input
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            dir="ltr"
            id="request-email"
            placeholder={t("emailPlaceholder")}
            type="email"
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-xs text-destructive">
              {validationMessage(errors.email.message)}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="request-company">{t("companyOptional")}</Label>
          <Input
            autoComplete="organization"
            aria-invalid={Boolean(errors.company)}
            id="request-company"
            placeholder={t("companyPlaceholder")}
            {...register("company")}
          />
          {errors.company ? (
            <p className="text-xs text-destructive">
              {validationMessage(errors.company.message)}
            </p>
          ) : null}
        </div>
      </div>
      </div>

      <div className="rounded-2xl border bg-background/55 p-4 sm:p-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="request-service">{t("service")}</Label>
          <Controller
            control={control}
            name="serviceType"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  aria-invalid={Boolean(errors.serviceType)}
                  id="request-service"
                >
                  <SelectValue placeholder={t("servicePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web-platforms">
                    {t("services.web")}
                  </SelectItem>
                  <SelectItem value="mobile-applications">
                    {t("services.mobile")}
                  </SelectItem>
                  <SelectItem value="it-infrastructure">
                    {t("services.infrastructure")}
                  </SelectItem>
                  <SelectItem value="custom-dashboards">
                    {t("services.dashboard")}
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.serviceType ? (
            <p className="text-xs text-destructive">
              {validationMessage(errors.serviceType.message)}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="request-budget">{t("budget")}</Label>
          <Controller
            control={control}
            name="budget"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  aria-invalid={Boolean(errors.budget)}
                  id="request-budget"
                >
                  <SelectValue placeholder={t("budgetPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">
                    {t("budgets.starter")}
                  </SelectItem>
                  <SelectItem value="growth">
                    {t("budgets.growth")}
                  </SelectItem>
                  <SelectItem value="scale">{t("budgets.scale")}</SelectItem>
                  <SelectItem value="custom">{t("budgets.custom")}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.budget ? (
            <p className="text-xs text-destructive">
              {validationMessage(errors.budget.message)}
            </p>
          ) : null}
        </div>
      </div>
      </div>

      <div className="rounded-2xl border bg-background/55 p-4 sm:p-5">
      <div className="space-y-2">
        <Label htmlFor="request-description">{t("description")}</Label>
        <Textarea
          aria-invalid={Boolean(errors.description)}
          className="min-h-36 resize-y"
          id="request-description"
          placeholder={t("descriptionPlaceholder")}
          {...register("description")}
        />
        {errors.description ? (
          <p className="text-xs text-destructive">
            {validationMessage(errors.description.message)}
          </p>
        ) : null}
      </div>
      </div>

      {submitError ? (
        <SubmissionError
          message={submitError.message}
          referenceLabel={common("reference")}
          requestId={submitError.requestId}
        />
      ) : null}

      <Button
        className="mt-2 w-full sm:w-auto"
        disabled={isSubmitting}
        size="lg"
        type="submit"
      >
        {isSubmitting ? (
          <Loader2 aria-hidden="true" className="animate-spin" />
        ) : null}
        {isSubmitting ? t("submitting") : t("requestSubmit")}
      </Button>
      <p className="text-xs leading-6 text-muted-foreground">{t("privacy")}</p>
    </form>
  );
}
