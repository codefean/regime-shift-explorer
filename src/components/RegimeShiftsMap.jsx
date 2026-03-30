// components/RegimeShiftsMap.jsx
// Full-page Mapbox globe view of ALL documented regime shift locations,
// color-coded by type, with an expandable scrollable legend/key.
//
// Usage:  <RegimeShiftsMap onBack={() => setView("explorer")} />
// Reads the same rsdb_clean_240824.csv via the useLocations hook.

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useLocations } from "../hooks/useLocations";

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// ── Mapbox layer IDs ────────────────────────────────────────────────
const SRC       = "all-regime-pts";
const LYR_HALO  = "all-regime-halo";
const LYR_DOT   = "all-regime-dot";
const LYR_HIT   = "all-regime-hit";

// ── Color palette — one per regime-shift type ───────────────────────
// Keys must exactly match the normalised names from parseLocationsCSV
// (which already maps CSV values → shifts.js display names).
const TYPE_COLORS = {
  "Dryland degradation":                "#e8a838",
  "Unclassified":                       "#667788",
  "Freshwater eutrophication":          "#22d3ee",
  "Coral transitions":                  "#f472b6",
  "Marine food webs":                   "#60a5fa",
  "Hypoxia":                            "#ef4444",
  "Submerged to floating plants":       "#a3e635",
  "River channel change":               "#c084fc",
  "Fisheries collapse":                 "#fb923c",
  "Soil salinization":                  "#fbbf24",
  "Bivalves collapse":                  "#818cf8",
  "Peatland transitions":               "#6ee7b7",
  "Arctic sea ice loss":                "#38bdf8",
  "Bush encroachment":                  "#d97706",
  "Marine eutrophication":              "#f87171",
  "Kelp transitions":                   "#34d399",
  "Seagrass transitions":               "#2dd4bf",
  "Mangroves transitions":              "#a78bfa",
  "Salt marshes to tidal flats":        "#94a3b8",
  "Forest to savanna":                  "#facc15",
  "Coniferous to deciduous forest":     "#86efac",
  "Thermokarst lakes":                  "#67e8f9",
  "Steppe to tundra":                   "#d4d4d8",
  "Thermohaline circulation (AMOC)":    "#93c5fd",
  "Greenland ice sheet collapse":       "#7dd3fc",
  "Primary productivity \u2014 Arctic Ocean": "#c4b5fd",
  "West Antarctic ice sheet collapse":  "#bae6fd",
  "Indian summer monsoon":              "#fdba74",
  "Common pool resource harvesting":    "#fca5a5",
  "Sprawling vs compact cities":        "#d1d5db",
  "Tundra to boreal forest":            "#4ade80",
};
const FALLBACK_COLOR = "#5ab87e";

// ── Helpers ─────────────────────────────────────────────────────────

/** Build a flat GeoJSON FeatureCollection from the useLocations() Map */
function buildGeoJSON(locationsMap, hiddenTypes) {
  const features = [];
  for (const [type, pts] of locationsMap.entries()) {
    if (hiddenTypes.has(type)) continue;
    const color = TYPE_COLORS[type] || FALLBACK_COLOR;
    for (const p of pts) {
      // Skip 0,0 junk rows
      if (p.lng === 0 && p.lat === 0) continue;
      features.push({
        type: "Feature",
        geometry: { type: "Point", coordinates: [p.lng, p.lat] },
        properties: { name: p.name, id: p.id, shiftType: type, color },
      });
    }
  }
  return { type: "FeatureCollection", features };
}

function buildColorMatch() {

  const expr = ["match", ["get", "shiftType"]];
  for (const [type, color] of Object.entries(TYPE_COLORS)) {
    expr.push(type, color);
  }
  expr.push(FALLBACK_COLOR);
  return expr;
}


function buildTypeSummary(locationsMap) {
  const list = [];
  for (const [type, pts] of locationsMap.entries()) {
    const count = pts.filter(p => !(p.lng === 0 && p.lat === 0)).length;
    if (count === 0) continue;
    list.push({ type, count, color: TYPE_COLORS[type] || FALLBACK_COLOR });
  }
  list.sort((a, b) => b.count - a.count);
  return list;
}


export default function RegimeShiftsMap({ onBack }) {
  const containerRef  = useRef(null);
  const mapRef        = useRef(null);
  const spinEnabled   = useRef(false);
  const isInteracting = useRef(false);

  const { locations, loading } = useLocations();

  const [tooltip, setTooltip]       = useState(null);
  const [legendOpen, setLegendOpen] = useState(true);
  const [hiddenTypes, setHiddenTypes] = useState(new Set(["Unclassified"]));
  const [mapReady, setMapReady]     = useState(false);


  const typeSummary = useMemo(
    () => (locations ? buildTypeSummary(locations) : []),
    [locations],
  );
  const totalPoints = useMemo(
    () => typeSummary.reduce((s, t) => s + t.count, 0),
    [typeSummary],
  );
  const visibleCount = useMemo(
    () => typeSummary.filter(t => !hiddenTypes.has(t.type)).reduce((s, t) => s + t.count, 0),
    [typeSummary, hiddenTypes],
  );

  // ── Init map (once) ───────────────────────────────────────────────
  useEffect(() => {
    if (!TOKEN || !containerRef.current) return;
    spinEnabled.current = true;
    isInteracting.current = false;

    mapboxgl.accessToken = TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      projection: "globe",
      zoom: 1.8,
      center: [0, 20],
      attributionControl: false,
    });
    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-left");


    map.on("style.load", () => {
      map.setFog({
        color:            "rgb(0, 0, 0)",
        "high-color":     "rgb(0, 4, 20)",
        "horizon-blend":  0.08,
        "space-color":    "rgb(0, 0, 8)",
        "star-intensity": 0.3,
      });
    });


    map.on("mousedown",  () => { isInteracting.current = true; });
    map.on("touchstart", () => { isInteracting.current = true; });
    map.on("dragstart",  () => { isInteracting.current = true; });
    map.on("zoomstart",  () => { isInteracting.current = true; });

    map.on("load", () => {

      map.on("mouseenter", LYR_HIT, e => {
        map.getCanvas().style.cursor = "pointer";
        const { x, y } = e.point;
        const props = e.features[0]?.properties || {};
        setTooltip({
          x, y,
          name: props.name || "Case study",
          type: props.shiftType || "",
          color: props.color || FALLBACK_COLOR,
        });
      });
      map.on("mouseleave", LYR_HIT, () => {
        map.getCanvas().style.cursor = "";
        setTooltip(null);
      });
      map.on("mousemove", LYR_HIT, e => {
        const { x, y } = e.point;
        const props = e.features[0]?.properties || {};
        setTooltip({
          x, y,
          name: props.name || "Case study",
          type: props.shiftType || "",
          color: props.color || FALLBACK_COLOR,
        });
      });


      let lastTime = null;
      function spin(timestamp) {
        if (!spinEnabled.current) return;
        if (lastTime !== null) {
          const elapsed = timestamp - lastTime;
          if (!isInteracting.current && map.getZoom() < 4 && map.isStyleLoaded()) {
            const center = map.getCenter();
            center.lng -= (elapsed / 1000) * 8;
            map.setCenter(center);
          }
        }
        lastTime = timestamp;
        requestAnimationFrame(spin);
      }
      requestAnimationFrame(spin);

      setMapReady(true);
    });

    return () => {
      spinEnabled.current = false;
      setTooltip(null);
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []);


  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !locations) return;

    const geojson = buildGeoJSON(locations, hiddenTypes);
    const colorExpr = buildColorMatch();


    [LYR_HALO, LYR_DOT, LYR_HIT].forEach(id => {
      if (map.getLayer(id)) map.removeLayer(id);
    });
    if (map.getSource(SRC)) map.removeSource(SRC);

    if (geojson.features.length === 0) return;

    map.addSource(SRC, { type: "geojson", data: geojson });


    map.addLayer({
      id: LYR_HALO,
      type: "circle",
      source: SRC,
      paint: {
        "circle-radius": [
          "interpolate", ["linear"], ["zoom"],
          1, 6,
          4, 10,
          8, 16,
        ],
        "circle-color": colorExpr,
        "circle-opacity": 0.18,
        "circle-blur": 1,
      },
    });


    map.addLayer({
      id: LYR_DOT,
      type: "circle",
      source: SRC,
      paint: {
        "circle-radius": [
          "interpolate", ["linear"], ["zoom"],
          1, 2.5,
          4, 4,
          8, 7,
        ],
        "circle-color": colorExpr,
        "circle-opacity": 0.88,
        "circle-stroke-width": 0.6,
        "circle-stroke-color": "#000000",
        "circle-stroke-opacity": 0.4,
      },
    });

    // Invisible hit area for hover
    map.addLayer({
      id: LYR_HIT,
      type: "circle",
      source: SRC,
      paint: {
        "circle-radius": [
          "interpolate", ["linear"], ["zoom"],
          1, 8,
          4, 14,
          8, 20,
        ],
        "circle-opacity": 0,
        "circle-stroke-width": 0,
      },
    });
  }, [locations, hiddenTypes, mapReady]);


  const toggleType = useCallback((type) => {
    setHiddenTypes(prev => {
      const next = new Set(prev);
      next.has(type) ? next.delete(type) : next.add(type);
      return next;
    });
  }, []);
  const showAll = useCallback(() => setHiddenTypes(new Set()), []);
  const hideAll = useCallback(
    () => setHiddenTypes(new Set(typeSummary.map(t => t.type))),
    [typeSummary],
  );


  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

 
  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "100vh",
      background: "#000008",
      fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
      overflow: "hidden",
    }}>


      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      {!TOKEN && <NoTokenOverlay />}


      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        zIndex: 10,
        padding: isMobile ? "14px 16px" : "20px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(to bottom, rgba(0,0,8,0.85) 0%, rgba(0,0,8,0) 100%)",
        pointerEvents: "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, pointerEvents: "auto" }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                background: "rgba(8,12,20,0.7)",
                border: "1px solid rgba(90,184,126,0.2)",
                borderRadius: 6,
                color: "rgba(200,220,210,0.7)",
                cursor: "pointer",
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                padding: "5px 10px",
                letterSpacing: "0.06em",
                backdropFilter: "blur(6px)",
              }}
            >
              ← BACK
            </button>
          )}
          <div>
            <div style={{
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(90,184,126,0.5)",
              fontFamily: "'DM Mono', monospace",
              marginBottom: 1,
            }}>
              Environmental intelligence
            </div>
            <div style={{
              fontSize: isMobile ? 16 : 20,
              fontWeight: 300,
              color: "rgba(220,235,225,0.9)",
              letterSpacing: "-0.02em",
            }}>
              Regime Shifts Map
            </div>
          </div>
        </div>

        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: "rgba(90,184,126,0.35)",
          letterSpacing: "0.08em",
          textAlign: "right",
          pointerEvents: "none",
        }}>
          {loading ? "LOADING CSV\u2026" : (
            <>
              RSDB 2024<br />
              {totalPoints.toLocaleString()} DOCUMENTED CASES
            </>
          )}
        </div>
      </div>


      <div style={{
        position: "absolute",
        bottom: 16,
        right: 60,
        zIndex: 10,
        fontFamily: "'DM Mono', monospace",
        fontSize: 10,
        color: "rgba(90,184,126,0.35)",
        letterSpacing: "0.06em",
        pointerEvents: "none",
        textAlign: "right",
      }}>
        {visibleCount.toLocaleString()} locations displayed
      </div>


      {tooltip && (
        <div style={{
          position: "absolute",
          left: tooltip.x + 14,
          top: tooltip.y - 10,
          background: "rgba(8,12,14,0.92)",
          border: `1px solid ${tooltip.color}55`,
          borderRadius: 6,
          padding: "6px 12px",
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: "rgba(200,220,210,0.9)",
          pointerEvents: "none",
          maxWidth: 280,
          lineHeight: 1.4,
          zIndex: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: tooltip.color, flexShrink: 0,
            }} />
            <span style={{ fontSize: 10, color: tooltip.color, letterSpacing: "0.04em" }}>
              {tooltip.type}
            </span>
          </div>
          <div style={{ color: "rgba(200,220,210,0.75)", fontSize: 11 }}>
            {tooltip.name}
          </div>
        </div>
      )}


      <button
        onClick={() => setLegendOpen(!legendOpen)}
        style={{
          position: "absolute",
          bottom: isMobile ? 14 : 20,
          left: isMobile ? 14 : 20,
          zIndex: 10,
          background: "rgba(8,12,20,0.8)",
          border: "1px solid rgba(90,184,126,0.2)",
          borderRadius: 8,
          color: "rgba(200,220,210,0.7)",
          cursor: "pointer",
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.06em",
          padding: "8px 14px",
          backdropFilter: "blur(8px)",
          transition: "all 0.2s",
        }}
      >
        {legendOpen ? "\u25be HIDE" : "\u25b8 SHOW"} LEGEND ({typeSummary.length - hiddenTypes.size}/{typeSummary.length})
      </button>


      {legendOpen && (
        <div style={{
          position: "absolute",
          bottom: isMobile ? 54 : 64,
          left: isMobile ? 14 : 20,
          zIndex: 10,
          width: isMobile ? "calc(100% - 28px)" : 310,
          maxHeight: isMobile ? "45vh" : "calc(100vh - 180px)",
          background: "rgba(8,12,20,0.88)",
          border: "1px solid rgba(90,184,126,0.12)",
          borderRadius: 10,
          backdropFilter: "blur(12px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>

          {/* Legend header */}
          <div style={{
            padding: "12px 14px 10px",
            borderBottom: "1px solid rgba(90,184,126,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}>
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(90,184,126,0.45)",
            }}>
              Regime shift types
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <MiniButton onClick={showAll}>ALL</MiniButton>
              <MiniButton onClick={hideAll}>NONE</MiniButton>
            </div>
          </div>


          <div style={{
            overflowY: "auto",
            flex: 1,
            padding: "4px 0",
          }}>
            {typeSummary.map(({ type, count, color }) => {
              const hidden = hiddenTypes.has(type);
              return (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    padding: "7px 14px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    opacity: hidden ? 0.28 : 1,
                    transition: "opacity 0.15s",
                    textAlign: "left",
                  }}
                >
                  <span style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: hidden ? "transparent" : color,
                    border: `2px solid ${color}`,
                    flexShrink: 0,
                    transition: "all 0.15s",
                  }} />
                  <span style={{
                    fontSize: 11,
                    color: "rgba(200,220,210,0.85)",
                    flex: 1,
                    lineHeight: 1.3,
                  }}>
                    {type}
                  </span>
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10,
                    color: "rgba(90,184,126,0.35)",
                    flexShrink: 0,
                    minWidth: 32,
                    textAlign: "right",
                  }}>
                    {count.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}




function MiniButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "rgba(90,184,126,0.06)",
        border: "1px solid rgba(90,184,126,0.12)",
        borderRadius: 4,
        color: "rgba(90,184,126,0.5)",
        cursor: "pointer",
        fontFamily: "'DM Mono', monospace",
        fontSize: 9,
        letterSpacing: "0.08em",
        padding: "3px 8px",
      }}
    >
      {children}
    </button>
  );
}

function NoTokenOverlay() {
  return (
    <div style={{
      position: "absolute", inset: 0, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", background: "#000008",
      color: "#3d5248", fontFamily: "'DM Mono', monospace", fontSize: 12,
      textAlign: "center", padding: 32, gap: 12, zIndex: 10,
    }}>
      <div style={{ fontSize: 28 }}>🌐</div>
      <div>
        Add <span style={{ color: "#5ab87e" }}>VITE_MAPBOX_TOKEN</span> to .env
        <br />to enable the interactive globe
      </div>
    </div>
  );
}
