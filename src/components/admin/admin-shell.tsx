import {
  BookOpenText,
  BriefcaseBusiness,
  LayoutDashboard,
  LogOut,
  MessagesSquare,
  Users,
  Wrench,
} from "lucide-react";

import { logoutAdminAction } from "@/actions/admin-auth.actions";
import type { AdminIdentity } from "@/core/admin-auth";
import { Link } from "@/i18n/navigation";

import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { Button } from "@/components/ui/button";

export function AdminShell({
  admin,
  children,
  labels,
  locale,
}: {
  admin: AdminIdentity;
  children: React.ReactNode;
  labels: {
    brand: string;
    dashboard: string;
    menu: string;
    close: string;
    requests: string;
    services: string;
    portfolio: string;
    blog: string;
    users: string;
    signedInAs: string;
    logout: string;
  };
  locale: string;
}) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/35">
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-bold">{labels.brand}</p>
              <p className="mt-0.5 break-all text-xs text-muted-foreground sm:break-normal">
                {labels.signedInAs}: {admin.email}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1 lg:hidden">
              <AdminMobileNav
                adminEmail={admin.email}
                brand={labels.brand}
                isSuperAdmin={admin.role === "SUPER_ADMIN"}
                labels={{
                  blog: labels.blog,
                  close: labels.close,
                  dashboard: labels.dashboard,
                  menu: labels.menu,
                  portfolio: labels.portfolio,
                  requests: labels.requests,
                  services: labels.services,
                  users: labels.users,
                }}
                locale={locale}
                signedInAs={labels.signedInAs}
              />
              <form action={logoutAdminAction.bind(null, locale)}>
                <Button
                  aria-label={labels.logout}
                  size="icon"
                  type="submit"
                  variant="ghost"
                >
                  <LogOut aria-hidden="true" />
                </Button>
              </form>
            </div>
          </div>
          <div className="hidden items-center justify-between gap-4 lg:flex">
            <nav className="flex w-full flex-wrap items-center gap-1">
              <Button asChild variant="ghost">
                <Link href="/admin/dashboard">
                  <LayoutDashboard aria-hidden="true" />
                  {labels.dashboard}
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/admin/requests">
                  <MessagesSquare aria-hidden="true" />
                  {labels.requests}
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/admin/services">
                  <Wrench aria-hidden="true" />
                  {labels.services}
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/admin/portfolio">
                  <BriefcaseBusiness aria-hidden="true" />
                  {labels.portfolio}
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/admin/blog">
                  <BookOpenText aria-hidden="true" />
                  {labels.blog}
                </Link>
              </Button>
              {admin.role === "SUPER_ADMIN" ? (
                <Button asChild variant="ghost">
                  <Link href="/admin/users">
                    <Users aria-hidden="true" />
                    {labels.users}
                  </Link>
                </Button>
              ) : null}
            </nav>
            <form
              action={logoutAdminAction.bind(null, locale)}
              className="hidden lg:block"
            >
              <Button type="submit" variant="outline">
                <LogOut aria-hidden="true" />
                {labels.logout}
              </Button>
            </form>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
