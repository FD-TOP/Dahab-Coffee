const BOUNDS = { minLng: -10.15, maxLng: -1.35, minLat: 30.85, maxLat: 36.15 };

export const MAP_W = 640;
export const MAP_H = 520;

function project(lat, lng) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * MAP_W;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * MAP_H;
  return [x, y];
}

const coast = [
  [35.97, -5.78],
  [35.8, -5.98],
  [35.48, -6.1],
  [35.12, -6.3],
  [34.62, -6.58],
  [34.25, -6.72],
  [33.98, -6.95],
  [33.7, -7.4],
  [33.5, -7.78],
  [33.2, -8.58],
  [32.55, -9.15],
  [31.85, -9.55],
  [31.2, -9.7],
  [30.98, -8.6],
  [30.98, -6.4],
  [31.05, -4.4],
  [31.15, -2.6],
  [31.55, -1.7],
  [32.4, -1.5],
  [33.4, -1.75],
  [34.3, -1.95],
  [35.05, -2.3],
  [35.22, -3.15],
  [35.3, -3.95],
  [35.42, -4.75],
  [35.58, -5.08],
  [35.75, -5.3],
  [35.92, -5.38],
  [35.97, -5.78],
];

export const moroccoPath = `${coast
  .map(([lat, lng], index) => {
    const [x, y] = project(lat, lng);
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  })
  .join(" ")} Z`;

const rawPlaces = [
  { city: "Marrakech", lat: 31.63, lng: -8.009, ar: "مراكش", en: "Marrakech", side: "e" },
  { city: "Casablanca", lat: 33.573, lng: -7.589, ar: "الدار البيضاء", en: "Casablanca", side: "e" },
  { city: "Rabat", lat: 34.021, lng: -6.842, ar: "الرباط", en: "Rabat", side: "w" },
  { city: "El Jadida", lat: 33.232, lng: -8.501, ar: "الجديدة", en: "El Jadida", side: "e" },
  { city: "Kénitra", lat: 34.261, lng: -6.58, ar: "القنيطرة", en: "Kenitra", side: "w" },
  { city: "Meknès", lat: 33.894, lng: -5.555, ar: "مكناس", en: "Meknes", side: "s" },
  { city: "Fès", lat: 34.033, lng: -5, ar: "فاس", en: "Fez", side: "e" },
  { city: "Tanger", lat: 35.767, lng: -5.8, ar: "طنجة", en: "Tangier", side: "w", nudge: [-16, 22] },
  { city: "Tetouan", lat: 35.572, lng: -5.368, ar: "تطوان", en: "Tetouan", side: "s", nudge: [-6, 34] },
  { city: "Larache", lat: 35.193, lng: -6.156, ar: "العرائش", en: "Larache", side: "w" },
  { city: "Martil", lat: 35.617, lng: -5.275, ar: "مرتيل", en: "Martil", side: "e", nudge: [30, 10] },
  { city: "M'diq - Findeq", lat: 35.685, lng: -5.33, ar: "المضيق", en: "M'diq", side: "n", nudge: [18, -8] },
  { city: "Chefchaouen", lat: 35.171, lng: -5.269, ar: "شفشاون", en: "Chefchaouen", side: "e", nudge: [10, 8] },
  { city: "Al Hoceima", lat: 35.245, lng: -3.932, ar: "الحسيمة", en: "Al Hoceima", side: "e", nudge: [0, 14] },
];

export const places = rawPlaces.map((place) => {
  const [x, y] = project(place.lat, place.lng);
  return {
    ...place,
    x: x + (place.nudge?.[0] || 0),
    y: y + (place.nudge?.[1] || 0),
  };
});

export function placeName(city, lang) {
  const place = places.find((item) => item.city === city);
  if (!place) return city;
  if (lang === "ar") return place.ar;
  if (lang === "en") return place.en;
  return place.city;
}
