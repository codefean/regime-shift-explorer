// hooks/useLocations.js
// Fetches /rsdb_clean_240824.csv from /public at startup.
// Returns a Map: shift name → array of {lng, lat, name, id}

import { useState, useEffect } from "react";
import { parseLocationsCSV } from "../utils/parseLocationsCSV";

let cachedLocations = null; 



export function useLocations() {
  const [locations, setLocations] = useState(cachedLocations);
  const [loading, setLoading] = useState(!cachedLocations);

  useEffect(() => {
    if (cachedLocations) {
      setLocations(cachedLocations);
      setLoading(false);
      return;
    }

    fetch(`${import.meta.env.BASE_URL}rsdb_clean_240824.csv?t=${Date.now()}`)
      .then(res => {
        if (!res.ok) throw new Error("not found");
        return res.text();
      })
      .then(text => {
        const map = parseLocationsCSV(text);
        cachedLocations = map;
        setLocations(map);
      })
      .catch(() => {
        cachedLocations = new Map();
        setLocations(new Map());
      })
      .finally(() => setLoading(false));
  }, []);

  return { locations, loading };
}
