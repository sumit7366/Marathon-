export interface Event {
  id: string;
  name: string;
  date: string;
  venue: string;
  description: string;
  categories: Record<string, number>;
  benefits: string[];
  poster_url: string | null;
  route_map_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Registration {
  id: string;
  registration_id: string;
  event_id: string;
  name: string;
  phone: string;
  email: string;
  age: number;
  gender: string;
  category: string;
  amount: number;
  payment_status: 'pending' | 'paid';
  created_at: string;
  // Joined fields
  event?: Event;
}

export interface GalleryImage {
  id: string;
  event_id: string | null;
  image_url: string;
  caption: string | null;
  created_at: string;
}

export interface AdminSession {
  authenticated: boolean;
  timestamp: number;
}
