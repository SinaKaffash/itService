import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PublicAnnouncement, PublicItService, PublicProject } from "@/core/operations";
import { cn } from "@/lib/utils";

const health = { OPERATIONAL: ["فعال", "bg-success"], DEGRADED: ["اختلال", "bg-amber-400"], OUTAGE: ["قطعی", "bg-destructive"], MAINTENANCE: ["تعمیرات", "bg-primary"] } as const;
const severity = { INFO: "اطلاعیه", MAINTENANCE: "تعمیرات", INCIDENT: "هشدار" } as const;
type ProjectCardLabels = {
  empty: string;
  expectedEnd: string;
  progress: string;
  statuses: Record<PublicProject["status"], string>;
};

export function ProjectCards({ labels, projects }: { labels: ProjectCardLabels; projects: PublicProject[] }) {
  if (!projects.length) return <p className="text-sm text-muted-foreground">{labels.empty}</p>;

  return <div className="grid gap-4 md:grid-cols-2">{projects.map(item => <Card key={item.id}><CardHeader><div className="flex items-start justify-between gap-3"><CardTitle>{item.title}</CardTitle><Badge variant="secondary">{labels.statuses[item.status]}</Badge></div><p className="text-sm font-normal leading-6 text-muted-foreground">{item.description}</p></CardHeader><CardContent><div className="flex items-center justify-between gap-3 text-sm font-bold"><span>{labels.progress.replace("{progress}", String(item.progress))}</span>{item.expectedEndDate ? <span className="text-end text-muted-foreground">{labels.expectedEnd.replace("{date}", new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(item.expectedEndDate))}</span> : null}</div><div aria-label={labels.progress.replace("{progress}", String(item.progress))} aria-valuemax={100} aria-valuemin={0} aria-valuenow={item.progress} className="mt-3 h-2 overflow-hidden rounded-full bg-muted" role="progressbar"><div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${item.progress}%` }} /></div></CardContent></Card>)}</div>;
}
export function ServiceStatusList({ services }: { services: PublicItService[] }) { if (!services.length) return <p className="text-sm text-muted-foreground">وضعیت سرویسی برای نمایش ثبت نشده است.</p>; return <div className="space-y-3">{services.map(item => { const [label, color] = health[item.health]; return <div className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4" key={item.id}><div className="min-w-0"><p className="font-bold">{item.name}</p>{item.description ? <p className="mt-1 text-sm text-muted-foreground">{item.description}</p> : null}</div><span className="flex shrink-0 items-center gap-2 text-sm font-semibold"><i className={cn("size-2.5 rounded-full", color)} />{label}</span></div>; })}</div>; }
export function AnnouncementCards({ announcements }: { announcements: PublicAnnouncement[] }) { if (!announcements.length) return <p className="text-sm text-muted-foreground">اطلاعیه فعالی وجود ندارد.</p>; return <div className="space-y-3">{announcements.map(item => <div className="rounded-xl border bg-card p-5" key={item.id}><div className="flex items-center gap-2"><AlertTriangle className="size-5 text-primary" /><Badge variant="outline">{severity[item.severity]}</Badge></div><h3 className="mt-3 font-bold">{item.title}</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{item.body}</p></div>)}</div>; }
