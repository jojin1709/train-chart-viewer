/**
 * FIXTURE DATA — NOT LIVE RAILWAY DATA
 *
 * This file contains a small, hand-picked set of real Indian Railways
 * station codes/names used ONLY to demonstrate the RailChart Explorer UI
 * in development mode. It is not a live or complete station database.
 */
import type { Station } from "@/types";

export const FIXTURE_STATIONS: Station[] = [
  // Major junctions - shown first
  { code: "MAS", name: "Chennai Central", routeIndex: 0, distanceKm: 0 },
  { code: "NDLS", name: "New Delhi", routeIndex: 0, distanceKm: 0 },
  { code: "BCT", name: "Mumbai Central", routeIndex: 0, distanceKm: 0 },
  { code: "HWH", name: "Howrah Junction", routeIndex: 0, distanceKm: 0 },
  { code: "SBC", name: "KSR Bengaluru", routeIndex: 0, distanceKm: 0 },
  { code: "SC", name: "Secunderabad Junction", routeIndex: 0, distanceKm: 0 },
  { code: "ADI", name: "Ahmedabad Junction", routeIndex: 0, distanceKm: 0 },
  { code: "PUNE", name: "Pune Junction", routeIndex: 0, distanceKm: 0 },
  { code: "JP", name: "Jaipur Junction", routeIndex: 0, distanceKm: 0 },
  { code: "BPL", name: "Bhopal Junction", routeIndex: 0, distanceKm: 0 },
  { code: "AGC", name: "Agra Cantt", routeIndex: 0, distanceKm: 0 },
  { code: "JHS", name: "Jhansi Junction", routeIndex: 0, distanceKm: 0 },
  { code: "BRC", name: "Vadodara Junction", routeIndex: 0, distanceKm: 0 },
  { code: "NZM", name: "Hazrat Nizamuddin", routeIndex: 0, distanceKm: 0 },
  { code: "DLI", name: "Old Delhi Junction", routeIndex: 0, distanceKm: 0 },
  { code: "SDAH", name: "Sealdah", routeIndex: 0, distanceKm: 0 },
  
  // Kerala stations
  { code: "TVC", name: "Thiruvananthapuram Central", routeIndex: 0, distanceKm: 0 },
  { code: "TVCN", name: "Trivandrum North (Kochuveli)", routeIndex: 0, distanceKm: 0 },
  { code: "KCVL", name: "Kochuveli", routeIndex: 0, distanceKm: 0 },
  { code: "KTYM", name: "Kottayam", routeIndex: 0, distanceKm: 0 },
  { code: "ALLP", name: "Alappuzha", routeIndex: 0, distanceKm: 0 },
  { code: "ERN", name: "Ernakulam Junction", routeIndex: 0, distanceKm: 0 },
  { code: "ERS", name: "Ernakulam Junction (South)", routeIndex: 0, distanceKm: 0 },
  { code: "AWY", name: "Aluva", routeIndex: 0, distanceKm: 0 },
  { code: "TCR", name: "Thrissur", routeIndex: 0, distanceKm: 0 },
  { code: "WKI", name: "Wadakkanchery", routeIndex: 0, distanceKm: 0 },
  { code: "SRR", name: "Shoranur Junction", routeIndex: 0, distanceKm: 0 },
  { code: "PGT", name: "Palakkad Junction", routeIndex: 0, distanceKm: 0 },
  { code: "CBE", name: "Coimbatore Junction", routeIndex: 0, distanceKm: 0 },
  { code: "ED", name: "Erode Junction", routeIndex: 0, distanceKm: 0 },
  { code: "SA", name: "Salem Junction", routeIndex: 0, distanceKm: 0 },
  { code: "JTJ", name: "Jolarpettai Junction", routeIndex: 0, distanceKm: 0 },
  { code: "KPD", name: "Katpadi Junction", routeIndex: 0, distanceKm: 0 },
  
  // Tamil Nadu stations
  { code: "MDU", name: "Madurai Junction", routeIndex: 0, distanceKm: 0 },
  { code: "TPJ", name: "Tiruchirappalli Junction", routeIndex: 0, distanceKm: 0 },
  { code: "TEN", name: "Tirunelveli Junction", routeIndex: 0, distanceKm: 0 },
  { code: "MS", name: "Chennai Egmore", routeIndex: 0, distanceKm: 0 },
  
  // Karnataka stations
  { code: "BNC", name: "Bangalore Cantonment", routeIndex: 0, distanceKm: 0 },
  { code: "MYS", name: "Mysuru Junction", routeIndex: 0, distanceKm: 0 },
  { code: "UBL", name: "Hubballi Junction", routeIndex: 0, distanceKm: 0 },
  { code: "BGM", name: "Belgaum", routeIndex: 0, distanceKm: 0 },
  
  // Andhra Pradesh stations
  { code: "VSKP", name: "Visakhapatnam", routeIndex: 0, distanceKm: 0 },
  { code: "BZA", name: "Vijayawada Junction", routeIndex: 0, distanceKm: 0 },
  { code: "GNT", name: "Guntur Junction", routeIndex: 0, distanceKm: 0 },
  { code: "TPTY", name: "Tirupati", routeIndex: 0, distanceKm: 0 },
  
  // Maharashtra stations
  { code: "CSMT", name: "Mumbai CST", routeIndex: 0, distanceKm: 0 },
  { code: "LTT", name: "Lokmanya Tilak Terminus", routeIndex: 0, distanceKm: 0 },
  { code: "NGP", name: "Nagpur Junction", routeIndex: 0, distanceKm: 0 },
  
  // Uttar Pradesh stations
  { code: "LKO", name: "Lucknow Charbagh", routeIndex: 0, distanceKm: 0 },
  { code: "KOAA", name: "Kolkata Chitpur", routeIndex: 0, distanceKm: 0 },
  { code: "CNB", name: "Kanpur Central", routeIndex: 0, distanceKm: 0 },
  { code: "ALY", name: "Allahabad Junction", routeIndex: 0, distanceKm: 0 },
  
  // Rajasthan stations
  { code: "UDZ", name: "Udaipur City", routeIndex: 0, distanceKm: 0 },
  { code: "JU", name: "Jodhpur Junction", routeIndex: 0, distanceKm: 0 },
  { code: "AII", name: "Ajmer Junction", routeIndex: 0, distanceKm: 0 },
  { code: "BKN", name: "Bikaner Junction", routeIndex: 0, distanceKm: 0 },
  
  // Punjab stations
  { code: "LDH", name: "Ludhiana Junction", routeIndex: 0, distanceKm: 0 },
  { code: "ASR", name: "Amritsar Junction", routeIndex: 0, distanceKm: 0 },
  { code: "PTA", name: "Pathankot Junction", routeIndex: 0, distanceKm: 0 },
  
  // Madhya Pradesh stations
  { code: "UJN", name: "Ujjain Junction", routeIndex: 0, distanceKm: 0 },
  { code: "INDB", name: "Indore Junction", routeIndex: 0, distanceKm: 0 },
  { code: "GWL", name: "Gwalior Junction", routeIndex: 0, distanceKm: 0 },
  
  // Gujarat stations
  { code: "ST", name: "Surat", routeIndex: 0, distanceKm: 0 },
  { code: "RTM", name: "Ratlam Junction", routeIndex: 0, distanceKm: 0 },
  
  // West Bengal stations
  { code: "BWN", name: "Barddhaman Junction", routeIndex: 0, distanceKm: 0 },
  { code: "RNC", name: "Ranchi Junction", routeIndex: 0, distanceKm: 0 },
  { code: "HTE", name: "Hatia", routeIndex: 0, distanceKm: 0 },
  { code: "TATA", name: "Tatanagar Junction", routeIndex: 0, distanceKm: 0 },
  { code: "DGR", name: "Durgapur", routeIndex: 0, distanceKm: 0 },
  { code: "CKP", name: "Chakradharpur", routeIndex: 0, distanceKm: 0 },
  { code: "BSP", name: "Bilaspur Junction", routeIndex: 0, distanceKm: 0 },
  { code: "R", name: "Raipur Junction", routeIndex: 0, distanceKm: 0 },
];

export function searchStationsFixture(query: string): Station[] {
  const q = query.trim().toLowerCase();
  if (!q) return FIXTURE_STATIONS.slice(0, 20);
  return FIXTURE_STATIONS.filter(
    (s) => s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
  ).slice(0, 15);
}
