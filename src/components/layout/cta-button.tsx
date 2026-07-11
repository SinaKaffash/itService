import type { ComponentProps } from "react";
import { ArrowUpLeft } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

type CTAButtonProps = ComponentProps<typeof Link> & {
  showArrow?: boolean;
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof Button>["size"];
};

export function CTAButton({
  children,
  className,
  showArrow = false,
  variant = "default",
  size = "lg",
  ...props
}: CTAButtonProps) {
  return (
    <Button
      asChild
      className={cn(
        variant === "default" && "cyan-glow font-semibold",
        className,
      )}
      size={size}
      variant={variant}
    >
      <Link {...props}>
        {children}
        {showArrow ? (
          <ArrowUpLeft aria-hidden="true" className="size-4 rtl:-scale-x-100" />
        ) : null}
      </Link>
    </Button>
  );
}
