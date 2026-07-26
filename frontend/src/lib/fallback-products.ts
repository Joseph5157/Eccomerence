import type { Product } from "./types";

/**
 * Hardcoded product data that mirrors the Medusa INR seed.
 * Used so every page renders even before the backend is running, and as a
 * graceful fallback if the Store API call fails. Once the backend is up and
 * the publishable key is configured, live data from Medusa takes over.
 */
export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "fb-vitamin-d3-60k",
    handle: "vitamin-d3-60k",
    title: "Vitamin D3 60K",
    category: "Vitamins",
    price: 149,
    mrp: 199,
    unit: "60,000 IU · 4 softgels",
    description:
      "High-strength Vitamin D3 60,000 IU softgels to support bone health, immunity and calcium absorption. One softgel weekly as directed.",
  },
  {
    id: "fb-vitamin-c-chewable",
    handle: "vitamin-c-chewable",
    title: "Vitamin C Chewable",
    category: "Vitamins",
    price: 189,
    mrp: 240,
    unit: "500mg · 30 tablets",
    description:
      "Tangy orange chewable Vitamin C 500mg tablets. A daily antioxidant boost that supports immunity and skin health.",
  },
  {
    id: "fb-multivitamin-daily",
    handle: "multivitamin-daily",
    title: "Multivitamin Daily",
    category: "Vitamins",
    price: 320,
    mrp: 399,
    unit: "30 tablets",
    description:
      "A complete daily multivitamin with 23 essential vitamins and minerals to fill everyday nutritional gaps and sustain energy.",
  },
  {
    id: "fb-cough-relief-syrup",
    handle: "cough-relief-syrup",
    title: "Cough Relief Syrup",
    category: "Syrups",
    price: 95,
    mrp: 120,
    unit: "100ml",
    description:
      "Soothing herbal cough relief syrup that calms dry and productive coughs and eases throat irritation. Suitable for adults and children above 6.",
  },
  {
    id: "fb-digestive-syrup",
    handle: "digestive-syrup",
    title: "Digestive Syrup",
    category: "Syrups",
    price: 130,
    mrp: 160,
    unit: "170ml",
    description:
      "An ayurvedic digestive syrup that supports smooth digestion, relieves bloating and acidity, and improves appetite.",
  },
  {
    id: "fb-iron-folic-syrup",
    handle: "iron-folic-syrup",
    title: "Iron Folic Syrup",
    category: "Syrups",
    price: 110,
    mrp: 140,
    unit: "200ml",
    description:
      "Iron with folic acid syrup to support healthy haemoglobin levels and combat iron-deficiency fatigue. Gentle on the stomach.",
  },
  {
    id: "fb-omega-3-fish-oil",
    handle: "omega-3-fish-oil",
    title: "Omega-3 Fish Oil",
    category: "Supplements",
    price: 449,
    mrp: 599,
    unit: "60 capsules",
    description:
      "Triple-strength Omega-3 fish oil with EPA and DHA for heart, brain and joint health. Enteric-coated for no fishy after-taste.",
  },
  {
    id: "fb-calcium-magnesium",
    handle: "calcium-magnesium",
    title: "Calcium + Magnesium",
    category: "Supplements",
    price: 275,
    mrp: 350,
    unit: "60 tablets",
    description:
      "Calcium and magnesium with Vitamin D3 for stronger bones, teeth and muscle function. Ideal for adults and the elderly.",
  },
  {
    id: "fb-protein-immunity-powder",
    handle: "protein-immunity-powder",
    title: "Protein Immunity Powder",
    category: "Supplements",
    price: 399,
    mrp: 499,
    unit: "200g jar",
    description:
      "A daily protein and immunity powder with whey protein, vitamins and zinc. Mixes easily into milk or water — chocolate flavour.",
  },
];
