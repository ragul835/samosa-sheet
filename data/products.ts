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
  { id: 1, name: "Small Samosa Sheet", size: "5 × 5 inch", quantity: "100 sheets", bestFor: "Mini samosas", storage: "Keep refrigerated", description: "Convenient sheets for mini snacks, tea-time samosas and party servings.", image: "/images/samosa-sheet-small-square-v6.webp", imageAlt: "Natural thin square 5-inch samosa sheets with freshly fried mini samosas on a wooden board" },
  { id: 2, name: "Medium Samosa Sheet", size: "7 × 7 inch", quantity: "100 sheets", bestFor: "Standard samosas", storage: "Keep refrigerated", description: "A versatile size for everyday home, restaurant and catering use.", image: "/images/samosa-sheet-medium-square-v6.webp", imageAlt: "Natural thin square 7-inch samosa sheets with standard-size golden samosas on a wooden board" },
  { id: 3, name: "Large Samosa Sheet", size: "8 × 8 inch", quantity: "100 sheets", bestFor: "Large samosas", storage: "Keep refrigerated", description: "Ideal for generous fillings, commercial kitchens and bulk preparation.", image: "/images/samosa-sheet-large-square-v6.webp", imageAlt: "Natural thin square 8-inch samosa sheets with large golden vegetable samosas on a wooden board" }
];
