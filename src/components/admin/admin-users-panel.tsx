"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Power, UserPlus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import {
  deactivateAdminUserAction,
  saveAdminUserAction,
} from "@/actions/admin-user.actions";
import type { AdminRole } from "@/core/admin-auth";
import { adminRoles } from "@/core/admin-user";
import {
  adminUserSchema,
  type AdminUserFormValues,
} from "@/features/admin/users.schema";
import { useRouter } from "@/i18n/navigation";

import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AdminUserListItem = {
  id: string;
  email: string;
  username: string;
  name: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
};

const emptyValues: AdminUserFormValues = {
  email: "",
  username: "",
  name: "",
  password: "",
  role: "EDITOR",
  isActive: true,
};

export function AdminUsersPanel({
  currentAdminId,
  users,
}: {
  currentAdminId: string;
  users: AdminUserListItem[];
}) {
  const locale = useLocale() as "fa" | "en";
  const router = useRouter();
  const t = useTranslations("AdminUsers");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<AdminUserFormValues>({
    resolver: zodResolver(adminUserSchema),
    defaultValues: emptyValues,
    mode: "onBlur",
  });

  const selectedUser = useMemo(
    () => users.find((user) => user.id === editingId) ?? null,
    [editingId, users],
  );
  const watchedRole = watch("role");
  const watchedIsActive = watch("isActive");

  const startCreate = () => {
    setEditingId(null);
    setFeedback(null);
    reset(emptyValues);
  };

  const startEdit = (user: AdminUserListItem) => {
    setEditingId(user.id);
    setFeedback(null);
    reset({
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      password: "",
      role: user.role,
      isActive: user.isActive,
    });
  };

  const errorMessage = (code: string) => {
    if (code === "DUPLICATE") return t("errors.duplicate");
    if (code === "FORBIDDEN") return t("errors.forbidden");
    if (code === "LAST_SUPER_ADMIN") return t("errors.lastSuperAdmin");
    if (code === "UNAUTHORIZED") return t("errors.unauthorized");
    if (code === "VALIDATION_ERROR") return t("errors.validation");
    return t("errors.generic");
  };

  const fieldError = (name: keyof typeof errors) =>
    errors[name] ? (
      <p className="text-xs text-destructive">
        {t(`validation.${errors[name]?.message ?? "required"}`)}
      </p>
    ) : null;

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="overflow-hidden rounded-xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="px-4">{t("columns.user")}</TableHead>
              <TableHead className="hidden px-4 md:table-cell">
                {t("columns.role")}
              </TableHead>
              <TableHead className="px-4">{t("columns.status")}</TableHead>
              <TableHead className="hidden px-4 lg:table-cell">
                {t("columns.created")}
              </TableHead>
              <TableHead className="px-4 text-end">
                {t("columns.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="px-4 py-4">
                  <p className="font-medium">{user.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground" dir="ltr">
                    {user.username} · {user.email}
                  </p>
                </TableCell>
                <TableCell className="hidden px-4 md:table-cell">
                  {t(`roles.${user.role}`)}
                </TableCell>
                <TableCell className="px-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      className={
                        user.isActive
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-slate-50 text-slate-600"
                      }
                      variant="outline"
                    >
                      {user.isActive ? t("active") : t("inactive")}
                    </Badge>
                    {user.id === currentAdminId ? (
                      <Badge variant="outline">{t("current")}</Badge>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="hidden px-4 lg:table-cell">
                  {user.createdAt}
                </TableCell>
                <TableCell className="px-4">
                  <div className="flex justify-end gap-1">
                    <Button
                      onClick={() => startEdit(user)}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      {t("edit")}
                    </Button>
                    <Button
                      disabled={!user.isActive}
                      onClick={async () => {
                        if (!window.confirm(t("deactivateConfirm"))) return;
                        setFeedback(null);
                        const result = await deactivateAdminUserAction({
                          id: user.id,
                          locale,
                        });
                        if (result.success) {
                          setFeedback({
                            type: "success",
                            message: t("deactivated"),
                          });
                          router.refresh();
                          return;
                        }
                        setFeedback({
                          type: "error",
                          message: errorMessage(result.code),
                        });
                      }}
                      size="icon"
                      type="button"
                      variant="ghost"
                    >
                      <Power aria-hidden="true" />
                      <span className="sr-only">{t("deactivate")}</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <form
        className="h-fit space-y-5 rounded-xl border bg-white p-6"
        noValidate
        onSubmit={handleSubmit(async (values) => {
          setFeedback(null);
          const result = await saveAdminUserAction({ ...values, locale });
          if (result.success) {
            setFeedback({
              type: "success",
              message: editingId ? t("updated") : t("created"),
            });
            if (!editingId) {
              reset(emptyValues);
            }
            router.refresh();
            return;
          }
          setFeedback({ type: "error", message: errorMessage(result.code) });
        })}
      >
        <input type="hidden" {...register("id")} />
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">
              {editingId ? t("form.editTitle") : t("form.createTitle")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {editingId && selectedUser
                ? selectedUser.email
                : t("form.createDescription")}
            </p>
          </div>
          <Button onClick={startCreate} size="icon" type="button" variant="ghost">
            <UserPlus aria-hidden="true" />
            <span className="sr-only">{t("add")}</span>
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-user-name">{t("form.name")}</Label>
          <Input id="admin-user-name" {...register("name")} />
          {fieldError("name")}
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-user-email">{t("form.email")}</Label>
          <Input dir="ltr" id="admin-user-email" {...register("email")} />
          {fieldError("email")}
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-user-username">{t("form.username")}</Label>
          <Input dir="ltr" id="admin-user-username" {...register("username")} />
          <p className="text-xs text-muted-foreground">
            {t("form.usernameHint")}
          </p>
          {fieldError("username")}
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-user-password">{t("form.password")}</Label>
          <Input
            autoComplete="new-password"
            dir="ltr"
            id="admin-user-password"
            type="password"
            {...register("password")}
          />
          <p className="text-xs text-muted-foreground">
            {editingId ? t("form.passwordEditHint") : t("form.passwordHint")}
          </p>
          {fieldError("password")}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <div className="space-y-2">
            <Label htmlFor="admin-user-role">{t("form.role")}</Label>
            <Select
              onValueChange={(value) =>
                setValue("role", value as AdminRole, { shouldValidate: true })
              }
              value={watchedRole}
            >
              <SelectTrigger id="admin-user-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {adminRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {t(`roles.${role}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <label className="flex items-center gap-2 pt-2 text-sm font-medium sm:pt-8 xl:pt-2">
            <input
              checked={watchedIsActive}
              className="size-4 accent-primary"
              onChange={(event) =>
                setValue("isActive", event.target.checked, {
                  shouldDirty: true,
                })
              }
              type="checkbox"
            />
            {t("form.isActive")}
          </label>
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

        <Button disabled={isSubmitting} className="w-full" type="submit">
          {isSubmitting ? (
            <Loader2 aria-hidden="true" className="animate-spin" />
          ) : null}
          {editingId ? t("form.save") : t("form.create")}
        </Button>
      </form>
    </div>
  );
}
