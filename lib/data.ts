import type { Product } from "./types";
import { GENERATED_PRODUCTS } from "./generated-products";

const SIZES = ["XS", "S", "M", "L", "XL"];

function img(id: string): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;
}

export const BASE_PRODUCTS: Product[] = [
  // ——— Women ———
  {
    id: "silk-column-dress",
    name: "Silk Column Dress",
    category: "women",
    subcategory: "Dresses",
    price: 129,
    compareAtPrice: 189,
    description:
      "A fluid bias-cut slip dress in washed silk. Adjustable straps, midi length, and a subtle cowl neckline make it an effortless day-to-night piece.",
    sizes: SIZES,
    images: [img("photo-1525507119028-ed4c629a60a3"), img("photo-1490481651871-ab68de25d43d")],
    featured: true,
    isNew: false,
    trending: true,
  },
  {
    id: "ribbed-merino-sweater",
    name: "Ribbed Merino Sweater",
    category: "women",
    subcategory: "Knitwear",
    price: 98,
    description:
      "Fine-gauge ribbed knit in extra-soft merino wool. A fitted silhouette with a high crew neck that layers cleanly under tailoring.",
    sizes: SIZES,
    images: [img("photo-1485968579580-b6d095142e6e"), img("photo-1434389677669-e08b4cac3105")],
    featured: false,
    isNew: true,
    trending: false,
  },
  {
    id: "wool-wrap-coat",
    name: "Wool Wrap Coat",
    category: "women",
    subcategory: "Outerwear",
    price: 249,
    description:
      "Double-faced wool wrap coat with a self-tie belt and dropped shoulders. Unlined for a fluid drape, cut to mid-calf.",
    sizes: SIZES,
    images: [img("photo-1539533018447-63fcce2678e3"), img("photo-1529139574466-a303027c1d8b")],
    featured: true,
    isNew: false,
    trending: true,
  },
  {
    id: "linen-blend-blouse",
    name: "Linen Blend Blouse",
    category: "women",
    subcategory: "Tops",
    price: 79,
    description:
      "Airy linen-blend blouse with a relaxed fit, mother-of-pearl buttons, and a softly pointed collar. Garment-washed for a lived-in feel.",
    sizes: SIZES,
    images: [img("photo-1496747611176-843222e1e57c"), img("photo-1594633312681-425c7b97ccd1")],
    featured: false,
    isNew: false,
    trending: false,
  },
  {
    id: "pleated-midi-skirt",
    name: "Pleated Midi Skirt",
    category: "women",
    subcategory: "Skirts",
    price: 89,
    description:
      "Knife-pleated midi skirt in a fluid crepe that moves with you. Elasticated back waist for an easy, comfortable fit.",
    sizes: SIZES,
    images: [img("photo-1554412933-514a83d2f3c8"), img("photo-1509631179647-0177331693ae")],
    featured: false,
    isNew: true,
    trending: false,
  },
  {
    id: "high-waist-wide-trousers",
    name: "High-Waist Wide Trousers",
    category: "women",
    subcategory: "Trousers",
    price: 99,
    description:
      "High-rise, wide-leg trousers in a structured twill. Front pleats and a floor-skimming hem give a long, tailored line.",
    sizes: SIZES,
    images: [img("photo-1594633312681-425c7b97ccd1"), img("photo-1515886657613-9f3515b0c78f")],
    featured: true,
    isNew: false,
    trending: false,
  },
  {
    id: "cashmere-cardigan",
    name: "Cashmere Cardigan",
    category: "women",
    subcategory: "Knitwear",
    price: 149,
    description:
      "Pure cashmere cardigan with a boxy fit and corozo buttons. Wear it buttoned as a top or open over a slip dress.",
    sizes: SIZES,
    images: [img("photo-1434389677669-e08b4cac3105"), img("photo-1485968579580-b6d095142e6e")],
    featured: false,
    isNew: false,
    trending: false,
  },
  {
    id: "tailored-blazer",
    name: "Tailored Blazer",
    category: "women",
    subcategory: "Outerwear",
    price: 179,
    description:
      "Single-breasted blazer with a nipped waist and lightly padded shoulders. Half-canvas construction for a natural roll.",
    sizes: SIZES,
    images: [img("photo-1515886657613-9f3515b0c78f"), img("photo-1539533018447-63fcce2678e3")],
    featured: false,
    isNew: false,
    trending: true,
  },
  {
    id: "satin-camisole",
    name: "Satin Camisole",
    category: "women",
    subcategory: "Tops",
    price: 59,
    description:
      "Sandwashed satin camisole with delicate straps and a V-neckline. A quiet layering essential with a subtle sheen.",
    sizes: SIZES,
    images: [img("photo-1490481651871-ab68de25d43d"), img("photo-1525507119028-ed4c629a60a3")],
    featured: false,
    isNew: false,
    trending: false,
  },
  {
    id: "floral-midi-dress",
    name: "Floral Midi Dress",
    category: "women",
    subcategory: "Dresses",
    price: 139,
    description:
      "Romantic midi dress in a muted floral print. Smocked bodice, puff sleeves, and a tiered skirt with side pockets.",
    sizes: SIZES,
    images: [img("photo-1509631179647-0177331693ae"), img("photo-1554412933-514a83d2f3c8")],
    featured: false,
    isNew: true,
    trending: false,
  },
  {
    id: "belted-trench-coat",
    name: "Belted Trench Coat",
    category: "women",
    subcategory: "Outerwear",
    price: 229,
    description:
      "A modern take on the classic trench — water-resistant cotton gabardine, horn-effect buttons, and a storm flap.",
    sizes: SIZES,
    images: [img("photo-1529139574466-a303027c1d8b"), img("photo-1520975954732-35dd22299614")],
    featured: true,
    isNew: false,
    trending: false,
  },
  // ——— Men ———
  {
    id: "oxford-button-down",
    name: "Oxford Button-Down",
    category: "men",
    subcategory: "Shirts",
    price: 69,
    description:
      "Washed cotton oxford with a button-down collar and a slightly relaxed body. The everyday shirt, done properly.",
    sizes: SIZES,
    images: [img("photo-1596755094514-f87e34085b2c"), img("photo-1611312449408-fcece27cdbb7")],
    featured: true,
    isNew: false,
    trending: false,
  },
  {
    id: "selvedge-slim-jeans",
    name: "Selvedge Slim Jeans",
    category: "men",
    subcategory: "Denim",
    price: 119,
    description:
      "Japanese selvedge denim in a slim-straight cut. Rigid on day one, moulded to you by day thirty.",
    sizes: SIZES,
    images: [img("photo-1542272604-787c3835535d"), img("photo-1591047139829-d91aecb6caea")],
    featured: false,
    isNew: false,
    trending: true,
  },
  {
    id: "crewneck-cotton-tee",
    name: "Crewneck Cotton Tee",
    category: "men",
    subcategory: "T-Shirts",
    price: 35,
    description:
      "Heavyweight organic cotton tee with a clean crew neck and a boxy, true-to-size fit. Pre-shrunk and garment-dyed.",
    sizes: SIZES,
    images: [img("photo-1521572163474-6864f9cf17ab"), img("photo-1576566588028-4147f3842f27")],
    featured: true,
    isNew: true,
    trending: false,
  },
  {
    id: "wool-overcoat",
    name: "Wool Overcoat",
    category: "men",
    subcategory: "Outerwear",
    price: 279,
    description:
      "Single-breasted overcoat in Italian wool twill. Notch lapels, welt pockets, and a centre back vent — a winter anchor piece.",
    sizes: SIZES,
    images: [img("photo-1591369822096-ffd140ec948f"), img("photo-1591047139829-d91aecb6caea")],
    featured: true,
    isNew: false,
    trending: true,
  },
  {
    id: "merino-crew-sweater",
    name: "Merino Crew Sweater",
    category: "men",
    subcategory: "Knitwear",
    price: 109,
    description:
      "Extra-fine merino crewneck, knitted seamless for comfort. Light enough to layer under a blazer, warm enough to stand alone.",
    sizes: SIZES,
    images: [img("photo-1507003211169-0a1dd7228f2d"), img("photo-1520975954732-35dd22299614")],
    featured: false,
    isNew: false,
    trending: false,
  },
  {
    id: "pleated-chino-trousers",
    name: "Pleated Chino Trousers",
    category: "men",
    subcategory: "Trousers",
    price: 85,
    description:
      "Double-pleated chinos in brushed cotton with a tapered leg and cropped hem. Dress them up or down.",
    sizes: SIZES,
    images: [img("photo-1611312449408-fcece27cdbb7"), img("photo-1542272604-787c3835535d")],
    featured: false,
    isNew: true,
    trending: false,
  },
  {
    id: "leather-biker-jacket",
    name: "Leather Biker Jacket",
    category: "men",
    subcategory: "Outerwear",
    price: 349,
    description:
      "Vegetable-tanned lambskin biker with an asymmetric zip and quilted shoulder panels. Softens and darkens beautifully with wear.",
    sizes: SIZES,
    images: [img("photo-1551028719-00167b16eac5"), img("photo-1507003211169-0a1dd7228f2d")],
    featured: false,
    isNew: false,
    trending: true,
  },
  {
    id: "linen-short-sleeve-shirt",
    name: "Linen Short-Sleeve Shirt",
    category: "men",
    subcategory: "Shirts",
    price: 75,
    description:
      "Camp-collar shirt in breathable European linen. Straight hem, chest pocket, made for warm evenings.",
    sizes: SIZES,
    images: [img("photo-1520975954732-35dd22299614"), img("photo-1596755094514-f87e34085b2c")],
    featured: false,
    isNew: false,
    trending: false,
  },
  {
    id: "heavyweight-pocket-tee",
    name: "Heavyweight Pocket Tee",
    category: "men",
    subcategory: "T-Shirts",
    price: 45,
    description:
      "Our heaviest jersey — 220gsm cotton with a chest pocket and ribbed collar that keeps its shape wash after wash.",
    sizes: SIZES,
    images: [img("photo-1576566588028-4147f3842f27"), img("photo-1521572163474-6864f9cf17ab")],
    featured: false,
    isNew: true,
    trending: false,
  },
  {
    id: "chunky-knit-cardigan",
    name: "Chunky Knit Cardigan",
    category: "men",
    subcategory: "Knitwear",
    price: 129,
    description:
      "Three-gauge wool-blend cardigan with a shawl collar and horn buttons. Substantial, soft, and built to last.",
    sizes: SIZES,
    images: [img("photo-1554568218-0f1715e72254"), img("photo-1552374196-c4e7ffc6e126")],
    featured: false,
    isNew: false,
    trending: false,
  },
  {
    id: "straight-leg-denim",
    name: "Straight-Leg Denim",
    category: "men",
    subcategory: "Denim",
    price: 99,
    description:
      "Classic straight-leg jeans in a mid-wash with a touch of stretch. A true five-pocket, no gimmicks.",
    sizes: SIZES,
    images: [img("photo-1555529669-e69e7aa0ba9a"), img("photo-1542272604-787c3835535d")],
    featured: false,
    isNew: false,
    trending: false,
  },
];

/** Curated display order of subcategories per category. */
export const CATEGORIES: Record<Product["category"], string[]> = {
  women: ["Dresses", "Knitwear", "Outerwear", "Tops", "Skirts", "Trousers"],
  men: ["Outerwear", "Knitwear", "Shirts", "Trousers", "T-Shirts", "Denim"],
};

// Active catalogue. To include the demo products alongside generated ones, use:
// export const PRODUCTS: Product[] = [...BASE_PRODUCTS, ...GENERATED_PRODUCTS];
export const PRODUCTS: Product[] = GENERATED_PRODUCTS;

/**
 * Subcategories that actually have products in the active catalogue for the
 * given category — curated CATEGORIES order first, extras appended after.
 */
export function subcategoriesFor(category: Product["category"]): string[] {
  const present = new Set(
    PRODUCTS.filter((p) => p.category === category).map((p) => p.subcategory)
  );
  const curated = CATEGORIES[category].filter((s) => present.has(s));
  const extras = [...present].filter((s) => !CATEGORIES[category].includes(s));
  return [...curated, ...extras];
}
