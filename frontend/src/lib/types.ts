export type Category = "Vitamins" | "Syrups" | "Supplements";

export const CATEGORIES: Category[] = ["Vitamins", "Syrups", "Supplements"];

export type Product = {
  id: string;
  handle: string;
  title: string;
  category: Category;
  /** selling price in ₹ */
  price: number;
  /** MRP in ₹ (strike-through) */
  mrp: number;
  /** pack description, e.g. "60,000 IU · 4 softgels" */
  unit: string;
  description: string;
  /** Medusa variant id — present only when loaded from the Store API */
  variantId?: string;
};
