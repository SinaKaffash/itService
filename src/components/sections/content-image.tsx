import { cn } from "@/lib/utils";
import { imageOrFallback } from "@/lib/images";

type ContentImageProps = {
  alt: string;
  className?: string;
  fallback: string;
  image?: string;
};

export function ContentImage({
  alt,
  className,
  fallback,
  image,
}: ContentImageProps) {
  return (
    // Admins can provide external image URLs, so this intentionally avoids next/image remote allowlists.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      className={cn("h-full w-full object-cover", className)}
      loading="lazy"
      src={imageOrFallback(image, fallback)}
    />
  );
}
