export interface Hotel {
  id: number;
  city_id: number;
  name: string;
  distance?: string;        // character varying(100)
  img?: string;             // character varying(500)
  rating?: number;          // numeric(2,1)
  price?: string;           // character varying(50)
  display_order?: number;   // integer
  created_at?: string;      // timestamp (optionnel selon ta table)
  updated_at?: string;      // timestamp (optionnel selon ta table)
}

