// components/RelevantMarkets.jsx
// Shows live stock prices and conceptual Polymarket predictions per regime shift.

import { useLivePrices } from "../hooks/useLivePrices";
import { MARKETS } from "../data/markets";

const EXPOSURE_CONFIG = {
  high:   { label: "High exposure",   color: "#7f1d1d", bg: "#fee2e2" },
  medium: { label: "Med exposure",    color: "#78350f", bg: "#fef3c7" },
  low:    { label: "Low exposure",    color: "#14532d", bg: "#dcfce7" },
};

// ─── STOCK CARD ──────────────────────────────────────────────────────────────

function StockCard({ stock, price, loading, theme }) {
  const exp = EXPOSURE_CONFIG[stock.exposure] || EXPOSURE_CONFIG.low;
  const isUp = price?.change >= 0;
  const hasPrice = price && price.current > 0;

  return (
    <div style={{
      background: theme.assetBg,
      border: `1px solid ${theme.cardBorder}`,
      borderRadius: 8,
      padding: "12px 14px",
      display: "flex",
      flexDirection: "column",
      gap: 8,
    }}>
      {/* Top row: ticker + exchange + exposure badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 13,
            fontWeight: 500,
            color: theme.filterActiveText,
            letterSpacing: "0.04em",
          }}>
            {stock.ticker.split(".")[0]}
          </span>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            color: theme.metaLabel,
            letterSpacing: "0.06em",
          }}>
            {stock.exchange}
          </span>
        </div>

        <span style={{
          fontSize: 9,
          padding: "2px 7px",
          borderRadius: 3,
          fontWeight: 500,
          background: exp.bg,
          color: exp.color,
          fontFamily: "'DM Mono', monospace",
          letterSpacing: "0.04em",
          whiteSpace: "nowrap",
        }}>
          {exp.label}
        </span>
      </div>

      {/* Company name */}
      <div style={{ fontSize: 12, fontWeight: 500, color: theme.text, lineHeight: 1.3 }}>
        {stock.name}
      </div>

      {/* Live price row */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 24,
      }}>
        {loading ? (
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: theme.metaLabel,
            letterSpacing: "0.06em",
          }}>
            Loading…
          </div>
        ) : hasPrice ? (
          <>
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 16,
              fontWeight: 500,
              color: theme.subtitleColor,
              letterSpacing: "-0.01em",
            }}>
              ${price.current.toFixed(2)}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                color: isUp ? "#16a34a" : "#dc2626",
                letterSpacing: "0.02em",
              }}>
                {isUp ? "▲" : "▼"} {Math.abs(price.change).toFixed(2)}
              </span>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                color: isUp ? "#16a34a" : "#dc2626",
              }}>
                ({isUp ? "+" : ""}{price.changePct?.toFixed(2)}%)
              </span>
            </div>
          </>
        ) : (
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            color: theme.metaLabel,
            letterSpacing: "0.04em",
          }}>
            {import.meta.env.VITE_FINNHUB_TOKEN ? "Price unavailable" : "Add VITE_FINNHUB_TOKEN to .env"}
          </div>
        )}
      </div>

      {/* Relevance note */}
      <div style={{
        fontSize: 11,
        color: theme.signalText,
        lineHeight: 1.5,
        borderTop: `1px solid ${theme.divider}`,
        paddingTop: 8,
      }}>
        {stock.relevance}
      </div>
    </div>
  );
}

// ─── POLYMARKET CARD ─────────────────────────────────────────────────────────

function PolymarketCard({ market, theme }) {
  // Probability bar colour
  const pct = market.probability ?? 0;
  const barColor = pct > 60 ? "#dc2626" : pct > 35 ? "#d97706" : "#16a34a";

  return (
    <div style={{
      background: theme.assetBg,
      border: `1px solid ${theme.cardBorder}`,
      borderRadius: 8,
      padding: "12px 14px",
      display: "flex",
      flexDirection: "column",
      gap: 8,
    }}>
      {/* Header label */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: theme.metaLabel,
        }}>
          Prediction market
        </span>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          color: theme.metaLabel,
          letterSpacing: "0.04em",
        }}>
          CONCEPT
        </span>
      </div>

      {/* Question */}
      <div style={{
        fontSize: 12,
        color: theme.text,
        lineHeight: 1.5,
        fontWeight: 500,
      }}>
        {market.title}
      </div>

      {/* Probability bar */}
      <div>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 4,
        }}>
          <span style={{ fontSize: 10, color: theme.metaLabel, fontFamily: "'DM Mono', monospace" }}>
            Indicative probability
          </span>
          <span style={{
            fontSize: 12,
            fontWeight: 500,
            color: barColor,
            fontFamily: "'DM Mono', monospace",
          }}>
            {pct}%
          </span>
        </div>
        <div style={{
          height: 4,
          borderRadius: 2,
          background: theme.cardBorder,
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${pct}%`,
            background: barColor,
            borderRadius: 2,
            transition: "width 0.6s ease",
          }} />
        </div>
      </div>

      {/* Relevance */}
      <div style={{
        fontSize: 11,
        color: theme.signalText,
        lineHeight: 1.5,
        borderTop: `1px solid ${theme.divider}`,
        paddingTop: 8,
      }}>
        {market.relevance}
      </div>

      {/* Link or placeholder */}
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 9,
        color: market.url ? theme.filterActiveText : theme.metaLabel,
        letterSpacing: "0.06em",
      }}>
        {market.url
          ? <a href={market.url} target="_blank" rel="noreferrer" style={{ color: "inherit" }}>OPEN ON POLYMARKET ↗</a>
          : "LIVE LINK NOT YET ASSIGNED"
        }
      </div>
    </div>
  );
}

// ─── SECTION LABEL ───────────────────────────────────────────────────────────

function SectionLabel({ children, theme }) {
  return (
    <div style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: 10,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: theme.metaLabel,
      marginBottom: 10,
      marginTop: 28,
    }}>
      {children}
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function RelevantMarkets({ shift, theme }) {
  const marketData = MARKETS[shift.name];

  const { prices, loading } = useLivePrices(marketData?.stocks ?? []);

  if (!marketData) {
    return (
      <div style={{ marginTop: 28 }}>
        <SectionLabel theme={theme}>Relevant Markets</SectionLabel>
        <div style={{
          background: theme.assetBg,
          border: `1px dashed ${theme.cardBorder}`,
          borderRadius: 8,
          padding: "14px",
          fontSize: 11,
          color: theme.metaLabel,
          fontFamily: "'DM Mono', monospace",
          letterSpacing: "0.04em",
        }}>
          Market data not yet curated for this regime shift.
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ── Stocks ── */}
      {marketData.stocks?.length > 0 && (
        <>
          <SectionLabel theme={theme}>
            Relevant Markets — Equities
          </SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {marketData.stocks.map((stock) => (
              <StockCard
                key={stock.ticker}
                stock={stock}
                price={prices[stock.ticker]}
                loading={loading}
                theme={theme}
              />
            ))}
          </div>
        </>
      )}

      {/* ── Prediction markets ── */}
      {marketData.polymarket?.length > 0 && (
        <>
          <SectionLabel theme={theme}>
            Relevant Markets — Prediction Markets
          </SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {marketData.polymarket.map((market, i) => (
              <PolymarketCard
                key={i}
                market={market}
                theme={theme}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
