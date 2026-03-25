// utils/parseShiftsCSV.js
// Parses a CSV file into the SHIFTS array format used throughout the app.
//
// COLUMN SPEC (case-insensitive, order doesn't matter):
//   name            — display name of the regime shift (required)
//   tipping         — "true" or "false"
//   category        — comma-separated list e.g. "marine,climate"
//   speed           — one of: fast | medium | slow | abrupt
//   sectors         — pipe-separated list e.g. "Insurance|Agriculture|Real estate"
//   signal_1        — first financial signal
//   signal_2        — second financial signal
//   signal_3        — third financial signal
//   signal_4        — fourth financial signal (optional)
//   horizon         — text description of time horizon
//   detectability   — e.g. "High" or "Moderate-high"
//   detectability_note — e.g. "satellite altimetry + Argo floats"
//   asset_classes   — free text describing exposed asset classes

export function parseShiftsCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) throw new Error("CSV must have a header row and at least one data row.");

  // Parse header — normalise to lowercase, trim whitespace
  const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/^"|"$/g, ""));

  const col = (row, name) => {
    const idx = headers.indexOf(name);
    if (idx === -1) return "";
    const val = row[idx] ?? "";
    // Strip surrounding quotes added by Excel/Sheets
    return val.trim().replace(/^"|"$/g, "").trim();
  };

  const shifts = [];

  for (let i = 1; i < lines.length; i++) {
    const raw = lines[i];
    if (!raw.trim()) continue;

    // Split respecting quoted commas (simple CSV parser)
    const row = splitCSVRow(raw);

    const name = col(row, "name");
    if (!name) continue; // skip blank rows

    // signals — collect signal_1 … signal_4, drop empty ones
    const signals = [
      col(row, "signal_1"),
      col(row, "signal_2"),
      col(row, "signal_3"),
      col(row, "signal_4"),
    ].filter(Boolean);

    // category and sectors are pipe-separated in the CSV to avoid
    // conflict with the comma delimiter
    const category = col(row, "category")
      .split("|")
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);

    const sectors = col(row, "sectors")
      .split("|")
      .map(s => s.trim())
      .filter(Boolean);

    shifts.push({
      name,
      tipping: col(row, "tipping").toLowerCase() === "true",
      category: category.length ? category : ["terrestrial"],
      speed: col(row, "speed") || "medium",
      sectors: sectors.length ? sectors : [],
      signals,
      horizon: col(row, "horizon"),
      detectability: col(row, "detectability"),
      detectabilityNote: col(row, "detectability_note"),
      assetClasses: col(row, "asset_classes"),
    });
  }

  if (!shifts.length) throw new Error("No valid rows found in CSV.");
  return shifts;
}

// Simple CSV row splitter that handles quoted fields containing commas
function splitCSVRow(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}
