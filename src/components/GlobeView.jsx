// components/GlobeView.jsx
// Interactive 3D globe visualization of regime shifts using Mapbox GL

import { useEffect, useRef, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// Color scheme for regime shift types
const TYPE_COLORS = {
  // Original types
  "Hypoxia": "#ff6b6b",
  "Marine eutrophication": "#4ecdc4",
  "Freshwater eutrophication": "#45b7d1",
  "Coral transitions": "#ff8c42",
  "Fisheries collapse": "#f25c78",
  "Forest to savanna": "#95e1d3",
  "Kelp transitions": "#38ada9", // Normalized
  "Kelps transitions": "#38ada9", // Legacy support
  "Seagrass transitions": "#26de81",
  "Mangrove transitions": "#20bf6b", // Normalized
  "Mangroves transitions": "#20bf6b", // Legacy support
  "Salt marshes to tidal flats": "#8395a7",
  "Marine foodwebs": "#0fb9b1",
  "Arctic sea-ice loss": "#a8e6cf",
  "Bivalves collapse": "#f38181",
  "Bush encroachment": "#ffd89b",
  "Coniferous to deciduous forest": "#19b598",
  "Dryland degradation": "#e55039",
  "River channel change": "#4a69bd",
  "Soil salinization": "#b8e994",
  "Tundra to forest": "#78e08f",
  "Steppe to tundra": "#60a3bc",
  "Peatland transitions": "#786fa6",
  "Submerged to floating plants": "#f8b500",
  "Thermokarst lakes": "#3c6382",
  "Primary production arctic ocean": "#82ccdd",
  "Arctic benthos borealisation": "#b8e0d2",
  "Thermohaline circulation": "#1e3799",
  "Monsoon": "#596275", // Normalized
  "Moonson": "#596275", // Legacy support
  "West antarctic ice sheet collapse": "#d6eaf8",
  "Greenland ice sheet collapse": "#aed6f1",
  "Common pool resource harvesting": "#fa8231",
  "Urban sprawl": "#95a5a6", // Normalized
  "Sprawling vs compact city": "#95a5a6", // Legacy support
  
  // New types from regime_shift_type_other field
  "Forest die-offs": "#8b4513",
  "Freshwater salinization": "#5dade2",
  "Community shift": "#e59866",
  "Population shift": "#f39c12",
  "Fire regime": "#e74c3c",
  "Primary production": "#27ae60",
  "Morphological nearshore change": "#16a085",
  "Lake water level drop": "#3498db",
  "Insect outbreak": "#9b59b6",
  "Pollination collapse": "#f1c40f",
  "Turbid state": "#34495e",
  "Floodplain vegetation change": "#1abc9c",
  "Savanna to cropland": "#d4ac0d",
  "Savanna to rangeland": "#ca6f1e",
  "East Antarctic ice sheet collapse": "#85c1e9",
  "Species ecology shift": "#af7ac5",
  
  // Fallback
  "Unclassified": "#636e72"
};

export default function GlobeView({ theme, shifts = [] }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef(new Map());
  const isInteracting = useRef(false);
  const spinEnabled = useRef(false);
  
  const [mapReady, setMapReady] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [hoveredShift, setHoveredShift] = useState(null);
  const [activeType, setActiveType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter shifts based on type and search query
  const filteredShifts = useMemo(() => {
    return shifts.filter(shift => {
      const typeMatch = activeType === "all" || shift.type === activeType;
      const searchMatch = !searchQuery || 
        shift.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shift.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shift.location.toLowerCase().includes(searchQuery.toLowerCase());
      return typeMatch && searchMatch;
    });
  }, [shifts, activeType, searchQuery]);

  // Calculate type counts for filter panel
  const typeCounts = useMemo(() => {
    const counts = {};
    shifts.forEach(shift => {
      counts[shift.type] = (counts[shift.type] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [shifts]);

  // Initialize Mapbox map
  useEffect(() => {
    if (!TOKEN) {
      console.warn("Mapbox token not found. Set VITE_MAPBOX_TOKEN in your .env file");
      return;
    }
    
    if (!containerRef.current) return;
    if (mapRef.current) return; // Already initialized

    console.log("Initializing Mapbox globe...");
    
    spinEnabled.current = true;
    isInteracting.current = false;
    mapboxgl.accessToken = TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      projection: "globe",
      zoom: 1.5,
      center: [0, 20],
      attributionControl: false,
    });

    mapRef.current = map;

    // Add controls
    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }), 
      "bottom-right"
    );
    map.addControl(
      new mapboxgl.AttributionControl({ compact: true }), 
      "bottom-left"
    );

    // Configure globe atmosphere
    map.on("style.load", () => {
      map.setFog({
        color: "rgb(0, 0, 0)",
        "high-color": "rgb(0, 4, 20)",
        "horizon-blend": 0.08,
        "space-color": "rgb(0, 0, 8)",
        "star-intensity": 0.3,
      });
      
      setMapReady(true);
      console.log("✓ Map ready");
    });

    // Track user interaction to pause auto-spin
    map.on("mousedown", () => { isInteracting.current = true; });
    map.on("touchstart", () => { isInteracting.current = true; });
    map.on("dragstart", () => { isInteracting.current = true; });
    map.on("zoomstart", () => { isInteracting.current = true; });

    // Auto-spin the globe
    map.on("load", () => {
      let lastTime = null;
      
      function spin(timestamp) {
        if (!spinEnabled.current) return;
        
        if (lastTime !== null) {
          const elapsed = timestamp - lastTime;
          if (!isInteracting.current && map.getZoom() < 4 && map.isStyleLoaded()) {
            const center = map.getCenter();
            center.lng -= (elapsed / 1000) * 15; // Rotate speed
            map.setCenter(center);
          }
        }
        
        lastTime = timestamp;
        requestAnimationFrame(spin);
      }
      
      requestAnimationFrame(spin);
    });

    // Cleanup
    return () => {
      console.log("Cleaning up map...");
      spinEnabled.current = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current.clear();
      setMapReady(false);
    };
  }, []); // Only run once

  // Update map points when data changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    console.log(`Updating map with ${filteredShifts.length} shifts`);
    updateMapPoints(map, filteredShifts);
    
    // Cleanup markers that are no longer needed
    return () => {
      const currentIds = new Set(filteredShifts.map(s => s.id));
      markersRef.current.forEach((marker, id) => {
        if (!currentIds.has(id)) {
          marker.remove();
          markersRef.current.delete(id);
        }
      });
    };
  }, [filteredShifts, mapReady]);

  function updateMapPoints(map, data) {
    // Remove existing layers and source
    ["regime-points-halo", "regime-points-dot", "regime-points-hit"].forEach(id => {
      if (map.getLayer(id)) map.removeLayer(id);
    });
    if (map.getSource("regime-points")) map.removeSource("regime-points");

    if (!data.length) {
      console.log("No data to display");
      return;
    }

    // Create GeoJSON from shift data
    const geojson = {
      type: "FeatureCollection",
      features: data.map(shift => ({
        type: "Feature",
        geometry: { 
          type: "Point", 
          coordinates: [shift.lng, shift.lat] 
        },
        properties: {
          id: shift.id,
          name: shift.name,
          type: shift.type,
          color: TYPE_COLORS[shift.type] || TYPE_COLORS["Unclassified"]
        }
      }))
    };

    map.addSource("regime-points", { 
      type: "geojson", 
      data: geojson 
    });

    // Add glow/halo effect
    map.addLayer({
      id: "regime-points-halo",
      type: "circle",
      source: "regime-points",
      paint: {
        "circle-radius": 8,
        "circle-color": ["get", "color"],
        "circle-opacity": 0.15,
        "circle-blur": 1,
      }
    });

    // Add main dot
    map.addLayer({
      id: "regime-points-dot",
      type: "circle",
      source: "regime-points",
      paint: {
        "circle-radius": 3.5,
        "circle-color": ["get", "color"],
        "circle-opacity": 0.9,
        "circle-stroke-width": 0.5,
        "circle-stroke-color": "#ffffff",
        "circle-stroke-opacity": 0.3,
      }
    });

    // Add invisible hit area for better hover/click detection
    map.addLayer({
      id: "regime-points-hit",
      type: "circle",
      source: "regime-points",
      paint: {
        "circle-radius": 12,
        "circle-opacity": 0,
      }
    });

    // Mouse interactions
    map.on("mouseenter", "regime-points-hit", (e) => {
      map.getCanvas().style.cursor = "pointer";
      const feature = e.features[0];
      const shift = data.find(s => s.id === feature.properties.id);
      if (shift) {
        setHoveredShift({ shift, x: e.point.x, y: e.point.y });
      }
    });

    map.on("mouseleave", "regime-points-hit", () => {
      map.getCanvas().style.cursor = "";
      setHoveredShift(null);
    });

    map.on("mousemove", "regime-points-hit", (e) => {
      const feature = e.features[0];
      const shift = data.find(s => s.id === feature.properties.id);
      if (shift) {
        setHoveredShift({ shift, x: e.point.x, y: e.point.y });
      }
    });

    map.on("click", "regime-points-hit", (e) => {
      const feature = e.features[0];
      const shift = data.find(s => s.id === feature.properties.id);
      if (shift) {
        setSelectedShift(shift);
        

        map.flyTo({
          center: [shift.lng, shift.lat],
          zoom: Math.max(map.getZoom(), 4),
          duration: 1000
        });
      }
    });

    console.log(`✓ Added ${data.length} points to map`);
  }

  // Strip HTML tags from text
  function stripHTML(html) {
    if (!html) return "";
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }

  // Show loading state
  if (shifts.length === 0) {
    return (
      <div style={{
        minHeight: "calc(100vh - 81px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        color: theme.metaLabel,
        fontFamily: "'DM Mono', monospace",
        fontSize: 12,
        background: theme.bg
      }}>
        <div style={{ fontSize: 32 }}>🌍</div>
        <div>No regime shift data available</div>
        <div style={{ fontSize: 10, color: theme.textDim, maxWidth: 400, textAlign: "center" }}>
          Make sure rsdb_clean_240824.csv is in your /public folder
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      position: "relative", 
      minHeight: "calc(100vh - 81px)", // Header is ~81px (20px padding top + 20px bottom + 41px content)
      overflow: "hidden",
      background: theme.bg
    }}>
      {/* Mapbox token warning */}
      {!TOKEN && <NoTokenOverlay theme={theme} />}

      {/* Map container */}
      <div 
        ref={containerRef} 
        style={{ 
          width: "100%", 
          height: "calc(100vh - 81px)",
          position: "relative"
        }} 
      />

      {/* Search and Filter Panel */}
      <div style={{
        position: "absolute",
        top: 20,
        left: 32,
        width: 320,
        maxHeight: "calc(100vh - 200px)",
        overflowY: "auto",
        background: theme.cardBg,
        border: `1px solid ${theme.cardBorder}`,
        borderRadius: 8,
        pointerEvents: "auto",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
      }}>
        <div style={{ padding: 16, borderBottom: `1px solid ${theme.divider}` }}>
          <input
            type="text"
            placeholder="Search shifts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              background: theme.searchBg,
              border: `1px solid ${theme.searchBorder}`,
              borderRadius: 6,
              color: theme.text,
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
              outline: "none"
            }}
          />
        </div>

        <div style={{ padding: 16 }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: theme.metaLabel,
            marginBottom: 12
          }}>
            Regime Shift Types
          </div>

          <button
            onClick={() => setActiveType("all")}
            style={{
              display: "block",
              width: "100%",
              padding: "6px 10px",
              marginBottom: 4,
              background: activeType === "all" ? theme.filterActiveBg : "transparent",
              border: `1px solid ${activeType === "all" ? theme.filterActiveBorder : theme.filterBorder}`,
              borderRadius: 4,
              color: activeType === "all" ? theme.filterActiveText : theme.filterText,
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            All Types ({shifts.length})
          </button>

          {typeCounts.slice(0, 15).map(([type, count]) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              style={{
                display: "block",
                width: "100%",
                padding: "6px 10px",
                marginBottom: 4,
                background: activeType === type ? theme.filterActiveBg : "transparent",
                border: `1px solid ${activeType === type ? theme.filterActiveBorder : theme.filterBorder}`,
                borderRadius: 4,
                color: activeType === type ? theme.filterActiveText : theme.filterText,
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <span style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: TYPE_COLORS[type] || "#888",
                marginRight: 8
              }} />
              {type} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredShift && !selectedShift && (
        <div style={{
          position: "absolute",
          left: hoveredShift.x + 12,
          top: hoveredShift.y - 8,
          background: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: 6,
          padding: "6px 12px",
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: theme.text,
          pointerEvents: "none",
          maxWidth: 250,
          zIndex: 100,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)"
        }}>
          <div style={{ fontWeight: 600, marginBottom: 2 }}>
            {hoveredShift.shift.name}
          </div>
          <div style={{ fontSize: 9, color: theme.metaLabel }}>
            {hoveredShift.shift.type}
          </div>
        </div>
      )}

      {/* Detail Sidebar */}
      {selectedShift && (
        <DetailSidebar 
          shift={selectedShift}
          theme={theme}
          onClose={() => setSelectedShift(null)}
          stripHTML={stripHTML}
        />
      )}



      {/* Count badge */}
      <div style={{
        position: "absolute",
        top: 20,
        right: 32,
        fontFamily: "'DM Mono', monospace",
        fontSize: 11,
        letterSpacing: "0.1em",
        color: theme.metaLabel,
        pointerEvents: "none"
      }}>

      </div>
    </div>
  );
}


function DetailSidebar({ shift, theme, onClose, stripHTML }) {

  const renderField = (label, content, isHTML = false) => {
    if (!content || content === "N/A") return null;
    
    return (
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: theme.metaLabel,
          marginBottom: 6
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          lineHeight: 1.6,
          color: theme.text
        }}>
          {isHTML ? stripHTML(content) : content}
        </div>
      </div>
    );
  };

  const renderMetadata = (label, value) => {
    if (!value) return null;
    
    return (
      <div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: theme.metaLabel,
          marginBottom: 4
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: theme.metaValue
        }}>
          {value}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      width: 480,
      background: theme.cardBg,
      borderLeft: `1px solid ${theme.cardBorder}`,
      overflowY: "auto",
      overflowX: "hidden",
      pointerEvents: "auto",
      boxShadow: "-4px 0 12px rgba(0, 0, 0, 0.3)"
    }}>
      <button
        onClick={onClose}
        style={{
          position: "sticky",
          top: 16,
          float: "right",
          marginRight: 16,
          background: theme.cardBg,
          border: `1px solid ${theme.filterBorder}`,
          borderRadius: 4,
          padding: "6px 12px",
          color: theme.metaLabel,
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          cursor: "pointer",
          zIndex: 10,
          transition: "all 0.2s",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
        }}
      >
        ✕ CLOSE
      </button>

      <div style={{ padding: 24, clear: "both" }}>
        {/* Type Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "4px 10px",
          background: theme.assetBg,
          border: `1px solid ${TYPE_COLORS[shift.type] || theme.assetBorder}`,
          borderRadius: 4,
          marginBottom: 16
        }}>
          <span style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: TYPE_COLORS[shift.type] || "#888",
            marginRight: 6
          }} />
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: theme.assetText
          }}>
            {shift.type}
          </span>
        </div>

        {/* Title and Location */}
        <h2 style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 24,
          fontWeight: 600,
          color: theme.text,
          margin: "0 0 8px 0",
          lineHeight: 1.3
        }}>
          {shift.name}
        </h2>

        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: theme.textMuted,
          marginBottom: 24
        }}>
          📍 {shift.location}
          {shift.continent && ` • ${shift.continent}`}
        </div>

        {/* Summary */}
        {renderField("Summary", shift.summary, true)}

        {/* Ecosystem & Scale Info */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 24,
          padding: 12,
          background: theme.assetBg,
          borderRadius: 6,
          border: `1px solid ${theme.divider}`
        }}>
          {renderMetadata("Ecosystem Type", shift.ecosystem)}
          {renderMetadata("Spatial Scale", shift.spatialScale)}
          {renderMetadata("Land Uses", shift.landUses)}
          {renderMetadata("Coordinates", `${shift.lat.toFixed(4)}, ${shift.lng.toFixed(4)}`)}
        </div>

        {/* Alternate Regimes */}
        {renderField("Alternate Regimes", shift.alternateRegimes, true)}

        {/* How It Worked */}
        {renderField("How the Regime Shift Worked", shift.howItWorked, true)}

        {/* Drivers Section */}
        {(shift.keyDirectDrivers || shift.driversAndCauses) && (
          <div style={{
            marginBottom: 24,
            padding: 16,
            background: theme.assetBg,
            borderRadius: 6,
            border: `1px solid ${theme.divider}`
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: theme.metaLabel,
              marginBottom: 12,
              fontWeight: 600
            }}>
              🔥 Drivers & Causes
            </div>
            {renderField("Key Direct Drivers", shift.keyDirectDrivers, true)}
            {renderField("Drivers and Causes", shift.driversAndCauses, true)}
          </div>
        )}

        {/* Impacts Section */}
        {(shift.impactsEcosystemProcesses || shift.impactsProvisioning || shift.impactsRegulating || 
          shift.impactsCultural || shift.impactsHumanWellbeing || shift.impactsSDG || shift.impactsEcosystemServices) && (
          <div style={{
            marginBottom: 24,
            padding: 16,
            background: theme.assetBg,
            borderRadius: 6,
            border: `1px solid ${theme.divider}`
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: theme.metaLabel,
              marginBottom: 12,
              fontWeight: 600
            }}>
              💥 Impacts
            </div>
            {renderField("Ecosystem Processes", shift.impactsEcosystemProcesses, true)}
            {renderField("Provisioning Services", shift.impactsProvisioning, true)}
            {renderField("Regulating Services", shift.impactsRegulating, true)}
            {renderField("Cultural Services", shift.impactsCultural, true)}
            {renderField("Human Well-being", shift.impactsHumanWellbeing, true)}
            {renderField("Sustainable Development Goals", shift.impactsSDG, true)}
            {renderField("Ecosystem Services & Human Well-being", shift.impactsEcosystemServices, true)}
          </div>
        )}

        {/* Threshold Information */}
        {(shift.thresholdVariable || shift.thresholdValue) && (
          <div style={{
            marginBottom: 24,
            padding: 12,
            background: theme.assetBg,
            borderRadius: 6,
            border: `1px solid ${theme.divider}`
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: theme.metaLabel,
              marginBottom: 12,
              fontWeight: 600
            }}>
              ⚡ Threshold
            </div>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
              color: theme.text
            }}>
              {shift.thresholdVariable && <span><strong>Variable:</strong> {shift.thresholdVariable}</span>}
              {shift.thresholdValue && <span style={{ marginLeft: 12 }}><strong>Value:</strong> {shift.thresholdValue}</span>}
              {shift.thresholdUnit && <span style={{ marginLeft: 4 }}>{shift.thresholdUnit}</span>}
            </div>
          </div>
        )}

        {/* Temporal & Evidence Metadata */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 24
        }}>
          {renderMetadata("Time Scale", shift.timeScale)}
          {renderMetadata("Year/Duration", shift.yearOrDuration)}
          {renderMetadata("Reversibility", shift.reversibility)}
          {renderMetadata("Sources of Evidence", shift.sourcesOfEvidence)}
          {renderMetadata("Confidence (Existence)", shift.confidenceExistence)}
          {renderMetadata("Confidence (Mechanism)", shift.confidenceMechanism)}
        </div>

        {/* Management Options */}
        {renderField("Management Options", shift.managementOptions, true)}

        {/* Contributors */}
        {(shift.mainContributors || shift.otherContributors) && (
          <div style={{ marginBottom: 24 }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: theme.metaLabel,
              marginBottom: 8,
              fontWeight: 600
            }}>
              👥 Contributors
            </div>
            {shift.mainContributors && (
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                color: theme.text,
                marginBottom: 4
              }}>
                <strong>Main:</strong> {stripHTML(shift.mainContributors)}
              </div>
            )}
            {shift.otherContributors && (
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                color: theme.text
              }}>
                <strong>Other:</strong> {stripHTML(shift.otherContributors)}
              </div>
            )}
          </div>
        )}

        {/* References */}
        {shift.references && (
          <div style={{ marginBottom: 24 }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: theme.metaLabel,
              marginBottom: 8,
              fontWeight: 600
            }}>
              📚 References
            </div>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: theme.textMuted,
              lineHeight: 1.6,
              maxHeight: 200,
              overflowY: "auto",
              padding: 8,
              background: theme.bg,
              borderRadius: 4
            }}>
              {stripHTML(shift.references)}
            </div>
          </div>
        )}

        {/* DOI */}
        {shift.doi && shift.doi !== "NA" && (
          <div style={{ marginBottom: 24 }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 9,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: theme.metaLabel,
              marginBottom: 6
            }}>
              DOI Links
            </div>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: theme.textMuted,
              lineHeight: 1.8
            }}>
              {stripHTML(shift.doi)}
            </div>
          </div>
        )}

        {/* Observations */}
        {shift.observations && shift.observations !== "NA" && (
          <div style={{ marginBottom: 24 }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 9,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: theme.metaLabel,
              marginBottom: 6
            }}>
              Observations
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              color: theme.textMuted,
              lineHeight: 1.6
            }}>
              {shift.observations}
            </div>
          </div>
        )}

        {/* Case Study ID */}
        <div style={{
          marginTop: 32,
          paddingTop: 16,
          borderTop: `1px solid ${theme.divider}`,
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          color: theme.textDim,
          textAlign: "center"
        }}>
          Case Study ID: {shift.id}
        </div>
      </div>
    </div>
  );
}

// Overlay shown when Mapbox token is missing
function NoTokenOverlay({ theme }) {
  return (
    <div style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: theme.bg,
      color: theme.metaLabel,
      fontFamily: "'DM Mono', monospace",
      fontSize: 12,
      textAlign: "center",
      padding: 32,
      gap: 12,
      zIndex: 1000
    }}>
      <div style={{ fontSize: 32 }}>🌐</div>
      <div>Missing Mapbox Token</div>
      <div style={{ fontSize: 10, color: theme.textDim }}>
        Add VITE_MAPBOX_TOKEN to your .env file
      </div>
    </div>
  );
}
