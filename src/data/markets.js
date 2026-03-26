// data/markets.js


export const MARKETS = {

  "Thermohaline circulation (AMOC)": {
    stocks: [
      {
        ticker: "NEE",
        exchange: "NYSE",
        name: "NextEra Energy",
        relevance: "European energy demand reshaping as NW Europe winters warm/cool unpredictably",
        exposure: "medium",
      },
      {
        ticker: "AWK",
        exchange: "NYSE",
        name: "American Water Works",
        relevance: "Freshwater systems disrupted by precipitation pattern shifts from AMOC weakening",
        exposure: "medium",
      },
      {
        ticker: "ORSTED.CO",
        exchange: "CPH",
        name: "Ørsted",
        relevance: "Offshore wind assets concentrated in North Atlantic — directly in AMOC impact zone",
        exposure: "high",
      },
      {
        ticker: "XYL",
        exchange: "NYSE",
        name: "Xylem",
        relevance: "Flood resilience infrastructure demand spikes as NW European weather extremes increase",
        exposure: "high",
      },
    ],
    polymarket: [
      {
        title: "Will AMOC show significant weakening measured by RAPID array by 2030?",
        relevance: "Direct structural collapse proxy — triggers sovereign repricing",
        probability: 38,
        url: null,
      },
      {
        title: "Will the UK experience a record cold winter by 2028 linked to AMOC disruption?",
        relevance: "Insurance loss ratio and heating demand trigger",
        probability: 22,
        url: null,
      },
    ],
  },

  "Arctic sea ice loss": {
    stocks: [
      {
        ticker: "FRO",
        exchange: "NYSE",
        name: "Frontline",
        relevance: "Tanker routes rerouted via Northern Sea Route — major cost/time advantage",
        exposure: "high",
      },
      {
        ticker: "SHEL",
        exchange: "NYSE",
        name: "Shell",
        relevance: "Arctic drilling licence portfolio value rises as ice-free windows extend",
        exposure: "high",
      },
      {
        ticker: "RCL",
        exchange: "NYSE",
        name: "Royal Caribbean",
        relevance: "Arctic expedition cruise demand expanding with accessible summer routes",
        exposure: "medium",
      },
      {
        ticker: "NESTE.HE",
        exchange: "HEL",
        name: "Neste",
        relevance: "Biofuel shipping demand grows as Arctic route traffic increases",
        exposure: "low",
      },
    ],
    polymarket: [
      {
        title: "Will the Arctic Ocean be ice-free in summer before 2035?",
        relevance: "Triggers Northern Sea Route commercialisation and O&G licence activation",
        probability: 61,
        url: null,
      },
      {
        title: "Will Arctic summer sea ice extent fall below 1M km² by 2027?",
        relevance: "Key threshold for shipping route viability assessments",
        probability: 44,
        url: null,
      },
    ],
  },

  "Greenland ice sheet collapse": {
    stocks: [
      {
        ticker: "AWK",
        exchange: "NYSE",
        name: "American Water Works",
        relevance: "Coastal flooding drives infrastructure replacement demand in low-elevation US cities",
        exposure: "medium",
      },
      {
        ticker: "XYL",
        exchange: "NYSE",
        name: "Xylem",
        relevance: "Flood resilience and stormwater management infrastructure — direct demand driver",
        exposure: "high",
      },
      {
        ticker: "WCN",
        exchange: "NYSE",
        name: "Waste Connections",
        relevance: "Coastal waste infrastructure relocation and remediation as SLR accelerates",
        exposure: "low",
      },
    ],
    polymarket: [
      {
        title: "Will Greenland ice sheet mass loss exceed 300 Gt/yr average by 2030?",
        relevance: "Tipping proximity indicator — sea level commitment accelerator",
        probability: 55,
        url: null,
      },
    ],
  },

  "West Antarctic ice sheet collapse": {
    stocks: [
      {
        ticker: "XYL",
        exchange: "NYSE",
        name: "Xylem",
        relevance: "Long-horizon coastal infrastructure demand — largest addressable market if WAIS tips",
        exposure: "high",
      },
      {
        ticker: "AWK",
        exchange: "NYSE",
        name: "American Water Works",
        relevance: "Coastal utility infrastructure exposure and relocation demand",
        exposure: "medium",
      },
    ],
    polymarket: [
      {
        title: "Will Thwaites glacier lose contact with its underwater ridge by 2030?",
        relevance: "Grounding line retreat — irreversibility threshold for WAIS",
        probability: 29,
        url: null,
      },
    ],
  },

  "Coral transitions": {
    stocks: [
      {
        ticker: "RCL",
        exchange: "NYSE",
        name: "Royal Caribbean",
        relevance: "~35% of itineraries transit GBR and Caribbean reef systems — direct tourism loss",
        exposure: "high",
      },
      {
        ticker: "VAC",
        exchange: "NYSE",
        name: "Marriott Vacations",
        relevance: "Resort RE heavily concentrated in reef-dependent coastal zones",
        exposure: "high",
      },
      {
        ticker: "NCLH",
        exchange: "NYSE",
        name: "Norwegian Cruise Line",
        relevance: "Caribbean and Pacific reef itineraries form core of revenue base",
        exposure: "high",
      },
    ],
    polymarket: [
      {
        title: "Will coral cover on the Great Barrier Reef fall below 10% by 2035?",
        relevance: "Direct bleaching threshold — triggers Australian tourism revenue reassessment",
        probability: 33,
        url: null,
      },
      {
        title: "Will 2024/25 see a fourth global coral bleaching event declared by NOAA?",
        relevance: "Bleaching frequency proxy for insurance repricing",
        probability: 72,
        url: null,
      },
    ],
  },

  "Kelp transitions": {
    stocks: [
      {
        ticker: "HAIN",
        exchange: "NASDAQ",
        name: "Hain Celestial",
        relevance: "Seaweed-derived food ingredients supply chain disrupted by kelp loss",
        exposure: "medium",
      },
      {
        ticker: "SFM",
        exchange: "NASDAQ",
        name: "Sprouts Farmers Market",
        relevance: "Abalone, urchin, rockfish supply chain exposure from kelp forest collapse",
        exposure: "low",
      },
    ],
    polymarket: [
      {
        title: "Will California kelp forest extent fall below 50% of 2000 baseline by 2030?",
        relevance: "Fisheries quota and aquaculture revenue threshold",
        probability: 48,
        url: null,
      },
    ],
  },

  "Marine food webs": {
    stocks: [
      {
        ticker: "MOWI.OL",
        exchange: "OSL",
        name: "Mowi ASA",
        relevance: "World's largest salmon farmer — forage fish feed supply directly exposed",
        exposure: "high",
      },
      {
        ticker: "SALM.OL",
        exchange: "OSL",
        name: "SalMar",
        relevance: "Salmon aquaculture feed costs rise as wild-capture forage fish decline",
        exposure: "high",
      },
      {
        ticker: "TSN",
        exchange: "NYSE",
        name: "Tyson Foods",
        relevance: "Omega-3 fishmeal supply chain exposure for animal feed inputs",
        exposure: "medium",
      },
    ],
    polymarket: [
      {
        title: "Will global wild-capture fisheries production fall below 80 Mt by 2028?",
        relevance: "Food web collapse proxy — fishmeal and omega-3 price trigger",
        probability: 31,
        url: null,
      },
    ],
  },

  "Fisheries collapse": {
    stocks: [
      {
        ticker: "MOWI.OL",
        exchange: "OSL",
        name: "Mowi ASA",
        relevance: "Wild fisheries collapse drives aquaculture demand — price premium expansion",
        exposure: "high",
      },
      {
        ticker: "TSN",
        exchange: "NYSE",
        name: "Tyson Foods",
        relevance: "Seafood protein substitution demand shift as wild stocks collapse",
        exposure: "medium",
      },
      {
        ticker: "HOLL",
        exchange: "OTC",
        name: "High Liner Foods",
        relevance: "Direct wild-catch procurement exposure — quota cuts hit margins immediately",
        exposure: "high",
      },
    ],
    polymarket: [
      {
        title: "Will Atlantic cod be relisted as commercially extinct in any ICES zone by 2027?",
        relevance: "Quota collapse trigger — seafood equity and sovereign risk for Iceland/Norway",
        probability: 19,
        url: null,
      },
      {
        title: "Will global fishmeal prices exceed $2,000/tonne in 2025?",
        relevance: "Aquaculture feed cost pressure — direct aquaculture margin compression",
        probability: 41,
        url: null,
      },
    ],
  },

  "Marine eutrophication": {
    stocks: [
      {
        ticker: "XYL",
        exchange: "NYSE",
        name: "Xylem",
        relevance: "Nutrient removal and coastal water treatment infrastructure demand",
        exposure: "high",
      },
      {
        ticker: "AWK",
        exchange: "NYSE",
        name: "American Water Works",
        relevance: "Harmful algal bloom contamination of drinking water intakes",
        exposure: "high",
      },
      {
        ticker: "MOS",
        exchange: "NYSE",
        name: "The Mosaic Company",
        relevance: "Fertiliser runoff regulation risk — nitrogen/phosphorus loading liability",
        exposure: "medium",
      },
      {
        ticker: "NTR",
        exchange: "NYSE",
        name: "Nutrien",
        relevance: "Regulatory risk as eutrophication drives fertiliser application restrictions",
        exposure: "medium",
      },
    ],
    polymarket: [
      {
        title: "Will the Gulf of Mexico dead zone exceed 20,000 km² in 2025?",
        relevance: "Nutrient loading proxy — fisheries and coastal RE repricing trigger",
        probability: 36,
        url: null,
      },
    ],
  },

  "Hypoxia": {
    stocks: [
      {
        ticker: "MOS",
        exchange: "NYSE",
        name: "The Mosaic Company",
        relevance: "Fertiliser runoff the primary driver of coastal hypoxia — regulatory headwind",
        exposure: "high",
      },
      {
        ticker: "NTR",
        exchange: "NYSE",
        name: "Nutrien",
        relevance: "Phosphorus and nitrogen application restrictions as dead zones expand",
        exposure: "high",
      },
      {
        ticker: "XYL",
        exchange: "NYSE",
        name: "Xylem",
        relevance: "Oxygenation and water quality restoration infrastructure demand",
        exposure: "medium",
      },
    ],
    polymarket: [
      {
        title: "Will the Baltic Sea be declared in permanent hypoxic crisis by 2030?",
        relevance: "Fisheries and shipping insurance repricing for Baltic operators",
        probability: 27,
        url: null,
      },
    ],
  },

  "Seagrass transitions": {
    stocks: [
      {
        ticker: "XYL",
        exchange: "NYSE",
        name: "Xylem",
        relevance: "Water clarity restoration for seagrass recovery — treatment infrastructure",
        exposure: "medium",
      },
      {
        ticker: "AWK",
        exchange: "NYSE",
        name: "American Water Works",
        relevance: "Coastal water quality impacts on drinking water and recreational value",
        exposure: "low",
      },
    ],
    polymarket: [
      {
        title: "Will Florida seagrass coverage recover to 2010 levels by 2030?",
        relevance: "Nursery habitat restoration proxy — commercial fisheries recovery indicator",
        probability: 18,
        url: null,
      },
    ],
  },

  "Salt marshes to tidal flats": {
    stocks: [
      {
        ticker: "XYL",
        exchange: "NYSE",
        name: "Xylem",
        relevance: "Coastal flood protection infrastructure as natural buffers are lost",
        exposure: "high",
      },
      {
        ticker: "AWK",
        exchange: "NYSE",
        name: "American Water Works",
        relevance: "Saltwater intrusion into freshwater coastal aquifers",
        exposure: "medium",
      },
    ],
    polymarket: [
      {
        title: "Will US federal blue carbon credit markets launch before 2027?",
        relevance: "Salt marsh restoration financing — carbon credit monetisation trigger",
        probability: 34,
        url: null,
      },
    ],
  },

  "Arctic benthos borealisation": {
    stocks: [
      {
        ticker: "FRO",
        exchange: "NYSE",
        name: "Frontline",
        relevance: "Arctic shipping route expansion as ice retreats and new species open commercial fishing",
        exposure: "medium",
      },
      {
        ticker: "MOWI.OL",
        exchange: "OSL",
        name: "Mowi ASA",
        relevance: "New Arctic species entering commercial aquaculture as ranges shift northward",
        exposure: "medium",
      },
    ],
    polymarket: [
      {
        title: "Will commercial cod fishing begin in the Central Arctic Ocean by 2030?",
        relevance: "Borealisation threshold — new fisheries licence value and treaty disputes",
        probability: 23,
        url: null,
      },
    ],
  },

  "Primary productivity — Arctic Ocean": {
    stocks: [
      {
        ticker: "MOWI.OL",
        exchange: "OSL",
        name: "Mowi ASA",
        relevance: "Increased Arctic productivity creates new aquaculture zones as ice retreats",
        exposure: "medium",
      },
      {
        ticker: "SHEL",
        exchange: "NYSE",
        name: "Shell",
        relevance: "Ice-free Arctic enables O&G exploration in newly productive marine zones",
        exposure: "medium",
      },
    ],
    polymarket: [
      {
        title: "Will Arctic Ocean chlorophyll levels increase >20% above 2000 baseline by 2030?",
        relevance: "Productivity shift proxy — fisheries and carbon export accounting",
        probability: 52,
        url: null,
      },
    ],
  },

  "Freshwater eutrophication": {
    stocks: [
      {
        ticker: "AWK",
        exchange: "NYSE",
        name: "American Water Works",
        relevance: "Cyanobacteria blooms contaminate drinking water reservoirs — treatment cost surge",
        exposure: "high",
      },
      {
        ticker: "XYL",
        exchange: "NYSE",
        name: "Xylem",
        relevance: "Advanced filtration and nutrient removal systems for affected water bodies",
        exposure: "high",
      },
      {
        ticker: "MOS",
        exchange: "NYSE",
        name: "The Mosaic Company",
        relevance: "Agricultural phosphorus runoff regulation risk as lake eutrophication worsens",
        exposure: "medium",
      },
    ],
    polymarket: [
      {
        title: "Will Lake Erie issue a no-drink advisory lasting more than 30 days in 2025?",
        relevance: "HAB severity proxy — municipal water utility liability and treatment spend",
        probability: 21,
        url: null,
      },
    ],
  },

  "Submerged to floating plants": {
    stocks: [
      {
        ticker: "AWK",
        exchange: "NYSE",
        name: "American Water Works",
        relevance: "Floating macrophyte invasion of reservoirs blocks water intakes",
        exposure: "high",
      },
      {
        ticker: "XYL",
        exchange: "NYSE",
        name: "Xylem",
        relevance: "Mechanical and chemical removal systems for invasive aquatic plants",
        exposure: "medium",
      },
    ],
    polymarket: [
      {
        title: "Will water hyacinth cover more than 50% of Lake Victoria by 2027?",
        relevance: "Hydropower and fisheries disruption threshold for East African infrastructure",
        probability: 29,
        url: null,
      },
    ],
  },

  "Forest to savanna": {
    stocks: [
      {
        ticker: "ADM",
        exchange: "NYSE",
        name: "Archer-Daniels-Midland",
        relevance: "Brazilian soy procurement — direct exposure to Amazon tipping and crop disruption",
        exposure: "high",
      },
      {
        ticker: "BG",
        exchange: "NYSE",
        name: "Bunge Global",
        relevance: "Largest soy and grain trader in Brazil — deforestation liability and supply risk",
        exposure: "high",
      },
      {
        ticker: "JBS",
        exchange: "OTC",
        name: "JBS SA",
        relevance: "Brazilian beef production collapses if savannification accelerates pasture loss",
        exposure: "high",
      },
      {
        ticker: "NEE",
        exchange: "NYSE",
        name: "NextEra Energy",
        relevance: "Carbon credit permanence risk in forest offsets held as renewable project offsets",
        exposure: "medium",
      },
    ],
    polymarket: [
      {
        title: "Will Amazon deforestation exceed 15,000 km² in 2025?",
        relevance: "Tipping proximity — carbon credit permanence and soy supply chain trigger",
        probability: 31,
        url: null,
      },
      {
        title: "Will Brazil declare a national climate emergency due to Amazon dieback by 2030?",
        relevance: "Sovereign risk and agricultural commodity price disruption signal",
        probability: 17,
        url: null,
      },
    ],
  },

  "Peatland transitions": {
    stocks: [
      {
        ticker: "NESTE.HE",
        exchange: "HEL",
        name: "Neste",
        relevance: "Palm oil sourcing from peat-adjacent Indonesian land — regulatory and liability risk",
        exposure: "high",
      },
      {
        ticker: "WY",
        exchange: "NYSE",
        name: "Weyerhaeuser",
        relevance: "Timber REIT with peatland-adjacent forestry — carbon stock liability",
        exposure: "medium",
      },
      {
        ticker: "ADM",
        exchange: "NYSE",
        name: "Archer-Daniels-Midland",
        relevance: "Palm oil procurement chain exposure to Indonesian peatland fire seasons",
        exposure: "medium",
      },
    ],
    polymarket: [
      {
        title: "Will Indonesian peatland fires exceed 2015 levels in any year before 2028?",
        relevance: "Carbon stock loss and palm oil supply disruption threshold",
        probability: 39,
        url: null,
      },
    ],
  },

  "Bush encroachment": {
    stocks: [
      {
        ticker: "TSN",
        exchange: "NYSE",
        name: "Tyson Foods",
        relevance: "Sub-Saharan beef supply chain exposed as encroachment reduces livestock carrying capacity",
        exposure: "medium",
      },
      {
        ticker: "ADM",
        exchange: "NYSE",
        name: "Archer-Daniels-Midland",
        relevance: "African agri-commodity sourcing disrupted by land productivity loss",
        exposure: "low",
      },
    ],
    polymarket: [
      {
        title: "Will Southern African livestock numbers fall >20% by 2030 due to bush encroachment?",
        relevance: "Pastoral land productivity collapse — agri-land value and sovereign risk",
        probability: 24,
        url: null,
      },
    ],
  },

  "Coniferous to deciduous forest": {
    stocks: [
      {
        ticker: "WY",
        exchange: "NYSE",
        name: "Weyerhaeuser",
        relevance: "Timber REIT with large boreal/conifer holdings — species mix shift hits yield",
        exposure: "high",
      },
      {
        ticker: "PCH",
        exchange: "NYSE",
        name: "PotlatchDeltic",
        relevance: "Softwood timber REIT exposed to beetle kill and conifer mortality",
        exposure: "high",
      },
      {
        ticker: "RFP",
        exchange: "NYSE",
        name: "Resolute Forest Products",
        relevance: "Boreal softwood pulp and paper — direct exposure to conifer-to-deciduous shift",
        exposure: "high",
      },
    ],
    polymarket: [
      {
        title: "Will mountain pine beetle kill exceed 50% of BC lodgepole pine by 2030?",
        relevance: "Timber yield and carbon credit permanence threshold for Canadian forestry",
        probability: 44,
        url: null,
      },
    ],
  },

  "Tundra to boreal forest": {
    stocks: [
      {
        ticker: "WY",
        exchange: "NYSE",
        name: "Weyerhaeuser",
        relevance: "Northward boreal expansion creates new harvestable timber zones long-term",
        exposure: "low",
      },
      {
        ticker: "SHEL",
        exchange: "NYSE",
        name: "Shell",
        relevance: "Permafrost thaw underlying tundra-to-boreal transition damages Arctic infrastructure",
        exposure: "medium",
      },
    ],
    polymarket: [
      {
        title: "Will the boreal treeline advance more than 100km north of 2000 position by 2040?",
        relevance: "Carbon accounting and forestry licence value shift in arctic states",
        probability: 41,
        url: null,
      },
    ],
  },

  "Steppe to tundra": {
    stocks: [
      {
        ticker: "ADM",
        exchange: "NYSE",
        name: "Archer-Daniels-Midland",
        relevance: "Central Asian grain supply chain disrupted as steppe productivity declines",
        exposure: "medium",
      },
      {
        ticker: "BG",
        exchange: "NYSE",
        name: "Bunge Global",
        relevance: "Kazakhstan wheat export exposure as steppe-tundra transition reduces arable land",
        exposure: "medium",
      },
    ],
    polymarket: [
      {
        title: "Will Kazakhstan wheat exports fall >30% from 2020 baseline by 2030?",
        relevance: "Steppe productivity collapse proxy — grain commodity price trigger",
        probability: 22,
        url: null,
      },
    ],
  },

  "Thermokarst lakes": {
    stocks: [
      {
        ticker: "SHEL",
        exchange: "NYSE",
        name: "Shell",
        relevance: "Arctic O&G infrastructure damaged by permafrost thaw underlying thermokarst zones",
        exposure: "high",
      },
      {
        ticker: "BP",
        exchange: "NYSE",
        name: "BP",
        relevance: "Alaskan and Siberian pipeline infrastructure on thawing permafrost",
        exposure: "high",
      },
      {
        ticker: "ENB",
        exchange: "NYSE",
        name: "Enbridge",
        relevance: "Northern pipeline network exposure to ground subsidence from thermokarst expansion",
        exposure: "high",
      },
    ],
    polymarket: [
      {
        title: "Will Arctic methane emissions from thermokarst lakes exceed IPCC baseline by 2030?",
        relevance: "Carbon accounting and climate liability — energy company stranded asset risk",
        probability: 46,
        url: null,
      },
    ],
  },

  "Indian summer monsoon": {
    stocks: [
      {
        ticker: "ADM",
        exchange: "NYSE",
        name: "Archer-Daniels-Midland",
        relevance: "Indian agricultural commodity procurement — kharif crop failure risk",
        exposure: "high",
      },
      {
        ticker: "BG",
        exchange: "NYSE",
        name: "Bunge Global",
        relevance: "South Asian grain and oilseed sourcing disrupted by monsoon failure",
        exposure: "high",
      },
      {
        ticker: "AWK",
        exchange: "NYSE",
        name: "American Water Works",
        relevance: "Global water infrastructure demand model — India water stress a key growth driver",
        exposure: "low",
      },
    ],
    polymarket: [
      {
        title: "Will India declare a national drought emergency due to monsoon failure by 2027?",
        relevance: "Agricultural commodity and sovereign bond repricing trigger",
        probability: 28,
        url: null,
      },
      {
        title: "Will Indian monsoon rainfall fall >20% below average in any year before 2030?",
        relevance: "Kharif crop yield collapse — food security and inflation proxy",
        probability: 35,
        url: null,
      },
    ],
  },

  "River channel change": {
    stocks: [
      {
        ticker: "XYL",
        exchange: "NYSE",
        name: "Xylem",
        relevance: "Flood and sediment management infrastructure for dynamic river systems",
        exposure: "high",
      },
      {
        ticker: "AWK",
        exchange: "NYSE",
        name: "American Water Works",
        relevance: "Water intake infrastructure threatened by channel migration",
        exposure: "medium",
      },
    ],
    polymarket: [
      {
        title: "Will the Mississippi River require emergency dredging more than twice before 2027?",
        relevance: "Navigation and agricultural export infrastructure cost proxy",
        probability: 33,
        url: null,
      },
    ],
  },

  "Common pool resource harvesting": {
    stocks: [
      {
        ticker: "MOWI.OL",
        exchange: "OSL",
        name: "Mowi ASA",
        relevance: "Wild fisheries governance failure accelerates aquaculture market share",
        exposure: "medium",
      },
      {
        ticker: "WY",
        exchange: "NYSE",
        name: "Weyerhaeuser",
        relevance: "Forestry concession value at risk when common pool governance collapses",
        exposure: "medium",
      },
    ],
    polymarket: [
      {
        title: "Will the high seas treaty enter into force before 2026?",
        relevance: "Common pool governance for international waters — fisheries and mining rights",
        probability: 58,
        url: null,
      },
    ],
  },

  "Sprawling vs compact cities": {
    stocks: [
      {
        ticker: "NEE",
        exchange: "NYSE",
        name: "NextEra Energy",
        relevance: "Distributed energy demand grows faster in sprawling cities — grid investment driver",
        exposure: "medium",
      },
      {
        ticker: "AWK",
        exchange: "NYSE",
        name: "American Water Works",
        relevance: "Per-capita water infrastructure costs 40% higher in sprawl — utility revenue model",
        exposure: "medium",
      },
    ],
    polymarket: [
      {
        title: "Will more than 10 US cities adopt urban growth boundaries by 2027?",
        relevance: "Compact city policy proxy — municipal bond and RE developer exposure",
        probability: 31,
        url: null,
      },
    ],
  },

  "Bivalves collapse": {
    stocks: [
      {
        ticker: "MOWI.OL",
        exchange: "OSL",
        name: "Mowi ASA",
        relevance: "Aquaculture sector exposed to ocean acidification affecting bivalve larvae",
        exposure: "high",
      },
      {
        ticker: "TSN",
        exchange: "NYSE",
        name: "Tyson Foods",
        relevance: "Seafood protein substitution as bivalve supply chains collapse",
        exposure: "medium",
      },
    ],
    polymarket: [
      {
        title: "Will Pacific oyster aquaculture production fall >40% in the US by 2030?",
        relevance: "Ocean acidification threshold — direct aquaculture revenue collapse signal",
        probability: 26,
        url: null,
      },
    ],
  },
};
