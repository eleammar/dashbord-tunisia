export interface Recipe {
  ingredients: string[];
  steps: string[];
}

export interface PopularFood {
  id: number;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  city: string;
  recipe: Recipe;
  createdAt: string;
}

export interface AllFood {
  city_id: any;
  id: number;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  image_url?: string;
  city: string;
  rating: number;
  recipe: Recipe;
  createdAt: string;
}

export interface FoodRegion {
  id: number;
  govId: string;
  name: string;
  specialty: string;
  description: string;
  images: string[];
  createdAt: string;
}

export interface FoodEvent {
  id: number;
  name: string;
  date: string;
  imageUrl: string;
  description?: string;
  createdAt: string;
}

export interface Restaurant {
  id: number;
  name: string;
  city: string;
  rating: number;
  type: string;
  imageUrl: string;
  link: string;
  createdAt: string;
}

export interface FoodCategory {
  id: number;
  label: string;
  icon: string;
  value: string;
}