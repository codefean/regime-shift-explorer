// components/ShiftCard.jsx
import { SPEED_CONFIG } from "../data/shifts";

function SpeedBadge({ speed }) {
  const cfg = SPEED_CONFIG[speed] || { label: speed, color: "#374151", bg: "#f3f4f6" };
  return (
    <span style={{
      fontSize: 10,
      padding: "2px 8px",
      borderRadius: 3,
      fontWeight: 500,
      background: cfg.bg,
      color: cfg.color,
      fontFamily: "'DM Mono', monospace",
      letterSpacing: "0.04em",
    }}>
      {cfg.label}
    </span>
  );
}

export default function ShiftCard({ shift, theme, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: theme.cardBg,
        border: `1px solid ${shift.tipping ? theme.tippingCardBorder : theme.cardBorder}`,
        borderRadius: 10,
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        transition: "border-color 0.15s, transform 0.1s",
        cursor: "pointer",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = theme.filterActiveBorder;
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = shift.tipping ? theme.tippingCardBorder : theme.cardBorder;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >

      {/* Title row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: theme.text, lineHeight: 1.4, flex: 1 }}>
          {shift.name}
        </span>
{shift.tipping && (
  <span style={{
    fontSize: 9,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    background: theme.filterActiveBg,
    color: theme.filterActiveText,
    border: `1px solid ${theme.filterActiveBorder}`,
    borderRadius: 4,
    padding: "2px 7px",
    whiteSpace: "nowrap",
    fontFamily: "'DM Mono', monospace",
    flexShrink: 0,
  }}>
    ★ tipping point
  </span>
)}
      </div>

      {/* Speed + sector badges */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
        <SpeedBadge speed={shift.speed} />
        {shift.sectors.slice(0, 3).map((s) => (
          <span key={s} style={{
            fontSize: 10,
            padding: "2px 8px",
            borderRadius: 3,
            background: theme.assetBg,
            color: theme.textMuted,
            border: `1px solid ${theme.cardBorder}`,
          }}>
            {s}
          </span>
        ))}
      </div>

      {/* Divider */}
      <div style={{ borderTop: `1px solid ${theme.divider}`, margin: "10px 0" }} />

      {/* Meta grid */}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "3px 12px", marginBottom: 10 }}>
        <span style={{ fontSize: 10, color: theme.metaLabel, fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", paddingTop: 1, whiteSpace: "nowrap" }}>
          HORIZON
        </span>
        <span style={{ fontSize: 11, color: theme.metaValue, lineHeight: 1.4 }}>
          {shift.horizon}
        </span>
        <span style={{ fontSize: 10, color: theme.metaLabel, fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", paddingTop: 1, whiteSpace: "nowrap" }}>
          DETECT.
        </span>
        <span style={{ fontSize: 11, color: theme.metaValue, lineHeight: 1.4 }}>
          {shift.detectability}
          {shift.detectabilityNote && (
            <span style={{ color: theme.signalArrow }}> — {shift.detectabilityNote}</span>
          )}
        </span>
      </div>

      {/* Signals */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 10 }}>
        {shift.signals.slice(0, 3).map((sig) => (
          <div key={sig} style={{ fontSize: 11, color: theme.signalText, lineHeight: 1.5, paddingLeft: 12, position: "relative" }}>
            <span style={{ position: "absolute", left: 0, color: theme.signalArrow }}>›</span>
            {sig}
          </div>
        ))}
      </div>

      {/* Asset classes */}
      <div style={{
        background: theme.assetBg,
        border: `1px solid ${theme.assetBorder}`,
        borderRadius: 6,
        padding: "7px 10px",
        fontSize: 10,
        color: theme.assetText,
        lineHeight: 1.5,
        fontFamily: "'DM Mono', monospace",
        letterSpacing: "0.02em",
      }}>
        {shift.assetClasses}
      </div>
    </div>
  );
}
