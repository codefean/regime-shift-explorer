// RegimeShiftExplorer.jsx

import { useState, useMemo } from "react";
import { useTheme } from "./hooks/useTheme";
import { useShifts } from "./hooks/useShifts";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import FilterBar from "./components/FilterBar";
import ShiftCard from "./components/ShiftCard";
import DetailView from "./components/DetailView";

export default function RegimeShiftExplorer() {
  const { theme, mode, toggle } = useTheme();
  const { shifts, source, error } = useShifts();
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
    <div style={{
      fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
      minHeight: "100vh",
      background: theme.bg,
      color: theme.text,
      padding: 0,
      transition: "background 0.2s, color 0.2s",
    }}>
      <Header theme={theme} mode={mode} onToggle={toggle} />

      <div style={{ padding: "20px 32px 40px" }}>

        {/* CSV parse error banner */}
        {error && (
          <div style={{
            background: "#fee2e2",
            border: "1px solid #fca5a5",
            borderRadius: 8,
            padding: "8px 14px",
            marginBottom: 16,
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: "#7f1d1d",
            letterSpacing: "0.06em",
          }}>
            ⚠ CSV parse error: {error} — showing static data
          </div>
        )}

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
    </div>
  );
}
