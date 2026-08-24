"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;

    const apply = () => {
      // startViewTransition requires the DOM to be fully settled before its
      // callback returns — flushSync forces React's state update (the
      // button label) to happen synchronously instead of on its own tick.
      flushSync(() => {
        setIsDark(next);
      });
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
    };

    // Smooth wipe transition where supported; falls back to an instant
    // switch on browsers without the View Transitions API. The animation
    // itself can be legitimately skipped (e.g. a backgrounded tab) without
    // the theme change failing, so that rejection is expected, not an error.
    if (document.startViewTransition) {
      document.startViewTransition(apply).ready.catch(() => {});
    } else {
      apply();
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-ink-muted hover:text-ink"
    >
      {isDark ? "Light" : "Dark"}
    </button>
  );
}
