// hooks/useShifts.js


import { useState, useEffect } from "react";
import { SHIFTS as STATIC_SHIFTS } from "../data/shifts";
import { parseShiftsCSV } from "../utils/parseShiftsCSV";

export function useShifts() {
  const [shifts, setShifts] = useState(STATIC_SHIFTS);
  const [source, setSource] = useState("static"); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}shifts.csv?t=${Date.now()}`)
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