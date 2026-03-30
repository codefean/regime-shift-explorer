// RegimeShiftExplorer.jsx - Main component with tabs
// Loads both financial and ecological regime shift data

import { useState } from "react";
import { useTheme } from "./hooks/useTheme";
import { useShiftData } from "./hooks/useShiftData";  // Ecological CSV data
import { useShifts } from "./hooks/useShifts";        // Financial market data
import GlobeView from "./components/GlobeView";
import GridView from "./components/GridView";

export default function RegimeShiftExplorer() {
  const { theme, mode, toggle } = useTheme();
  
  // Load both datasets
  const { shifts: ecologicalShifts, loading: ecoLoading, error: ecoError } = useShiftData();
  const { shifts: financialShifts, source, error: finError, loading: finLoading } = useShifts();
  
  const [activeTab, setActiveTab] = useState("globe"); // "globe" or "grid"

  // Show loading state (wait for the active tab's data)
  const isLoading = activeTab === "globe" ? ecoLoading : finLoading;
  
  if (isLoading) {
    return (
      <div style={{
        fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
        minHeight: "100vh",
        background: theme.bg,
        color: theme.text,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16
      }}>
        <div style={{ fontSize: 48 }}>
          {activeTab === "globe" ? "🌍" : "💼"}
        </div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 14,
          color: theme.metaLabel
        }}>
          {activeTab === "globe" 
            ? "Loading ecological data..." 
            : "Loading financial data..."}
        </div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: theme.textDim
        }}>
          {activeTab === "globe" ? "Parsing CSV data" : "Loading market analysis"}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
      minHeight: "100vh",
      background: theme.bg,
      color: theme.text,
      transition: "background 0.2s, color 0.2s",
    }}>
      {/* Header with Tabs */}
      <div style={{
        borderBottom: `1px solid ${theme.headerBorder}`,
        background: theme.bg,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 32px",
        }}>
          {/* Title */}
          <div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 24,
              fontWeight: 600,
              color: theme.titleColor,
              marginBottom: 2,
            }}>
              Regime Shift Database
            </div>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.08em",
              color: theme.countColor,
              textTransform: "uppercase",
            }}>
              {activeTab === "globe" 
                ? `${ecologicalShifts.length} documented occurrences`
                : `${financialShifts.length} regime shift categories`
              }
            </div>
          </div>

          {/* Tab Switcher */}
          <div style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}>
            <button
              onClick={() => setActiveTab("globe")}
              style={{
                padding: "8px 16px",
                background: activeTab === "globe" ? theme.filterActiveBg : "transparent",
                border: `1px solid ${activeTab === "globe" ? theme.filterActiveBorder : theme.filterBorder}`,
                borderRadius: 6,
                color: activeTab === "globe" ? theme.filterActiveText : theme.filterText,
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.06em",
                cursor: "pointer",
                transition: "all 0.2s",
                textTransform: "uppercase",
              }}
            >
              Global View
            </button>

            <button
              onClick={() => setActiveTab("grid")}
              style={{
                padding: "8px 16px",
                background: activeTab === "grid" ? theme.filterActiveBg : "transparent",
                border: `1px solid ${activeTab === "grid" ? theme.filterActiveBorder : theme.filterBorder}`,
                borderRadius: 6,
                color: activeTab === "grid" ? theme.filterActiveText : theme.filterText,
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.06em",
                cursor: "pointer",
                transition: "all 0.2s",
                textTransform: "uppercase",
              }}
            >
              CARD VIEW
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggle}
              style={{
                padding: "8px 12px",
                background: theme.toggleBg,
                border: `1px solid ${theme.toggleBorder}`,
                borderRadius: 6,
                color: theme.toggleText,
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                cursor: "pointer",
                transition: "all 0.2s",
                marginLeft: 8,
              }}
            >
              {mode === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {activeTab === "globe" && ecoError && (
        <div style={{
          margin: "16px 32px",
          background: "#fee2e2",
          border: "1px solid #fca5a5",
          borderRadius: 8,
          padding: "12px 16px",
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: "#7f1d1d",
          letterSpacing: "0.06em",
        }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            ⚠ Failed to load ecological data
          </div>
          <div style={{ fontSize: 10, opacity: 0.8 }}>
            {ecoError}
          </div>
          <div style={{ fontSize: 10, marginTop: 8, opacity: 0.7 }}>
            Please ensure rsdb_clean_240824.csv is in your /public folder
          </div>
        </div>
      )}

      {activeTab === "grid" && finError && (
        <div style={{
          margin: "16px 32px",
          background: "#fee2e2",
          border: "1px solid #fca5a5",
          borderRadius: 8,
          padding: "12px 16px",
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: "#7f1d1d",
          letterSpacing: "0.06em",
        }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            ⚠ Failed to load financial data
          </div>
          <div style={{ fontSize: 10, opacity: 0.8 }}>
            {finError}
          </div>
        </div>
      )}

      {/* Content - Pass correct data to each view */}
      {activeTab === "globe" ? (
        <GlobeView theme={theme} shifts={ecologicalShifts} />
      ) : (
        <GridView theme={theme} shifts={financialShifts} source={source} error={finError} />
      )}
    </div>
  );
}
