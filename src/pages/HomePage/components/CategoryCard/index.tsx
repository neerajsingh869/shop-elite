import {
  Bike,
  Car,
  Dumbbell,
  Footprints,
  Gem,
  Glasses,
  Home,
  Laptop,
  Layers,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sofa,
  Sparkles,
  Tablet,
  UtensilsCrossed,
  Watch,
  Wind,
  type LucideIcon,
} from "lucide-react";

import type { CategoryCardProps } from "./CategoryCard.types";
import { Link } from "react-router";
import { ROUTES } from "../../../../shared/constants";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  beauty: Sparkles,
  fragrances: Wind,
  furniture: Sofa,
  groceries: ShoppingCart,
  "home-decoration": Home,
  "kitchen-accessories": UtensilsCrossed,
  laptops: Laptop,
  "mens-shirts": Shirt,
  "mens-shoes": Footprints,
  "mens-watches": Watch,
  "mobile-accessories": Smartphone,
  motorcycle: Bike,
  "skin-care": Sparkles,
  smartphones: Smartphone,
  "sports-accessories": Dumbbell,
  sunglasses: Glasses,
  tablets: Tablet,
  tops: Layers,
  vehicle: Car,
  "womens-bags": ShoppingBag,
  "womens-dresses": Shirt,
  "womens-jewellery": Gem,
  "womens-shoes": Footprints,
  "womens-watches": Watch,
} as const;

function CategoryCard({ category }: CategoryCardProps) {
  const Icon: LucideIcon = CATEGORY_ICONS[category.slug] || ShoppingBag;

  return (
    <Link
      to={ROUTES.category(category.slug)}
      className="bg-zinc-950 border-zinc-800 border rounded-xl p-5 flex flex-col items-center justify-center gap-3 transition duration-300 hover:border-yellow-600 hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-900/20"
    >
      <Icon className="text-zinc-400" />
      <p className="text-sm font-medium text-zinc-400 text-center">
        {category.name}
      </p>
    </Link>
  );
}

export default CategoryCard;
