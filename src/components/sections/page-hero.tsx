import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
  compact?: boolean;
  meta?: React.ReactNode;
  align?: "start" | "center";
};

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  compact = false,
  meta,
  align = "start",
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b bg-surface/45">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-grid opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_82%)]"
      />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-full bg-surface/55" />
      <Container
        className={cn(
          "grid gap-8",
          compact ? "py-14 sm:py-20" : "py-20 sm:py-28 lg:py-32",
        )}
      >
        <div className={cn("max-w-4xl", align === "center" && "mx-auto text-center")}>
          <Badge
            className="rounded-full border-primary/25 bg-primary/10 px-3 py-1 text-primary hover:bg-primary/10"
            variant="outline"
          >
            {eyebrow}
          </Badge>
          <h1 className={cn(
            "mt-6 max-w-4xl text-balance text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl",
            align === "center" && "mx-auto",
          )}>
            {title}
          </h1>
          <p className={cn(
            "mt-6 max-w-2xl text-pretty text-base leading-8 text-muted-foreground sm:text-lg",
            align === "center" && "mx-auto",
          )}>
            {description}
          </p>
          {meta ? <div className="mt-5">{meta}</div> : null}
          {children ? (
            <div
              className={cn(
                "mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row",
                align === "center" ? "justify-center" : "justify-start",
              )}
            >
              {children}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
