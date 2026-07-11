import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
  compact?: boolean;
};

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  compact = false,
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.12),transparent_55%)]"
      />
      <Container
        className={cn(
          "flex flex-col items-center text-center",
          compact ? "py-20 sm:py-24" : "py-24 sm:py-32",
        )}
      >
        <Badge
          className="border-primary/20 bg-primary/5 text-primary hover:bg-primary/5"
          variant="outline"
        >
          {eyebrow}
        </Badge>
        <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-[1.2] tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
          {description}
        </p>
        {children ? (
          <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            {children}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
