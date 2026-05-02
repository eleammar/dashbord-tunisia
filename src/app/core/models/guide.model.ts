export interface Category {
  id: number;
  label: string;
  icon?: string;
  color?: string;
  bg_class?: string;
}

export interface Place {
  id: number;
  name: string;
  description?: string;
  duration?: string;
  category_id?: number;
  image?: string;
  tags?: string[];
  rating?: number;
  reviews?: number;
  price?: string;
  open_hours?: string;
  address?: string;
  lat?: number;
  lng?: number;
  city_id?: number;
  category_label?: string;
  category_icon?: string;
  category_color?: string;
}

export interface Circuit {
  id: string;
  name: string;
  mode?: string;
  total_duration?: string;
  total_distance?: string;
  user_id?: string;
  city_id?: number;
  stops?: CircuitStop[];
}

export interface CircuitStop {
  id: number;
  circuit_id: string;
  place_id: number;
  start_time?: string;
  stop_order: number;
  name?: string;
  lat?: number;
  lng?: number;
  image?: string;
}

export interface LiveGuide {
  id: string;
  name: string;
  avatar?: string;
  speciality?: string;
  rating?: number;
  reviews?: number;
  languages?: string[];
  is_live?: boolean;
  category_id?: number;
  city_id?: number;
}

export interface HeroCategory {
  id: number;
  key: string;
  label: string;
  image?: string;
}

export interface HeroSection {
  id: number;
  title: string;
  subtitle?: string;
  location?: string;
  background_image?: string;
  city_id?: number;
}

export interface CityGuide {
  city: { id: number; name: string };
  hero: HeroSection | null;
  heroCategories: HeroCategory[];
  categories: Category[];
  places: Place[];
  circuits: Circuit[];
  liveGuides: LiveGuide[];
}