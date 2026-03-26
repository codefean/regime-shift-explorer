// hooks/useTheme.js


import { useState } from "react";
import { themes } from "../theme";

export function useTheme() {
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem("rse-theme") || "light"; }
    catch { return "light"; }
  });

  const toggle = () => {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    try { localStorage.setItem("rse-theme", next); } catch {}
  };

  return { theme: themes[mode], mode, toggle };
}
