const rawPlaces = [
  { city: "Tanger", x: 70, y: 18, ar: "طنجة", en: "Tangier", side: "w" },
  { city: "M'diq - Findeq", x: 76, y: 15, ar: "المضيق", en: "M'diq", side: "n", pin: { fr: "M'diq", en: "M'diq" } },
  { city: "Martil", x: 83, y: 20, ar: "مرتيل", en: "Martil", side: "e" },
  { city: "Tetouan", x: 68, y: 25, ar: "تطوان", en: "Tetouan", side: "w" },
  { city: "Larache", x: 60, y: 30, ar: "العرائش", en: "Larache", side: "w" },
  { city: "Chefchaouen", x: 74, y: 34, ar: "شفشاون", en: "Chefchaouen", side: "s" },
  { city: "Al Hoceima", x: 84, y: 28, ar: "الحسيمة", en: "Al Hoceima", side: "e" },
  { city: "Kénitra", x: 56, y: 38, ar: "القنيطرة", en: "Kenitra", side: "w" },
  { city: "Rabat", x: 54, y: 44, ar: "الرباط", en: "Rabat", side: "w" },
  { city: "Meknès", x: 62, y: 46, ar: "مكناس", en: "Meknes", side: "e" },
  { city: "Fès", x: 70, y: 40, ar: "فاس", en: "Fez", side: "e" },
  { city: "Casablanca", x: 43, y: 50, ar: "الدار البيضاء", en: "Casablanca", side: "w" },
  { city: "El Jadida", x: 34, y: 58, ar: "الجديدة", en: "El Jadida", side: "w" },
  { city: "Marrakech", x: 28, y: 70, ar: "مراكش", en: "Marrakech", side: "e" },
];

export const places = rawPlaces;

export function placeName(city, lang) {
  const place = places.find((item) => item.city === city);
  if (!place) return city;
  if (lang === "ar") return place.ar;
  if (lang === "en") return place.en;
  return place.city;
}

export function pinLabel(city, lang) {
  const place = places.find((item) => item.city === city);
  return place?.pin?.[lang] || placeName(city, lang);
}
