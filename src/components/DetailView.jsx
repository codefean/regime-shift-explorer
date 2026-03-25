// components/DetailView.jsx

import GlobeMap from "./GlobeMap";
import RelevantMarkets from "./RelevantMarkets";
import { SPEED_CONFIG } from "../data/shifts";
import { useLocations } from "../hooks/useLocations";


function SectionLabel({ children, theme }) {
  return (
    <div style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: 10,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: theme.metaLabel,
      marginBottom: 8,
      marginTop: 24,
    }}>
      {children}
    </div>
  );
}

function SignalRow({ signal, theme }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      padding: "8px 0",
      borderBottom: `1px solid ${theme.divider}`,
    }}>
      <span style={{
        color: theme.filterActiveText,
        fontFamily: "'DM Mono', monospace",
        fontSize: 12,
        marginTop: 1,
        flexShrink: 0,
      }}>›</span>
      <span style={{ fontSize: 13, color: theme.metaValue, lineHeight: 1.5 }}>
        {signal}
      </span>
    </div>
  );
}

function MetaRow({ label, value, theme }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "100px 1fr",
      gap: 12,
      padding: "7px 0",
      borderBottom: `1px solid ${theme.divider}`,
      alignItems: "start",
    }}>
      <span style={{
        fontSize: 10,
        fontFamily: "'DM Mono', monospace",
        letterSpacing: "0.06em",
        color: theme.metaLabel,
        textTransform: "uppercase",
        paddingTop: 2,
      }}>
        {label}
      </span>
      <span style={{ fontSize: 12, color: theme.metaValue, lineHeight: 1.5 }}>
        {value}
      </span>
    </div>
  );
}

export default function DetailView({ shift, theme, onBack }) {
  const speedCfg = SPEED_CONFIG[shift.speed] || {};
  const { locations } = useLocations();
  const shiftLocations = locations?.get(shift.name) ?? [];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "420px 1fr",
      height: "100vh",
      background: theme.bg,
      fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
      overflow: "hidden",
    }}>

      <div style={{
        height: "100vh",
        overflowY: "auto",
        borderRight: `1px solid ${theme.headerBorder}`,
        display: "flex",
        flexDirection: "column",
      }}>


        <div style={{
          padding: "20px 24px 16px",
          borderBottom: `1px solid ${theme.headerBorder}`,
          position: "sticky",
          top: 0,
          background: theme.bg,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
          <button
            onClick={onBack}
            style={{
              background: "transparent",
              border: `1px solid ${theme.filterBorder}`,
              borderRadius: 6,
              color: theme.textMuted,
              cursor: "pointer",
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              padding: "5px 10px",
              letterSpacing: "0.06em",
              flexShrink: 0,
              transition: "all 0.15s",
            }}
          >
            ← BACK
          </button>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: theme.titleColor,
          }}>
            Regime shift detail
          </span>
        </div>

        <div style={{ padding: "24px 24px 40px", flex: 1 }}>
          <div style={{ marginBottom: 16 }}>
            {shift.tipping && (
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: theme.filterActiveBg,
                border: `1px solid ${theme.filterActiveBorder}`,
                borderRadius: 4,
                padding: "3px 10px",
                marginBottom: 10,
              }}>
                <span style={{ color: theme.filterActiveText, fontSize: 10 }}>★</span>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: theme.filterActiveText,
                }}>
                  Planetary tipping point
                </span>
              </div>
            )}
            <h1 style={{
              fontSize: 24,
              fontWeight: 300,
              color: theme.subtitleColor,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              margin: 0,
            }}>
              {shift.name}
            </h1>
          </div>


          <div style={{ marginBottom: 20 }}>
            <span style={{
              fontSize: 11,
              padding: "3px 10px",
              borderRadius: 3,
              fontWeight: 500,
              background: speedCfg.bg,
              color: speedCfg.color,
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.04em",
            }}>
              {speedCfg.label}
            </span>
          </div>

          {/* Key metadata */}
          <SectionLabel theme={theme}>Overview</SectionLabel>
          <div style={{ borderTop: `1px solid ${theme.divider}` }}>
            <MetaRow label="Horizon" value={shift.horizon} theme={theme} />
            <MetaRow
              label="Detectability"
              value={`${shift.detectability}${shift.detectabilityNote ? ` — ${shift.detectabilityNote}` : ""}`}
              theme={theme}
            />
            <MetaRow
              label="Categories"
              value={shift.category.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(", ")}
              theme={theme}
            />
          </div>

          {/* Sectors */}
          <SectionLabel theme={theme}>Exposed sectors</SectionLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 4 }}>
            {shift.sectors.map((s) => (
              <span key={s} style={{
                fontSize: 11,
                padding: "4px 10px",
                borderRadius: 4,
                background: theme.assetBg,
                color: theme.metaValue,
                border: `1px solid ${theme.cardBorder}`,
              }}>
                {s}
              </span>
            ))}
          </div>

          {/* Financial signals */}
          <SectionLabel theme={theme}>Financial signals</SectionLabel>
          <div style={{ borderTop: `1px solid ${theme.divider}` }}>
            {shift.signals.map((sig) => (
              <SignalRow key={sig} signal={sig} theme={theme} />
            ))}
          </div>

          {/* Asset classes */}
          <SectionLabel theme={theme}>Asset class exposure</SectionLabel>
          <div style={{
            background: theme.assetBg,
            border: `1px solid ${theme.assetBorder}`,
            borderRadius: 8,
            padding: "12px 14px",
            fontSize: 12,
            color: theme.assetText,
            lineHeight: 1.7,
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.02em",
          }}>
            {shift.assetClasses}
          </div>

          {/* Map overlay */}
          <SectionLabel theme={theme}>Geographic data</SectionLabel>
          <div style={{
            background: theme.assetBg,
            border: `1px solid ${shiftLocations.length > 0 ? theme.filterActiveBorder : theme.cardBorder}`,
            borderRadius: 8,
            padding: "12px 14px",
            fontSize: 11,
            color: shiftLocations.length > 0 ? theme.filterActiveText : theme.metaLabel,
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.04em",
            lineHeight: 1.6,
          }}>
            {shiftLocations.length > 0 ? (
              <>
                <span style={{ color: theme.filterActiveText }}>{shiftLocations.length} documented {shiftLocations.length === 1 ? "location" : "locations"} mapped</span>
                <br />
                <span style={{ color: theme.metaLabel }}></span>
              </>
            ) : (
              <>
                <span style={{ color: theme.metaLabel }}>No locations in current dataset</span>
                <br />
                <span style={{ color: theme.metaLabel }}>Drop rsdb_clean_240824.csv into /public to load points</span>
              </>
            )}
          </div>

          {/* Relevant markets */}
          <RelevantMarkets shift={shift} theme={theme} />

        </div>
      </div>

      {/* ── RIGHT PANEL — GLOBE ─────────────────────────────────────────── */}
      <div style={{
        height: "100vh",
        background: "#000008",
        position: "relative",
      }}>
        <GlobeMap shift={shift} locations={shiftLocations} />
      </div>

    </div>
  );
}
