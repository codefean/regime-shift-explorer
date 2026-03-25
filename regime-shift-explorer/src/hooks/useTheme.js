// hooks/useTheme.js
// Returns the current theme object and a toggle function.
// Persists preference to localStorage.

import { useState } from "react";
import { themes } from "../theme";

export function useTheme() {
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem("rse-theme") || "dark"; }
    catch { return "dark"; }
  });

  const toggle = () => {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    try { localStorage.setItem("rse-theme", next); } catch {}
  };

  return { theme: themes[mode], mode, toggle };
}
