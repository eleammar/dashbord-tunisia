export interface CultureItem {
  id?: number;
  city_id: number;
  label?: string;
  title: string;
  description?: string;
  img?: string;
  rating?: number;         // numeric(2,1)
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}
