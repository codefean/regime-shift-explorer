// utils/parseLocationsCSV.js
// Parses rsdb_clean_240824.csv and returns:
//   Map<string, Array<{lng, lat, name, id}>>
// keyed by the "type" field (regime shift type), normalised to match shifts.js display names.

// Maps CSV "type" values → shifts.js name where they differ
const CSV_TYPE_MAP = {
  "Thermohaline circulation":          "Thermohaline circulation (AMOC)",
  "Arctic sea-ice loss":               "Arctic sea ice loss",
  "West antarctic ice sheet collapse": "West Antarctic ice sheet collapse",
  "Kelps transitions":                 "Kelp transitions",
  "Marine foodwebs":                   "Marine food webs",
  "Primary production arctic ocean":   "Primary productivity — Arctic Ocean",
  "Tundra to forest":                  "Tundra to boreal forest",
  "Moonson":                           "Indian summer monsoon",
  "Sprawling vs compact city":         "Sprawling vs compact cities",
};

export function parseLocationsCSV(text) {
  const lines = text.split("\n");
  if (lines.length < 2) return new Map();

  // Parse header — handle quoted commas
  const headers = parseCSVRow(lines[0]);
  const typeIdx = headers.indexOf("type");
  const lngIdx  = headers.indexOf("long");
  const latIdx  = headers.indexOf("lat");
  const nameIdx = headers.indexOf("case_study_name");
  const idIdx   = headers.indexOf("id");

  const map = new Map();

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = parseCSVRow(line);
    const rawType = cols[typeIdx]?.trim();
    const lng     = parseFloat(cols[lngIdx]);
    const lat     = parseFloat(cols[latIdx]);

    if (!rawType || isNaN(lng) || isNaN(lat)) continue;

    // Normalise to the display name used in shifts.js, falling back to the raw CSV value
    const key = CSV_TYPE_MAP[rawType] ?? rawType;

    const entry = {
      id:   cols[idIdx]?.trim() ?? String(i),
      name: cols[nameIdx]?.trim() ?? rawType,
      lng,
      lat,
    };

    if (!map.has(key)) map.set(key, []);
    map.get(key).push(entry);
  }

  return map;
}

// Minimal RFC-4180 CSV row parser (handles quoted fields with commas)
function parseCSVRow(line) {
  const fields = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      fields.push(cur); cur = "";
    } else {
      cur += ch;
    }
  }
  fields.push(cur);
  return fields;
}