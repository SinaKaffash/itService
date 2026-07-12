"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

type Theme = "light" | "dark" | "system";

type ThemeSwitcherProps = {
  labels: {
    dark: string;
    label: string;
    light: string;
    system: string;
  };
};

const storageKey = "nexus-theme";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldUseDark = theme === "dark" || (theme === "system" && prefersDark);

  root.classList.toggle("dark", shouldUseDark);
  root.style.colorScheme = shouldUseDark ? "dark" : "light";
}

export function ThemeSwitcher({ labels }: ThemeSwitcherProps) {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(storageKey) as Theme | null;
    const nextTheme =
      storedTheme === "light" || storedTheme === "dark" || storedTheme === "system"
        ? storedTheme
        : "system";
    setTheme(nextTheme);
    applyTheme(nextTheme);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if ((window.localStorage.getItem(storageKey) || "system") === "system") {
        applyTheme("system");
      }
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const cycleTheme = () => {
    const nextTheme = theme === "system" ? "light" : theme === "light" ? "dark" : "system";
    setTheme(nextTheme);
    window.localStorage.setItem(storageKey, nextTheme);
    applyTheme(nextTheme);
  };

  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;
  const currentLabel =
    theme === "dark" ? labels.dark : theme === "light" ? labels.light : labels.system;

  return (
    <Button
      aria-label={`${labels.label}: ${currentLabel}`}
      onClick={cycleTheme}
      size="sm"
      title={`${labels.label}: ${currentLabel}`}
      type="button"
      variant="ghost"
    >
      <Icon aria-hidden="true" />
      <span className="hidden xl:inline">{currentLabel}</span>
    </Button>
  );
}
