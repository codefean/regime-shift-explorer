// components/SearchBar.jsx

export default function SearchBar({ theme, value, onChange, total, filtered }) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
      <input
        type="text"
        placeholder="Search by shift, sector, or asset class…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          flex: 1,
          background: theme.searchBg,
          border: `1px solid ${theme.searchBorder}`,
          borderRadius: 8,
          color: theme.text,
          fontSize: 13,
          padding: "8px 14px",
          outline: "none",
          fontFamily: "inherit",
        }}
      />
      <span style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 11,
        color: theme.countColor,
        letterSpacing: "0.08em",
        whiteSpace: "nowrap",
      }}>
        {String(filtered).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
    </div>
  );
}
