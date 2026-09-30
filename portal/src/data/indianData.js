/**
 * Official Indian Real Estate Reference Data & Benchmarks
 * Categorized into Metro Cities (with active Metro Rail infrastructure)
 * and Non-Metro Cities (Tier-2 & Tier-3 Regional Hubs & Towns)
 */

export const METRO_CITIES = [
  {
    id: "bengaluru",
    name: "Bengaluru",
    state: "Karnataka",
    category: "metro",
    hasMetro: true,
    avgRateSqft: 6850,
    baseGrowth: "8.4% YoY",
    localities: [
      { name: "Whitefield", avgRate: 6450, tier: "IT Corridor / Purple Line" },
      { name: "Electronic City", avgRate: 4850, tier: "Tech Hub / Yellow Line" },
      { name: "Indiranagar", avgRate: 14200, tier: "Prime Residential / Metro Station" },
      { name: "Koramangala", avgRate: 13500, tier: "Commercial & Premium" },
      { name: "HSR Layout", avgRate: 9200, tier: "Startup Corridor" },
      { name: "Hebbal", avgRate: 8800, tier: "North Airport Corridor" },
      { name: "Bellandur", avgRate: 7600, tier: "Outer Ring Road IT Zone" },
      { name: "Sarjapur Road", avgRate: 6700, tier: "Suburban Tech Belt" },
      { name: "Yelahanka", avgRate: 5900, tier: "North Growth Hub" },
      { name: "Jayanagar", avgRate: 12800, tier: "Traditional Prime / Green Line" },
      { name: "JP Nagar", avgRate: 8100, tier: "South Residential / Green Line" },
      { name: "Rajaji Nagar", avgRate: 11500, tier: "West Central / Green Line" },
      { name: "Thanisandra", avgRate: 6300, tier: "North Tech Zone" },
      { name: "Marathahalli", avgRate: 6100, tier: "East Transit Node" },
      { name: "Other Localities", avgRate: 5400, tier: "General Zone" },
    ],
  },
  {
    id: "mumbai",
    name: "Mumbai (MMR)",
    state: "Maharashtra",
    category: "metro",
    hasMetro: true,
    avgRateSqft: 19500,
    baseGrowth: "6.2% YoY",
    localities: [
      { name: "Bandra West", avgRate: 45000, tier: "Ultra Luxury / Coastal" },
      { name: "Worli", avgRate: 38000, tier: "South Mumbai Luxury" },
      { name: "Juhu", avgRate: 36000, tier: "Coastal Luxury / Prime" },
      { name: "Powai", avgRate: 19500, tier: "Suburban Tech Hub / Metro Line 6" },
      { name: "Andheri West", avgRate: 22000, tier: "Commercial Hub / Metro Line 1 & 2A" },
      { name: "Dadar", avgRate: 27500, tier: "Central City Transit Hub" },
      { name: "Malad West", avgRate: 15800, tier: "Western Suburb / Metro Line 2A" },
      { name: "Borivali West", avgRate: 16500, tier: "Residential / Metro Line 2A & 7" },
      { name: "Thane West", avgRate: 11200, tier: "Metropolitan Region / Metro Line 4" },
      { name: "Navi Mumbai (Kharghar)", avgRate: 9400, tier: "Navi Mumbai Metro Line 1" },
      { name: "Other Localities", avgRate: 14000, tier: "General MMR" },
    ],
  },
  {
    id: "delhi",
    name: "Delhi-NCR",
    state: "Delhi / Haryana / UP",
    category: "metro",
    hasMetro: true,
    avgRateSqft: 9800,
    baseGrowth: "7.1% YoY",
    localities: [
      { name: "Greater Kailash", avgRate: 21000, tier: "South Delhi Prime / Magenta Line" },
      { name: "Vasant Kunj", avgRate: 18500, tier: "Institutional Prime" },
      { name: "Saket", avgRate: 16200, tier: "South Hub / Yellow Line" },
      { name: "Dwarka", avgRate: 9800, tier: "Sub-City / Blue Line & Airport Express" },
      { name: "Rohini", avgRate: 8500, tier: "North Sub-City / Red Line" },
      { name: "Gurgaon Golf Course Ext", avgRate: 15400, tier: "Millennium Corridor / Rapid Metro" },
      { name: "Gurgaon Cyber City", avgRate: 14200, tier: "Corporate Hub / Rapid Metro" },
      { name: "Noida Sector 62", avgRate: 7200, tier: "Institutional Tech / Blue Line" },
      { name: "Noida Expressway", avgRate: 8400, tier: "Expressway / Aqua Line" },
      { name: "Other Localities", avgRate: 6900, tier: "NCR Perimeter" },
    ],
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    category: "metro",
    hasMetro: true,
    avgRateSqft: 7200,
    baseGrowth: "10.5% YoY",
    localities: [
      { name: "Banjara Hills", avgRate: 14500, tier: "Prime Heritage" },
      { name: "Jubilee Hills", avgRate: 15200, tier: "Ultra Prime / Blue Line" },
      { name: "Hitec City", avgRate: 9400, tier: "Cyberabad Core / Blue Line" },
      { name: "Gachibowli", avgRate: 8600, tier: "Financial District Corridor" },
      { name: "Madhapur", avgRate: 8900, tier: "IT Central / Blue Line" },
      { name: "Kondapur", avgRate: 7800, tier: "West Residential Hub" },
      { name: "Kukatpally", avgRate: 6500, tier: "Established Hub / Red Line" },
      { name: "Miyapur", avgRate: 5300, tier: "Metro Terminal / Red Line" },
      { name: "Other Localities", avgRate: 5100, tier: "Outer Growth Belt" },
    ],
  },
  {
    id: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    category: "metro",
    hasMetro: true,
    avgRateSqft: 7400,
    baseGrowth: "5.8% YoY",
    localities: [
      { name: "Boat Club / Poes Garden", avgRate: 24000, tier: "Ultra Prime" },
      { name: "Adyar", avgRate: 13500, tier: "South Coastal Prime" },
      { name: "Anna Nagar", avgRate: 12800, tier: "North West Prime / Green Line" },
      { name: "T. Nagar", avgRate: 14200, tier: "Commercial Centre" },
      { name: "Velachery", avgRate: 7800, tier: "South Transit Hub" },
      { name: "OMR - Thoraipakkam", avgRate: 6400, tier: "IT Expressway / Metro Phase 2" },
      { name: "Sholinganallur", avgRate: 5600, tier: "SEZ Corridor / Metro Phase 2" },
      { name: "Porur", avgRate: 6100, tier: "West Growth Hub / Metro Phase 2" },
      { name: "Other Localities", avgRate: 4900, tier: "Suburban Belt" },
    ],
  },
  {
    id: "pune",
    name: "Pune",
    state: "Maharashtra",
    category: "metro",
    hasMetro: true,
    avgRateSqft: 7100,
    baseGrowth: "7.8% YoY",
    localities: [
      { name: "Koregaon Park", avgRate: 14000, tier: "Heritage Luxury" },
      { name: "Kothrud", avgRate: 11200, tier: "Prime West / Aqua Line" },
      { name: "Baner", avgRate: 8600, tier: "IT Residential / Line 3 Corridor" },
      { name: "Viman Nagar", avgRate: 9200, tier: "Airport Corridor / Aqua Line" },
      { name: "Wakad", avgRate: 6800, tier: "Hinjawadi Gateway / Line 3" },
      { name: "Hinjawadi", avgRate: 5900, tier: "Infotech Park / Line 3" },
      { name: "Kharadi", avgRate: 7800, tier: "EON IT Corridor" },
      { name: "Hadapsar", avgRate: 6400, tier: "Magarpatta City" },
      { name: "Other Localities", avgRate: 5200, tier: "Periphery" },
    ],
  },
  {
    id: "kolkata",
    name: "Kolkata",
    state: "West Bengal",
    category: "metro",
    hasMetro: true,
    avgRateSqft: 5600,
    baseGrowth: "4.9% YoY",
    localities: [
      { name: "Alipore / Ballygunge", avgRate: 14500, tier: "South Heritage Prime" },
      { name: "Salt Lake (Bidhannagar)", avgRate: 7800, tier: "Planned Tech City / Green Line" },
      { name: "New Town (Rajarhat)", avgRate: 5800, tier: "Smart City Node / Orange Line" },
      { name: "EM Bypass Corridor", avgRate: 7400, tier: "Arterial Corridor" },
      { name: "Behala", avgRate: 4400, tier: "South Established / Purple Line" },
      { name: "Garia", avgRate: 4200, tier: "Metro Terminal / Blue Line" },
      { name: "Other Localities", avgRate: 3800, tier: "Greater Kolkata" },
    ],
  },
  {
    id: "ahmedabad",
    name: "Ahmedabad",
    state: "Gujarat",
    category: "metro",
    hasMetro: true,
    avgRateSqft: 5400,
    baseGrowth: "8.1% YoY",
    localities: [
      { name: "Bodakdev / SG Highway", avgRate: 9200, tier: "Prime Commercial / Metro Line" },
      { name: "Satellite", avgRate: 8400, tier: "Established Residential" },
      { name: "Prahlad Nagar", avgRate: 7800, tier: "Premium Residential" },
      { name: "Vastrapur", avgRate: 7500, tier: "Central West Hub" },
      { name: "GIFT City / Gandhinagar", avgRate: 6800, tier: "International Financial Tech Hub" },
      { name: "Bopal / South Bopal", avgRate: 4800, tier: "Growth Suburb" },
      { name: "Other Localities", avgRate: 4200, tier: "General Zone" },
    ],
  },
  {
    id: "kochi",
    name: "Kochi (Cochin)",
    state: "Kerala",
    category: "metro",
    hasMetro: true,
    avgRateSqft: 5800,
    baseGrowth: "6.5% YoY",
    localities: [
      { name: "Marine Drive / Panampilly Nagar", avgRate: 11500, tier: "Waterfront Prime" },
      { name: "Edappally", avgRate: 7200, tier: "Kochi Metro Central Hub" },
      { name: "Kaloor / Palarivattom", avgRate: 6800, tier: "Transit Corridor" },
      { name: "Kakkanad (Infopark)", avgRate: 5400, tier: "IT SEZ Corridor" },
      { name: "Aluva", avgRate: 4500, tier: "Metro Terminal Zone" },
      { name: "Other Localities", avgRate: 4100, tier: "Greater Kochi" },
    ],
  },
  {
    id: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    category: "metro",
    hasMetro: true,
    avgRateSqft: 4900,
    baseGrowth: "7.0% YoY",
    localities: [
      { name: "C-Scheme / Civil Lines", avgRate: 11200, tier: "Heritage Prime" },
      { name: "Vaishali Nagar", avgRate: 6200, tier: "Established Residential" },
      { name: "Mansarovar", avgRate: 4900, tier: "Jaipur Metro Pink Line Hub" },
      { name: "Jagatpura", avgRate: 4400, tier: "Airport Expansion Hub" },
      { name: "Ajmer Road Corridor", avgRate: 3800, tier: "Growth Corridor" },
      { name: "Other Localities", avgRate: 3500, tier: "Outer Perimeter" },
    ],
  },
  {
    id: "lucknow",
    name: "Lucknow",
    state: "Uttar Pradesh",
    category: "metro",
    hasMetro: true,
    avgRateSqft: 4600,
    baseGrowth: "6.8% YoY",
    localities: [
      { name: "Gomti Nagar / Gomti Nagar Ext", avgRate: 7200, tier: "Prime Residential & IT" },
      { name: "Hazratganj / Mahanagar", avgRate: 8500, tier: "Central Heritage" },
      { name: "Alambagh / Charbagh", avgRate: 5200, tier: "Lucknow Metro Red Line" },
      { name: "Indira Nagar", avgRate: 4900, tier: "Established Residential" },
      { name: "Shaheed Path / Amar Shaheed", avgRate: 4200, tier: "Growth Corridor" },
      { name: "Other Localities", avgRate: 3600, tier: "Suburban Belt" },
    ],
  },
];

import { ALL_INDIA_NON_METRO_DISTRICTS } from './allIndiaDistricts';

export const NON_METRO_CITIES = ALL_INDIA_NON_METRO_DISTRICTS;

// List of unique Non-Metro Indian States across all 28 States and 8 UTs
export const NON_METRO_STATES = Array.from(
  new Set(NON_METRO_CITIES.map((c) => c.state))
).sort();

// Helper to filter districts by selected state
export function getDistrictsByState(stateName) {
  if (!stateName) return NON_METRO_CITIES;
  return NON_METRO_CITIES.filter((c) => c.state === stateName);
}

// Unified Indian cities array
export const INDIAN_CITIES = [...METRO_CITIES, ...NON_METRO_CITIES];

export const AREA_TYPES = [
  { value: "Super built-up  Area", label: "Super Built-up Area (Includes common spaces, lobby, lifts)" },
  { value: "Built-up  Area", label: "Built-up Area (Outer wall-to-wall footprint + balcony)" },
  { value: "Plot  Area", label: "Plot / Independent House Area" },
  { value: "Carpet  Area", label: "Carpet Area (RERA Standard - usable inner floor area)" },
];

export const AVAILABILITY_OPTIONS = [
  { value: "Ready To Move", label: "Ready to Move (Possession Immediate)" },
  { value: "Under Construction", label: "Under Construction (Possession in 6-24 Months)" },
];

export const CITY_TRENDS_COMPARISON = [
  // Metro Cities (with Metro Rail)
  { city: "Mumbai (MMR)", category: "Metro", avgRateSqft: 19500, avg2BhkLakhs: 145, yoyGrowth: 6.2, state: "Maharashtra" },
  { city: "Delhi-NCR", category: "Metro", avgRateSqft: 9800, avg2BhkLakhs: 88, yoyGrowth: 7.1, state: "Delhi / Haryana / UP" },
  { city: "Chennai", category: "Metro", avgRateSqft: 7400, avg2BhkLakhs: 68, yoyGrowth: 5.8, state: "Tamil Nadu" },
  { city: "Hyderabad", category: "Metro", avgRateSqft: 7200, avg2BhkLakhs: 72, yoyGrowth: 10.5, state: "Telangana" },
  { city: "Pune", category: "Metro", avgRateSqft: 7100, avg2BhkLakhs: 64, yoyGrowth: 7.8, state: "Maharashtra" },
  { city: "Bengaluru", category: "Metro", avgRateSqft: 6850, avg2BhkLakhs: 68, yoyGrowth: 8.4, state: "Karnataka" },
  { city: "Kochi", category: "Metro", avgRateSqft: 5800, avg2BhkLakhs: 58, yoyGrowth: 6.5, state: "Kerala" },
  { city: "Kolkata", category: "Metro", avgRateSqft: 5600, avg2BhkLakhs: 48, yoyGrowth: 4.9, state: "West Bengal" },
  { city: "Ahmedabad", category: "Metro", avgRateSqft: 5400, avg2BhkLakhs: 54, yoyGrowth: 8.1, state: "Gujarat" },
  { city: "Jaipur", category: "Metro", avgRateSqft: 4900, avg2BhkLakhs: 49, yoyGrowth: 7.0, state: "Rajasthan" },
  { city: "Lucknow", category: "Metro", avgRateSqft: 4600, avg2BhkLakhs: 46, yoyGrowth: 6.8, state: "Uttar Pradesh" },

  // Non-Metro Cities (without Metro Rail)
  { city: "Chandigarh Tricity", category: "Non-Metro", avgRateSqft: 7500, avg2BhkLakhs: 75, yoyGrowth: 8.0, state: "Chandigarh/Punjab/Haryana" },
  { city: "Surat", category: "Non-Metro", avgRateSqft: 5800, avg2BhkLakhs: 58, yoyGrowth: 8.8, state: "Gujarat" },
  { city: "Patna", category: "Non-Metro", avgRateSqft: 5600, avg2BhkLakhs: 56, yoyGrowth: 6.9, state: "Bihar" },
  { city: "Thiruvananthapuram", category: "Non-Metro", avgRateSqft: 5500, avg2BhkLakhs: 55, yoyGrowth: 7.3, state: "Kerala" },
  { city: "Visakhapatnam", category: "Non-Metro", avgRateSqft: 5400, avg2BhkLakhs: 54, yoyGrowth: 8.6, state: "Andhra Pradesh" },
  { city: "Coimbatore", category: "Non-Metro", avgRateSqft: 5200, avg2BhkLakhs: 52, yoyGrowth: 8.2, state: "Tamil Nadu" },
  { city: "Dehradun", category: "Non-Metro", avgRateSqft: 5100, avg2BhkLakhs: 51, yoyGrowth: 8.5, state: "Uttarakhand" },
  { city: "Bhubaneswar", category: "Non-Metro", avgRateSqft: 5100, avg2BhkLakhs: 51, yoyGrowth: 8.3, state: "Odisha" },
  { city: "Vijayawada", category: "Non-Metro", avgRateSqft: 4900, avg2BhkLakhs: 49, yoyGrowth: 7.2, state: "Andhra Pradesh" },
  { city: "Kozhikode", category: "Non-Metro", avgRateSqft: 4900, avg2BhkLakhs: 49, yoyGrowth: 6.8, state: "Kerala" },
  { city: "Mangaluru", category: "Non-Metro", avgRateSqft: 4800, avg2BhkLakhs: 48, yoyGrowth: 6.4, state: "Karnataka" },
  { city: "Ludhiana", category: "Non-Metro", avgRateSqft: 4800, avg2BhkLakhs: 48, yoyGrowth: 7.0, state: "Punjab" },
  { city: "Indore", category: "Non-Metro", avgRateSqft: 4700, avg2BhkLakhs: 47, yoyGrowth: 9.1, state: "Madhya Pradesh" },
  { city: "Guwahati", category: "Non-Metro", avgRateSqft: 4700, avg2BhkLakhs: 47, yoyGrowth: 6.8, state: "Assam" },
  { city: "Nagpur", category: "Non-Metro", avgRateSqft: 4600, avg2BhkLakhs: 46, yoyGrowth: 7.1, state: "Maharashtra" },
  { city: "Udaipur", category: "Non-Metro", avgRateSqft: 4600, avg2BhkLakhs: 46, yoyGrowth: 7.4, state: "Rajasthan" },
  { city: "Rajkot", category: "Non-Metro", avgRateSqft: 4600, avg2BhkLakhs: 46, yoyGrowth: 7.5, state: "Gujarat" },
  { city: "Varanasi", category: "Non-Metro", avgRateSqft: 4500, avg2BhkLakhs: 45, yoyGrowth: 7.8, state: "Uttar Pradesh" },
  { city: "Meerut", category: "Non-Metro", avgRateSqft: 4500, avg2BhkLakhs: 45, yoyGrowth: 7.9, state: "Uttar Pradesh" },
  { city: "Amritsar", category: "Non-Metro", avgRateSqft: 4500, avg2BhkLakhs: 45, yoyGrowth: 6.7, state: "Punjab" },
  { city: "Nashik", category: "Non-Metro", avgRateSqft: 4400, avg2BhkLakhs: 44, yoyGrowth: 6.8, state: "Maharashtra" },
  { city: "Tirupati", category: "Non-Metro", avgRateSqft: 4400, avg2BhkLakhs: 44, yoyGrowth: 7.6, state: "Andhra Pradesh" },
  { city: "Vadodara", category: "Non-Metro", avgRateSqft: 4300, avg2BhkLakhs: 43, yoyGrowth: 6.7, state: "Gujarat" },
  { city: "Prayagraj", category: "Non-Metro", avgRateSqft: 4300, avg2BhkLakhs: 43, yoyGrowth: 6.6, state: "Uttar Pradesh" },
  { city: "Jamshedpur", category: "Non-Metro", avgRateSqft: 4300, avg2BhkLakhs: 43, yoyGrowth: 6.3, state: "Jharkhand" },
  { city: "Mysuru", category: "Non-Metro", avgRateSqft: 4200, avg2BhkLakhs: 42, yoyGrowth: 7.5, state: "Karnataka" },
  { city: "Raipur", category: "Non-Metro", avgRateSqft: 4200, avg2BhkLakhs: 42, yoyGrowth: 7.7, state: "Chhattisgarh" },
  { city: "Ranchi", category: "Non-Metro", avgRateSqft: 4200, avg2BhkLakhs: 42, yoyGrowth: 6.1, state: "Jharkhand" },
  { city: "Cuttack", category: "Non-Metro", avgRateSqft: 4200, avg2BhkLakhs: 42, yoyGrowth: 6.2, state: "Odisha" },
  { city: "Madurai", category: "Non-Metro", avgRateSqft: 4100, avg2BhkLakhs: 41, yoyGrowth: 5.4, state: "Tamil Nadu" },
  { city: "Agra", category: "Non-Metro", avgRateSqft: 4100, avg2BhkLakhs: 41, yoyGrowth: 6.2, state: "Uttar Pradesh" },
  { city: "Chhatrapati Sambhajinagar", category: "Non-Metro", avgRateSqft: 3900, avg2BhkLakhs: 39, yoyGrowth: 6.5, state: "Maharashtra" },
  { city: "Jodhpur", category: "Non-Metro", avgRateSqft: 3900, avg2BhkLakhs: 39, yoyGrowth: 6.1, state: "Rajasthan" },
  { city: "Bhopal", category: "Non-Metro", avgRateSqft: 3800, avg2BhkLakhs: 38, yoyGrowth: 6.2, state: "Madhya Pradesh" },
  { city: "Trichy", category: "Non-Metro", avgRateSqft: 3800, avg2BhkLakhs: 38, yoyGrowth: 5.1, state: "Tamil Nadu" },
  { city: "Salem", category: "Non-Metro", avgRateSqft: 3700, avg2BhkLakhs: 37, yoyGrowth: 5.7, state: "Tamil Nadu" },
  { city: "Hubballi-Dharwad", category: "Non-Metro", avgRateSqft: 3600, avg2BhkLakhs: 36, yoyGrowth: 6.0, state: "Karnataka" },
  { city: "Gwalior", category: "Non-Metro", avgRateSqft: 3600, avg2BhkLakhs: 36, yoyGrowth: 5.8, state: "Madhya Pradesh" },
  { city: "Jabalpur", category: "Non-Metro", avgRateSqft: 3500, avg2BhkLakhs: 35, yoyGrowth: 5.6, state: "Madhya Pradesh" },
  { city: "Belagavi", category: "Non-Metro", avgRateSqft: 3400, avg2BhkLakhs: 34, yoyGrowth: 5.5, state: "Karnataka" },
  { city: "Shivamogga", category: "Non-Metro", avgRateSqft: 3300, avg2BhkLakhs: 33, yoyGrowth: 5.9, state: "Karnataka" },
];

export const TOP_LOCALITIES_INDIA = [
  { locality: "Bandra West (Mumbai)", rate: 45000, city: "Mumbai" },
  { locality: "Worli (Mumbai)", rate: 38000, city: "Mumbai" },
  { locality: "Boat Club (Chennai)", rate: 24000, city: "Chennai" },
  { locality: "Andheri West (Mumbai)", rate: 22000, city: "Mumbai" },
  { locality: "Greater Kailash (Delhi)", rate: 21000, city: "Delhi-NCR" },
  { locality: "Sector 9 (Chandigarh)", rate: 18500, city: "Chandigarh" },
  { locality: "Vasant Kunj (Delhi)", rate: 18500, city: "Delhi-NCR" },
  { locality: "Jubilee Hills (Hyderabad)", rate: 15200, city: "Hyderabad" },
  { locality: "Alipore (Kolkata)", rate: 14500, city: "Kolkata" },
  { locality: "Indiranagar (Bengaluru)", rate: 14200, city: "Bengaluru" },
  { locality: "Koregaon Park (Pune)", rate: 14000, city: "Pune" },
  { locality: "Race Course (Coimbatore)", rate: 9800, city: "Coimbatore" },
];

export const INDIAN_MODEL_BENCHMARKS = [
  {
    model: "Gradient Boosting Regressor",
    r2: 0.9713,
    rmseLakhs: 10.74,
    maeLakhs: 7.66,
    cvScore: 0.9771,
    trainTime: "1.82s",
    isChampion: true,
    tier: "Primary Production Model",
  },
  {
    model: "XGBoost Regressor",
    r2: 0.9712,
    rmseLakhs: 10.76,
    maeLakhs: 7.69,
    cvScore: 0.9772,
    trainTime: "1.15s",
    isChampion: false,
    tier: "High Performance Ensemble",
  },
  {
    model: "Random Forest (800 Trees)",
    r2: 0.9640,
    rmseLakhs: 12.03,
    maeLakhs: 8.55,
    cvScore: 0.9711,
    trainTime: "2.40s",
    isChampion: false,
    tier: "Bagged Forest",
  },
  {
    model: "Lasso Regression (L1)",
    r2: 0.8955,
    rmseLakhs: 20.51,
    maeLakhs: 11.84,
    cvScore: 0.9333,
    trainTime: "0.08s",
    isChampion: false,
    tier: "Sparse Linear",
  },
  {
    model: "Ridge Regression (L2)",
    r2: 0.8942,
    rmseLakhs: 20.64,
    maeLakhs: 11.74,
    cvScore: 0.9345,
    trainTime: "0.02s",
    isChampion: false,
    tier: "Regularized Linear",
  },
  {
    model: "Linear Regression (OLS)",
    r2: 0.8941,
    rmseLakhs: 20.65,
    maeLakhs: 11.74,
    cvScore: 0.9345,
    trainTime: "0.01s",
    isChampion: false,
    tier: "Baseline Model",
  },
];

export const INDIAN_PRICE_HISTOGRAM = [
  { range: "Under ₹30 L", count: 1850, pct: "14.2%" },
  { range: "₹30 L - ₹60 L", count: 4620, pct: "35.5%" },
  { range: "₹60 L - ₹1 Cr", count: 3540, pct: "27.2%" },
  { range: "₹1 Cr - ₹1.5 Cr", count: 1820, pct: "14.0%" },
  { range: "₹1.5 Cr - ₹2.5 Cr", count: 860, pct: "6.6%" },
  { range: "₹2.5 Cr+", count: 310, pct: "2.5%" },
];

export const BHK_DISTRIBUTION = [
  { bhk: "1 BHK", count: 1420, avgPriceLakhs: 32.5 },
  { bhk: "2 BHK", count: 5980, avgPriceLakhs: 64.0 },
  { bhk: "3 BHK", count: 4610, avgPriceLakhs: 118.5 },
  { bhk: "4 BHK", count: 850, avgPriceLakhs: 245.0 },
  { bhk: "5+ BHK", count: 140, avgPriceLakhs: 410.0 },
];

export const INDIAN_SCATTER_SAMPLES = [
  { sqft: 650, priceLakhs: 34.0, bhk: 1 },
  { sqft: 850, priceLakhs: 45.0, bhk: 2 },
  { sqft: 1050, priceLakhs: 58.0, bhk: 2 },
  { sqft: 1200, priceLakhs: 72.0, bhk: 2 },
  { sqft: 1350, priceLakhs: 85.0, bhk: 3 },
  { sqft: 1550, priceLakhs: 105.0, bhk: 3 },
  { sqft: 1800, priceLakhs: 135.0, bhk: 3 },
  { sqft: 2100, priceLakhs: 175.0, bhk: 3 },
  { sqft: 2450, priceLakhs: 220.0, bhk: 4 },
  { sqft: 2800, priceLakhs: 275.0, bhk: 4 },
  { sqft: 3400, priceLakhs: 360.0, bhk: 4 },
  { sqft: 4200, priceLakhs: 490.0, bhk: 5 },
];

export const INDIAN_FAQS = [
  {
    question: "Is this estimate an official legal valuation for Indian bank home loans?",
    answer:
      "No. This portal produces indicative machine learning valuations based on historical property transaction registry data and structural attributes. Indian financial institutions require an official on-site valuation inspection conducted by an empaneled chartered surveyor / valuer.",
  },
  {
    question: "What is RERA and why should buyers verify project registration?",
    answer:
      "The Real Estate (Regulation and Development) Act (RERA), 2016, is a statutory framework enacted by the Parliament of India to protect home buyers and boost real estate investments. Buyers must verify the developer's state RERA registration number (e.g., MahaRERA, K-RERA, UP-RERA) before executing any purchase agreement.",
  },
  {
    question: "Why does the builder's quote differ from this ML estimate?",
    answer:
      "Builder quotations often include floor rise charges, preferred location charges (PLC), clubhouse/amenity premiums, GST (5% for standard housing, 1% for affordable), and future infrastructure premiums that may not be reflected in historical base transactions.",
  },
  {
    question: "What is the difference between Carpet Area and Super Built-up Area?",
    answer:
      "Carpet Area is the actual net usable floor area inside the apartment walls (RERA mandatory standard). Built-up Area adds the thickness of walls and balcony space. Super Built-up Area adds proportionate shares of common amenities (lifts, staircases, lobbies, clubhouse) — typically 20% to 30% larger than carpet area.",
  },
  {
    question: "How are the Machine Learning models trained on Indian housing data?",
    answer:
      "Models are trained on verified Indian housing transaction records (including the 13,320-record Bengaluru House Price dataset). Preprocessing includes converting total_sqft ranges, imputing missing balcony/bathroom counts, filtering extreme price per sqft outliers (< 300 sq.ft per BHK), and applying log-normal target transformations.",
  },
];
