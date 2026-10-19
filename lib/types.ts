export interface Product {
  id: string;
  name: string;
  category: "women" | "men";
  subcategory: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  sizes: string[];
  /** [primary, hover] image URLs */
  images: string[];
  featured: boolean;
  isNew: boolean;
  trending: boolean;
}
