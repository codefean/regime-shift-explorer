// components/FilterBar.jsx
import { FILTERS } from "../data/shifts";

export default function FilterBar({ theme, activeFilter, onFilter, shifts }) {
  const total = shifts?.length ?? 0;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
      {FILTERS.map((f) => {
        const active = activeFilter === f.key;
        return (
          <button
            key={f.key}
            onClick={() => onFilter(f.key)}
            style={{
              padding: "5px 14px",
              fontSize: 12,
              border: `1px solid ${active ? theme.filterActiveBorder : theme.filterBorder}`,
              borderRadius: 20,
              background: active ? theme.filterActiveBg : "transparent",
              color: active ? theme.filterActiveText : theme.filterText,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
              letterSpacing: "0.01em",
            }}
          >
            {f.label}{f.key === "all" && ` (${total})`}
          </button>
        );
      })}
    </div>
  );
}
