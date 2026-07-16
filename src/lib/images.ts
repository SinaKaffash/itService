export function isSupportedImageUrl(value?: string | null) {
  if (!value) {
    return false;
  }

  return value.startsWith("/images/") || value.startsWith("https://");
}

export function imageOrFallback(
  value: string | undefined | null,
  fallback: string,
): string {
  return isSupportedImageUrl(value) && value ? value : fallback;
}
