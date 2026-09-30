"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 opacity-50"
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const currentTheme = theme || "system";
  const icon =
    currentTheme === "system" ? (
      <Laptop className="h-4 w-4 text-muted-foreground" />
    ) : resolvedTheme === "dark" ? (
      <Moon className="h-4 w-4 text-blue-400" />
    ) : (
      <Sun className="h-4 w-4 text-amber-500" />
    );

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 transition-colors rounded-lg hover:bg-muted/80"
      title={`Current: ${currentTheme}. Click to switch theme`}
      aria-label={`Current: ${currentTheme}. Click to switch theme`}
    >
      {icon}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
