// components/GridView.jsx

import { useState, useMemo } from "react";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import ShiftCard from "./ShiftCard";
import DetailView from "./DetailView";

export default function GridView({ theme, shifts, source, error }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedShift, setSelectedShift] = useState(null);

  const filtered = useMemo(() => {
    return shifts.filter((s) => {
      const catMatch = activeFilter === "all" || s.category.includes(activeFilter);
      const q = search.toLowerCase();
      const searchMatch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.sectors.some((x) => x.toLowerCase().includes(q)) ||
        s.assetClasses.toLowerCase().includes(q) ||
        s.signals.some((sig) => sig.toLowerCase().includes(q));
      return catMatch && searchMatch;
    });
  }, [shifts, activeFilter, search]);

  // Detail view
  if (selectedShift) {
    return (
      <DetailView
        shift={selectedShift}
        theme={theme}
        onBack={() => setSelectedShift(null)}
      />
    );
  }

  return (
    <div style={{ padding: "20px 32px 40px" }}>
      {source === "static" && !error && (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          marginBottom: 12,
        }}>
          <a
            href="/shifts-template.csv"
            download="shifts-template.csv"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.08em",
              color: theme.metaLabel,
              textDecoration: "none",
            }}
          >
            DOWNLOAD CSV TEMPLATE ↓
          </a>
        </div>
      )}

      <SearchBar
        theme={theme}
        value={search}
        onChange={setSearch}
        total={shifts.length}
        filtered={filtered.length}
      />

      <FilterBar
        theme={theme}
        activeFilter={activeFilter}
        onFilter={setActiveFilter}
        shifts={shifts}
      />

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", color: theme.textDim, fontSize: 14, padding: "40px 0" }}>
          No regime shifts match your filter.
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
          gap: 12,
        }}>
          {filtered.map((s) => (
            <ShiftCard
              key={s.name}
              shift={s}
              theme={theme}
              onClick={() => setSelectedShift(s)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
