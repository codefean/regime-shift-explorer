// hooks/useShifts.js
// Tries to load /shifts.csv from the public folder at startup.
// If found and valid, uses that data. Falls back to the static JS data.
//
// TO UPDATE DATA: drop a new shifts.csv into the /public folder and reload.
// TO RESET: delete shifts.csv from /public and reload.

import { useState, useEffect } from "react";
import { SHIFTS as STATIC_SHIFTS } from "../data/shifts";
import { parseShiftsCSV } from "../utils/parseShiftsCSV";

export function useShifts() {
  const [shifts, setShifts] = useState(STATIC_SHIFTS);
  const [source, setSource] = useState("static"); // "static" | "csv"
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Add a cache-busting param so the browser doesn't serve a stale CSV
    // after the user drops in a new one
    fetch(`/shifts.csv?t=${Date.now()}`)
      .then((res) => {
        if (!res.ok) throw new Error("No CSV found");
        return res.text();
      })
      .then((text) => {
        const parsed = parseShiftsCSV(text);
        setShifts(parsed);
        setSource("csv");
        setError(null);
      })
      .catch((err) => {
        // No CSV or parse error — silently fall back to static data
        if (err.message !== "No CSV found") {
          setError(err.message);
        }
        setShifts(STATIC_SHIFTS);
        setSource("static");
      })
      .finally(() => setLoading(false));
  }, []);

  return { shifts, source, error, loading };
}
