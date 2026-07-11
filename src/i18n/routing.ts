import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fa", "en"],
  defaultLocale: "fa",
  localePrefix: "always",
});

const rtlLocales = new Set<string>(["fa"]);

export function getLocaleDirection(locale: string) {
  return rtlLocales.has(locale) ? "rtl" : "ltr";
}
