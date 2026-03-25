// components/Header.jsx

export default function Header({ theme, mode, onToggle }) {
  return (
    <div style={{
      borderBottom: `1px solid ${theme.headerBorder}`,
      padding: "28px 32px 20px",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 12,
    }}>
      <div>
        <div style={{
          fontFamily: "'DM Mono', 'Courier New', monospace",
          fontSize: 13,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: theme.titleColor,
          marginBottom: 6,
          fontWeight: 400,
        }}>
          Environmental intelligence
        </div>
        <div style={{
          fontSize: 22,
          fontWeight: 300,
          color: theme.subtitleColor,
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
        }}>
          Regime shift financial exposure index
        </div>
      </div>

      <button
        onClick={onToggle}
        style={{
          background: theme.toggleBg,
          border: `1px solid ${theme.toggleBorder}`,
          borderRadius: 8,
          color: theme.toggleText,
          cursor: "pointer",
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.08em",
          padding: "6px 14px",
          alignSelf: "center",
          transition: "all 0.15s",
        }}
      >
        {mode === "dark" ? "LIGHT" : "DARK"}
      </button>
    </div>
  );
}
