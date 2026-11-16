export const flavors = [
  { id: "oreo", label: "Oreo", image: "/flavors/flavor-oreo.jpg", keys: ["oreo"] },
  { id: "fraise", label: "Fraise", image: "/flavors/flavor-fraise.jpg", keys: ["fraise", "strawberry", "red berry"] },
  { id: "mangue", label: "Mangue", image: "/flavors/flavor-mangue.jpg", keys: ["mangue", "mango", "sunrise", "tropical"] },
  { id: "menthe", label: "Menthe", image: "/flavors/flavor-menthe.jpg", keys: ["mojito", "menthe"] },
  { id: "peche", label: "Pêche", image: "/flavors/flavor-peche.jpg", keys: ["pêche", "peche"] },
  { id: "ananas", label: "Ananas", image: "/flavors/flavor-ananas.jpg", keys: ["colada", "ananas", "golden"] },
  { id: "detox", label: "Detox", image: "/flavors/flavor-detox.jpg", keys: ["detox", "kiwi"] },
  { id: "banane", label: "Banane", image: "/flavors/flavor-banane.jpg", keys: ["banane", "dattes"] },
  { id: "chai", label: "Chaï", image: "/flavors/flavor-chai.jpg", keys: ["chai"] },
  { id: "caramel", label: "Caramel", image: "/flavors/flavor-caramel.jpg", keys: ["caramel"] },
  { id: "vanille", label: "Vanille", image: "/flavors/flavor-vanille.jpg", keys: ["vanille", "vanilla"] },
  { id: "noisette", label: "Noisette", image: "/flavors/flavor-noisette.jpg", keys: ["noisette", "noix"] },
  { id: "cookie", label: "Cookie", image: "/flavors/flavor-cookie.jpg", keys: ["cookie", "macaron"] },
  { id: "miel", label: "Miel", image: "/flavors/flavor-miel.jpg", keys: ["miel"] },
  { id: "chocolat", label: "Chocolat", image: "/flavors/flavor-chocolat.jpg", keys: ["chocolat", "choco", "brownie", "moka", "mocha"] },
  { id: "citron", label: "Citron", image: "/flavors/flavor-citron.jpg", keys: ["citron"] },
  { id: "amlou", label: "Amlou", image: "/flavors/flavor-amlou.jpg", keys: ["amlou"] },
  { id: "argan", label: "Argan", image: "/flavors/flavor-argan.jpg", keys: ["argan"] },
  { id: "the", label: "Thé", image: "/flavors/flavor-the.jpg", keys: ["thé", "manzanilla", "verbena", "ice tea"] },
  { id: "cappuccino", label: "Cappuccino", image: "/flavors/flavor-cappuccino.jpg", keys: ["cappuccino"] },
  { id: "ice", label: "Glacé", image: "/flavors/flavor-ice.jpg", keys: ["ice", "frappé", "frappe", "smoothie", "fizz", "splash"] },
  { id: "lait", label: "Lait", image: "/flavors/flavor-lait.jpg", keys: ["au lait", "latté", "latte", "macchiato"] },
  { id: "espresso", label: "Espresso", image: "/flavors/flavor-espresso.jpg", keys: ["espresso", "café", "cafe", "arabica"] },
];

const byId = Object.fromEntries(flavors.map((flavor) => [flavor.id, flavor]));

const choiceIds = [
  "caramel",
  "vanille",
  "noisette",
  "cookie",
  "miel",
  "chocolat",
  "fraise",
  "mangue",
  "menthe",
  "peche",
  "ananas",
  "oreo",
  "chai",
  "the",
];

export const flavorChoices = choiceIds.map((id) => byId[id]);

function bagFor(name) {
  const text = name.toLowerCase();
  if (text.includes("moka")) return { id: "moka", label: "Moka", image: "/moka.png", fit: "contain" };
  if (text.includes("spécial") || text.includes("special")) {
    return { id: "special", label: "Spécial", image: "/special.png", fit: "contain" };
  }
  return { id: "arabica", label: "Arabica", image: "/arabica.png", fit: "contain" };
}

function matchText(text) {
  return flavors.find((flavor) => flavor.keys.some((key) => text.includes(key)));
}

export function flavorOf(item) {
  if (item.category?.id === "grains") return bagFor(item.name);
  const found = matchText(item.name.toLowerCase()) || matchText((item.note || "").toLowerCase());
  if (found) return found;
  const fallback = {
    cappuccino: "cappuccino",
    latte: "lait",
    lait: "lait",
    chocolat: "chocolat",
    the: "the",
    chai: "chai",
    miel: "miel",
    epicerie: "amlou",
    patisserie: "citron",
    ice: "ice",
    frappe: "ice",
    cocktails: "menthe",
    creations: "mangue",
  }[item.category?.id];
  return byId[fallback] || byId.espresso;
}
