export type Product = {
  id: number;
  name: string;
  size: string;
  quantity: string;
  bestFor: string;
  storage: string;
  description: string;
  image: string;
  imageAlt: string;
};

export const products: Product[] = [
  { id: 1, name: "Small Samosa Sheet", size: "5 × 5 inch", quantity: "100 sheets", bestFor: "Mini samosas", storage: "Keep refrigerated", description: "Convenient sheets for mini snacks, tea-time samosas and party servings.", image: "/images/samosa-sheet-small.webp", imageAlt: "Stack of small ready-made samosa sheets with mini fried samosas" },
  { id: 2, name: "Medium Samosa Sheet", size: "7 × 7 inch", quantity: "100 sheets", bestFor: "Standard samosas", storage: "Keep refrigerated", description: "A versatile size for everyday home, restaurant and catering use.", image: "/images/samosa-sheet-medium.webp", imageAlt: "Stack of medium ready-made samosa sheets with standard fried samosas" },
  { id: 3, name: "Large Samosa Sheet", size: "8 × 8 inch", quantity: "100 sheets", bestFor: "Large samosas", storage: "Keep refrigerated", description: "Ideal for generous fillings, commercial kitchens and bulk preparation.", image: "/images/samosa-sheet-large.webp", imageAlt: "Stack of large ready-made samosa sheets with generously filled fried samosas" }
];
