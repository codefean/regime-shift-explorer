
import { useState, useEffect } from "react";

let cachedShifts = null;
let cacheError = null;


function normalizeType(type, typeOther) {

  let workingType = type;
  
  if (!type || type === 'Unclassified' || type === 'NA' || type.trim() === '') {
    if (typeOther && typeOther !== 'NA' && typeOther.trim() !== '') {
      workingType = typeOther;
    } else {
      return 'Unclassified';
    }
  }
  
  // Normalize to lowercase and trim for comparison
  const normalized = workingType.toLowerCase().trim();
  
  // Map variations and common misspellings to standard types
  const typeMapping = {
    // Forest-related
    'forest die-offs': 'Forest die-offs',
    'forest die-off': 'Forest die-offs',
    'forest dieoffs': 'Forest die-offs',
    'forest to savanna': 'Forest to savanna',
    'coniferous to deciduous forest': 'Coniferous to deciduous forest',
    'tundra to forest': 'Tundra to forest',
    
    // Water/Salinization
    'freshwater salinization': 'Freshwater salinization',
    'fresh water salinization': 'Freshwater salinization',
    'water salinization': 'Freshwater salinization',
    'water/estuary salinization': 'Freshwater salinization',
    'soil salinization': 'Soil salinization',
    
    // Eutrophication
    'marine eutrophication': 'Marine eutrophication',
    'freshwater eutrophication': 'Freshwater eutrophication',
    'fresh water eutrophication': 'Freshwater eutrophication',
    
    // Hypoxia
    'hypoxia': 'Hypoxia',
    
    // Marine/Coastal
    'coral transitions': 'Coral transitions',
    'coral transition': 'Coral transitions',
    'kelps transitions': 'Kelp transitions',
    'kelp transitions': 'Kelp transitions',
    'kelp transition': 'Kelp transitions',
    'seagrass transitions': 'Seagrass transitions',
    'seagrass transition': 'Seagrass transitions',
    'mangroves transitions': 'Mangrove transitions',
    'mangrove transitions': 'Mangrove transitions',
    'mangrove transition': 'Mangrove transitions',
    'salt marshes to tidal flats': 'Salt marshes to tidal flats',
    'salt marsh to tidal flats': 'Salt marshes to tidal flats',
    'marine foodwebs': 'Marine foodwebs',
    'marine food webs': 'Marine foodwebs',
    'marine foodweb': 'Marine foodwebs',
    'bivalves collapse': 'Bivalves collapse',
    'bivalve collapse': 'Bivalves collapse',
    
    // Fisheries
    'fisheries collapse': 'Fisheries collapse',
    'fishery collapse': 'Fisheries collapse',
    
    // Shifts/Changes
    'community shift': 'Community shift',
    'population shift': 'Population shift',
    'species ecology shift': 'Species ecology shift',
    
    // Fire
    'fire regime': 'Fire regime',
    
    // Primary production
    'primary production': 'Primary production',
    'primary production arctic ocean': 'Primary production arctic ocean',
    'soil primary productivity': 'Primary production',
    
    // Peatland
    'peatland transitions': 'Peatland transitions',
    'peatland transition': 'Peatland transitions',
    
    // Submerged plants
    'submerged to floating plants': 'Submerged to floating plants',
    
    // Dryland/Desert
    'dryland degradation': 'Dryland degradation',
    'desertification': 'Dryland degradation',
    'bush encroachment': 'Bush encroachment',
    
    // Arctic/Ice
    'arctic sea-ice loss': 'Arctic sea-ice loss',
    'arctic sea ice loss': 'Arctic sea-ice loss',
    'arctic benthos borealisation': 'Arctic benthos borealisation',
    'greenland ice sheet collapse': 'Greenland ice sheet collapse',
    'west antarctic ice sheet collapse': 'West antarctic ice sheet collapse',
    'east antartica collapse': 'East Antarctic ice sheet collapse',
    'thermokarst lakes': 'Thermokarst lakes',
    'steppe to tundra': 'Steppe to tundra',
    
    // Water/River
    'river channel change': 'River channel change',
    'morphological nearshore change': 'Morphological nearshore change',
    'lake water level drop': 'Lake water level drop',
    'streamflow and sediment load change': 'River channel change',
    
    // Climate/Circulation
    'thermohaline circulation': 'Thermohaline circulation',
    'moonson': 'Monsoon',
    'monsoon': 'Monsoon',
    
    // Other ecological
    'insect outbreak': 'Insect outbreak',
    'pollination collapse': 'Pollination collapse',
    'turbid state': 'Turbid state',
    
    // Land use
    'floodplain vegetation to meadow monoculture': 'Floodplain vegetation change',
    'savannas (rangeland) to cropland': 'Savanna to cropland',
    'savannas (rangeland) to land for herding': 'Savanna to rangeland',
    'sprawling vs compact city': 'Urban sprawl',
    'common pool resource harvesting': 'Common pool resource harvesting'
  };
  
  // Check if we have a mapping
  if (typeMapping[normalized]) {
    return typeMapping[normalized];
  }
  
  // If no mapping found, return original with proper capitalization
  // (capitalize first letter of each word)
  return workingType
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Parses a CSV line respecting quotes and escaped characters
 */
function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote inside quoted field
        current += '"';
        i += 2;
        continue;
      }
      // Toggle quote state
      inQuotes = !inQuotes;
      i++;
      continue;
    }

    if (char === ',' && !inQuotes) {
      // Field separator found
      result.push(current.trim());
      current = "";
      i++;
      continue;
    }

    current += char;
    i++;
  }

  // Push the last field
  result.push(current.trim());
  return result;
}

/**
 * Parse the full CSV file into shift objects with data cleaning
 */
function parseShiftCSV(csvText) {
  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) {
    throw new Error("CSV file is empty or invalid");
  }

  const headers = parseCSVLine(lines[0]);
  const data = [];
  let skippedRows = 0;
  let cleanedTypes = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    try {
      const values = parseCSVLine(line);
      
      // Build row object
      const row = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx] || "";
      });

      // Parse coordinates
      const lat = parseFloat(row.lat);
      const lon = parseFloat(row.long);

      // Only include rows with valid coordinates
      if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
        // Clean and normalize the type
        const rawType = row.type || "";
        const rawTypeOther = row.regime_shift_type_other || "";
        const cleanedType = normalizeType(rawType, rawTypeOther);
        
        if (cleanedType !== rawType && cleanedType !== 'Unclassified') {
          cleanedTypes++;
        }

        // Generate unique name combining case name + location if case name repeats
let caseName = row.case_study_name?.trim() || cleanedType;

// Always add location to make it unique and descriptive
const location = row.location_countries || row.location_region || "";
if (location && !caseName.toLowerCase().includes(location.toLowerCase())) {
  caseName = `${caseName} - ${location}`;
}

name: caseName || `${cleanedType} ${row.id}`
        
        data.push({
          // Basic identification
          id: row.id || `shift-${i}`,
          name: row.case_study_name || "Unnamed Case Study",
          type: cleanedType, // Use cleaned type
          typeRaw: rawType, // Keep original for reference
          typeOther: rawTypeOther, // Keep other for reference

          
          
          // Location & scale
          location: row.location_countries || row.location_region || "Unknown Location",
          locationRegion: row.location_region || "",
          locationCountries: row.location_countries || "",
          continent: row.location_continent_or_ocean || "",
          lat,
          lng: lon,
          spatialScale: row.spatial_scale || "",
          
          // Ecosystem info
          ecosystem: row.ecosystem_type || "",
          landUses: row.land_uses || "",
          
          // Core content
          summary: row.summary || "",
          alternateRegimes: row.alternate_regimes || "",
          howItWorked: row.how_regime_shift_worked || "",
          
          // Drivers and causes
          keyDirectDrivers: row.key_direct_drivers || "",
          driversAndCauses: row.drivers_and_causes || "",
          
          // Impacts (multiple categories)
          impactsEcosystemProcesses: row.impacts_on_key_ecosystem_processes || "",
          impactsProvisioning: row.impacts_on_provisioning_services || "",
          impactsRegulating: row.impacts_on_regulating_services || "",
          impactsCultural: row.impacts_on_cultural_services || "",
          impactsHumanWellbeing: row.impacts_on_human_well_being || "",
          impactsSDG: row.impacts_on_sdg || "",
          impactsEcosystemServices: row.impacts_on_ecosystem_services_and_human_well_being || "",
          
          // Thresholds
          thresholdVariable: row.threshold_variable || "",
          thresholdValue: row.threshold_value || "",
          thresholdUnit: row.threshold_unit || "",
          
          // Temporal
          timeScale: row.time_scale || "",
          yearOrDuration: row.year_or_duration || "",
          
          // Evidence and confidence
          reversibility: row.reversibility || "",
          sourcesOfEvidence: row.sources_of_evidence || "",
          confidenceExistence: row.confidence_of_existence || "",
          confidenceMechanism: row.confidence_of_mechanism || "",
          
          // Management
          managementOptions: row.management_options || "",
          
          // Attribution
          mainContributors: row.main_contributors || "",
          otherContributors: row.other_contributors || "",
          
          // References
          references: row.references || "",
          doi: row.doi || "",
          observations: row.observations || ""
        });
      } else {
        skippedRows++;
      }
    } catch (err) {
      console.warn(`Error parsing line ${i}:`, err.message);
      skippedRows++;
    }
  }

  console.log(`✓ Loaded ${data.length} regime shifts`);
  console.log(`  - Cleaned/normalized ${cleanedTypes} type classifications`);
  console.log(`  - Skipped ${skippedRows} rows (invalid coordinates or parse errors)`);
  
  // Count types for debugging
  const typeCounts = {};
  data.forEach(shift => {
    typeCounts[shift.type] = (typeCounts[shift.type] || 0) + 1;
  });
  console.log(`  - Found ${Object.keys(typeCounts).length} unique regime shift types`);
  
  return data;
}

/**
 * Hook to load and cache regime shift data
 */
export function useShiftData() {
  const [shifts, setShifts] = useState(cachedShifts || []);
  const [loading, setLoading] = useState(cachedShifts === null);
  const [error, setError] = useState(cacheError);

  useEffect(() => {
    // If we already have cached data, use it
    if (cachedShifts !== null) {
      setShifts(cachedShifts);
      setError(cacheError);
      setLoading(false);
      return;
    }

    // Load from public folder
    const csvPath = `${import.meta.env.BASE_URL || "/"}rsdb_clean_240824.csv`;
    
    console.log(`Loading CSV from: ${csvPath}`);
    
    fetch(csvPath + `?t=${Date.now()}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.text();
      })
      .then(text => {
        if (!text || text.length < 100) {
          throw new Error("CSV file appears to be empty");
        }
        
        const data = parseShiftCSV(text);
        
        if (data.length === 0) {
          throw new Error("No valid regime shifts found in CSV");
        }
        
        // Cache the successful result
        cachedShifts = data;
        cacheError = null;
        setShifts(data);
        setError(null);
      })
      .catch(err => {
        console.error("Failed to load shift data:", err);
        
        // Cache the error state
        cachedShifts = [];
        cacheError = err.message;
        setShifts([]);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { shifts, loading, error };
}