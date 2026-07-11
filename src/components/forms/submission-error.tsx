export function SubmissionError({
  message,
  referenceLabel,
  requestId,
}: {
  message: string;
  referenceLabel: string;
  requestId?: string;
}) {
  return (
    <div
      aria-live="polite"
      className="rounded-md border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
      role="alert"
    >
      <p>{message}</p>
      {requestId ? (
        <p className="mt-1 text-xs text-destructive/80" dir="ltr">
          {referenceLabel}: {requestId}
        </p>
      ) : null}
    </div>
  );
}
