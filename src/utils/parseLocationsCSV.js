// utils/parseLocationsCSV.js
// Parses rsdb_clean_240824.csv (or any CSV with `type`, `long`, `lat`, `case_study_name` columns)
// Returns a Map: normalised shift name → array of { lng, lat, name, id }
//
// The CSV `type` values don't always match the app's shift names exactly,
// so we normalise both sides to lowercase and do fuzzy keyword matching.

// Manual mapping from CSV `type` values → app shift names
// Key: lowercase CSV type, Value: exact app shift name
const TYPE_MAP = {
  "arctic benthos borealisation":  "Arctic benthos borealisation",
  "arctic sea-ice loss":           "Arctic sea ice loss",
  "bivalves collapse":             "Bivalves collapse",
  "bush encroachment":             "Bush encroachment",
  "common pool resource harvesting": "Common pool resource harvesting",
  "coniferous to deciduous forest": "Coniferous to deciduous forest",
  "coral transitions":             "Coral transitions",
  "dryland degradation":           "Bush encroachment",       
  "fisheries collapse":            "Fisheries collapse",
  "forest to savanna":             "Forest to savanna",
  "freshwater eutrophication":     "Freshwater eutrophication",
  "greenland ice sheet collapse":  "Greenland ice sheet collapse",
  "hypoxia":                       "Hypoxia",
  "kelps transitions":             "Kelp transitions",
  "mangroves transitions":         "Salt marshes to tidal flats", 
  "marine eutrophication":         "Marine eutrophication",
  "marine foodwebs":               "Marine food webs",
  "moonson":                       "Indian summer monsoon",
  "peatland transitions":          "Peatland transitions",
  "primary production arctic ocean": "Primary productivity — Arctic Ocean",
  "river channel change":          "River channel change",
  "salt marshes to tidal flats":   "Salt marshes to tidal flats",
  "seagrass transitions":          "Seagrass transitions",
  "soil salinization":             "Bush encroachment",         
  "sprawling vs compact city":     "Sprawling vs compact cities",
  "steppe to tundra":              "Steppe to tundra",
  "submerged to floating plants":  "Submerged to floating plants",
  "thermohaline circulation":      "Thermohaline circulation (AMOC)",
  "thermokarst lakes":             "Thermokarst lakes",
  "tundra to forest":              "Tundra to boreal forest",
  "west antarctic ice sheet collapse": "West Antarctic ice sheet collapse",
};

export function parseLocationsCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return new Map();

  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, "").toLowerCase());

  const idxOf = name => headers.indexOf(name);
  const iType   = idxOf("type");
  const iLng    = idxOf("long");
  const iLat    = idxOf("lat");
  const iName   = idxOf("case_study_name");
  const iId     = idxOf("id");

  if (iType === -1 || iLng === -1 || iLat === -1) {
    console.warn("parseLocationsCSV: missing required columns (type, long, lat)");
    return new Map();
  }

  const result = new Map(); // shiftName → [{lng, lat, name, id}]

  for (let i = 1; i < lines.length; i++) {
    const row = splitCSVRow(lines[i]);
    if (!row.length) continue;

    const rawType = (row[iType] || "").trim().replace(/^"|"$/g, "").toLowerCase();
    const lng     = parseFloat((row[iLng] || "").replace(/^"|"$/g, ""));
    const lat     = parseFloat((row[iLat] || "").replace(/^"|"$/g, ""));
    const name    = (row[iName] || "").replace(/^"|"$/g, "").trim();
    const id      = (row[iId] || "").replace(/^"|"$/g, "").trim();

    if (!rawType || rawType === "na" || rawType === "unclassified") continue;
    if (isNaN(lng) || isNaN(lat)) continue;
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) continue;

    const shiftName = TYPE_MAP[rawType];
    if (!shiftName) continue;

const key = shiftName.toLowerCase();
if (!result.has(key)) result.set(key, []);
result.get(key).push({ lng, lat, name, id });
  }

  return result;
}

function splitCSVRow(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQuotes = !inQuotes; }
    else if (ch === "," && !inQuotes) { result.push(current); current = ""; }
    else { current += ch; }
  }
  result.push(current);
  return result;
}
