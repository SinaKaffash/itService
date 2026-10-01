import messages from "@/messages/fa.json";

type MessageValue = string | number | boolean | null | MessageTree;
type MessageTree = { [key: string]: MessageValue };

function resolve(path: string): MessageValue | undefined {
  return path.split(".").reduce<MessageValue | undefined>((value, key) => {
    return value && typeof value === "object" ? (value as MessageTree)[key] : undefined;
  }, messages as MessageTree);
}

export function getTranslations(
  namespace?: string | { namespace?: string; locale?: string },
) {
  return Promise.resolve(
    createTranslator(typeof namespace === "string" ? namespace : namespace?.namespace),
  );
}

export function useTranslations(namespace?: string) {
  return createTranslator(namespace);
}

export function getLocale() {
  return Promise.resolve("fa");
}

export function useLocale() {
  return "fa" as const;
}

export function setRequestLocale(_locale: string) {}

export function getMessages() {
  return Promise.resolve(messages);
}

export function hasLocale(_locales: readonly string[], locale?: string) {
  return locale === "fa";
}

export function NextIntlClientProvider({ children }: { children: React.ReactNode; messages?: unknown }) {
  return children;
}

export async function getFormatter() {
  return { dateTime: (value: Date, options?: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("fa-IR", options).format(value) };
}

function createTranslator(namespace?: string) {
  return (key: string, values?: Record<string, string | number>) => {
    const value = resolve([namespace, key].filter(Boolean).join("."));
    if (typeof value !== "string") return key;
    return Object.entries(values ?? {}).reduce(
      (text, [name, replacement]) => text.replaceAll(`{${name}}`, String(replacement)),
      value,
    );
  };
}
