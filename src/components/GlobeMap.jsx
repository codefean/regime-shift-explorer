// components/GlobeMap.jsx


import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const SOURCE_ID = "regime-points";
const LAYER_HALO = "regime-points-halo";
const LAYER_DOT  = "regime-points-dot";
const LAYER_HIT  = "regime-points-hit";

export default function GlobeMap({ shift, locations = [] }) {
  const containerRef    = useRef(null);
  const mapRef          = useRef(null);
  const isInteracting   = useRef(false);
  const spinEnabled     = useRef(false);
  const [tooltip, setTooltip] = useState(null); 
  const [pointCount, setPointCount] = useState(0);


  useEffect(() => {
    if (!TOKEN) return;
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

      map.on("mouseenter", LAYER_HIT, e => {
        map.getCanvas().style.cursor = "pointer";
        const { x, y } = e.point;
        const props = e.features[0]?.properties || {};
        setTooltip({ x, y, name: props.name || "Case study" });
      });
      map.on("mouseleave", LAYER_HIT, () => {
        map.getCanvas().style.cursor = "";
        setTooltip(null);
      });
      map.on("mousemove", LAYER_HIT, e => {
        const { x, y } = e.point;
        const props = e.features[0]?.properties || {};
        setTooltip({ x, y, name: props.name || "Case study" });
      });


      let lastTime = null;
      function spin(timestamp) {
        if (!spinEnabled.current) return;
        if (lastTime !== null) {
          const elapsed = timestamp - lastTime;
          if (!isInteracting.current && map.getZoom() < 4 && map.isStyleLoaded()) {
            const center = map.getCenter();
            center.lng -= (elapsed / 1000) * 20;
            map.setCenter(center);
          }
        }
        lastTime = timestamp;
        requestAnimationFrame(spin);
      }
      requestAnimationFrame(spin);
    });

    return () => {
      spinEnabled.current = false;
      setTooltip(null);
      map.remove();
    };
  }, [shift?.name]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const apply = () => {
      addPoints(map, locations);
      setPointCount(locations.length);
      if (locations.length > 0) {
        const avgLng = locations.reduce((s, p) => s + p.lng, 0) / locations.length;
        const avgLat = locations.reduce((s, p) => s + p.lat, 0) / locations.length;
        map.flyTo({ center: [avgLng, avgLat], zoom: 2, duration: 1500, essential: true });
      }
    };

    if (map.isStyleLoaded()) {
      apply();
    } else {
      map.once("load", apply);
    }
  }, [locations]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {!TOKEN && <NoTokenOverlay />}

      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />


      <div style={{
        position: "absolute", top: 20, right: 20,
        fontFamily: "'DM Mono', monospace", fontSize: 11,
        letterSpacing: "0.1em", textTransform: "uppercase",
        color: "rgba(90,184,126,0.5)", pointerEvents: "none", userSelect: "none",
        textAlign: "right", lineHeight: 1.6,
      }}>
        {shift?.name}
        {pointCount > 0 && (
          <div style={{ fontSize: 9, color: "rgba(90,184,126,0.35)", marginTop: 2 }}>
            {pointCount} documented {pointCount === 1 ? "location" : "locations"}
          </div>
        )}
      </div>


      {pointCount === 0 && (
        <div style={{
          position: "absolute", bottom: 52, left: "50%", transform: "translateX(-50%)",
          fontFamily: "'DM Mono', monospace", fontSize: 10,
          color: "rgba(90,184,126,0.3)", letterSpacing: "0.08em",
          pointerEvents: "none", whiteSpace: "nowrap",
        }}>
          No documented locations in dataset
        </div>
      )}


      {tooltip && (
        <div style={{
          position: "absolute",
          left: tooltip.x + 12,
          top: tooltip.y - 8,
          background: "rgba(8,12,14,0.92)",
          border: "1px solid rgba(90,184,126,0.3)",
          borderRadius: 6,
          padding: "5px 10px",
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: "rgba(200,220,210,0.9)",
          pointerEvents: "none",
          maxWidth: 220,
          lineHeight: 1.4,
          zIndex: 10,
        }}>
          {tooltip.name}
        </div>
      )}
    </div>
  );
}


function addPoints(map, locations) {
  if (!locations?.length) return;

  const geojson = {
    type: "FeatureCollection",
    features: locations.map(p => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [p.lng, p.lat] },
      properties: { name: p.name, id: p.id },
    })),
  };

  [LAYER_HALO, LAYER_DOT, LAYER_HIT].forEach(id => {
    if (map.getLayer(id)) map.removeLayer(id);
  });
  if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);

  map.addSource(SOURCE_ID, { type: "geojson", data: geojson });


  map.addLayer({
    id: LAYER_HALO,
    type: "circle",
    source: SOURCE_ID,
    paint: {
      "circle-radius": 10,
      "circle-color": "#1a5c38",
      "circle-opacity": 0.25,
      "circle-blur": 1,
    },
  });


  map.addLayer({
    id: LAYER_DOT,
    type: "circle",
    source: SOURCE_ID,
    paint: {
      "circle-radius": 4,
      "circle-color": "#5ab87e",
      "circle-opacity": 0.85,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#2d8a54",
      "circle-stroke-opacity": 0.6,
    },
  });

  map.addLayer({
    id: LAYER_HIT,
    type: "circle",
    source: SOURCE_ID,
    paint: {
      "circle-radius": 14,
      "circle-opacity": 0,
      "circle-stroke-width": 0,
    },
  });
}

function NoTokenOverlay() {
  return (
    <div style={{
      position: "absolute", inset: 0, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", background: "#000",
      color: "#3d5248", fontFamily: "'DM Mono', monospace", fontSize: 12,
      textAlign: "center", padding: 32, gap: 12, zIndex: 10,
    }}>
      <div style={{ fontSize: 24 }}>🌐</div>

    </div>
  );
}
