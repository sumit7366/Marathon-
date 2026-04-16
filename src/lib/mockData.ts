// In-memory mock data store for development/demo without Supabase
import { Event, Registration, GalleryImage } from './types';

const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Bareilly Marathon 2026',
    date: '2026-06-15T06:00:00+05:30',
    venue: 'Fun City Ground, Civil Lines, Bareilly',
    description: 'Join us for the biggest marathon event in Bareilly! Run through the scenic routes of the city and push your limits. Whether you are a beginner or a seasoned runner, there is a category for everyone. T-shirts, medals, refreshments, and an unforgettable experience await you!',
    categories: { '5KM': 499, '10KM': 799, '21KM': 1299 },
    benefits: ['Premium T-shirt', 'Finisher Medal', 'E-Certificate', 'Refreshments', 'Photography'],
    poster_url: null,
    route_map_url: null,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Independence Day Run 2026',
    date: '2026-08-15T05:30:00+05:30',
    venue: 'Gandhi Udyan Park, Bareilly',
    description: 'Celebrate Independence Day with a run for fitness and freedom! A patriotic-themed run through Bareilly. Come adorned in tri-color and make this Independence Day memorable.',
    categories: { '5KM': 399, '10KM': 699 },
    benefits: ['Tri-color T-shirt', 'Finisher Medal', 'Breakfast'],
    poster_url: null,
    route_map_url: null,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Night Trail Run 2026',
    date: '2026-10-25T20:00:00+05:30',
    venue: 'Izzat Nagar Stadium, Bareilly',
    description: 'Experience the thrill of running under the stars! Our first-ever night trail run features illuminated routes, glow-in-the-dark gear, and an electrifying post-run celebration.',
    categories: { '5KM': 599, '10KM': 899, '21KM': 1499 },
    benefits: ['Reflective T-shirt', 'LED Medal', 'E-Certificate', 'Glow Bands', 'Dinner'],
    poster_url: null,
    route_map_url: null,
    is_active: true,
    created_at: '2026-03-01T00:00:00Z',
  },
];

const mockRegistrations: Registration[] = [
  {
    id: '101',
    registration_id: 'BR-A1B2C3',
    event_id: '1',
    name: 'Rahul Kumar',
    phone: '9876543210',
    email: 'rahul@example.com',
    age: 28,
    gender: 'Male',
    category: '10KM',
    amount: 799,
    payment_status: 'paid',
    created_at: '2026-04-01T10:00:00Z',
  },
  {
    id: '102',
    registration_id: 'BR-D4E5F6',
    event_id: '1',
    name: 'Priya Singh',
    phone: '9876543211',
    email: 'priya@example.com',
    age: 24,
    gender: 'Female',
    category: '5KM',
    amount: 499,
    payment_status: 'pending',
    created_at: '2026-04-02T11:00:00Z',
  },
  {
    id: '103',
    registration_id: 'BR-G7H8I9',
    event_id: '1',
    name: 'Amit Sharma',
    phone: '9876543212',
    email: 'amit@example.com',
    age: 35,
    gender: 'Male',
    category: '21KM',
    amount: 1299,
    payment_status: 'paid',
    created_at: '2026-04-03T09:30:00Z',
  },
];

const mockGallery: GalleryImage[] = [];

// Store in global for persistence within session
const getStore = () => {
  if (typeof globalThis !== 'undefined') {
    const g = globalThis as Record<string, unknown>;
    if (!g.__mockStore) {
      g.__mockStore = {
        events: [...mockEvents],
        registrations: [...mockRegistrations],
        gallery: [...mockGallery],
      };
    }
    return g.__mockStore as {
      events: Event[];
      registrations: Registration[];
      gallery: GalleryImage[];
    };
  }
  return { events: [...mockEvents], registrations: [...mockRegistrations], gallery: [...mockGallery] };
};

export const mockStore = {
  // Events
  getEvents: (): Event[] => getStore().events.filter(e => e.is_active),
  getAllEvents: (): Event[] => getStore().events,
  getEvent: (id: string): Event | undefined => getStore().events.find(e => e.id === id),
  createEvent: (event: Omit<Event, 'id' | 'created_at'>): Event => {
    const newEvent: Event = {
      ...event,
      id: String(Date.now()),
      created_at: new Date().toISOString(),
    };
    getStore().events.push(newEvent);
    return newEvent;
  },
  updateEvent: (id: string, updates: Partial<Event>): Event | undefined => {
    const store = getStore();
    const idx = store.events.findIndex(e => e.id === id);
    if (idx === -1) return undefined;
    store.events[idx] = { ...store.events[idx], ...updates };
    return store.events[idx];
  },
  deleteEvent: (id: string): boolean => {
    const store = getStore();
    const idx = store.events.findIndex(e => e.id === id);
    if (idx === -1) return false;
    store.events.splice(idx, 1);
    return true;
  },

  // Registrations
  getRegistrations: (eventId?: string): Registration[] => {
    const regs = getStore().registrations;
    if (eventId) return regs.filter(r => r.event_id === eventId);
    return regs;
  },
  getRegistration: (registrationId: string): (Registration & { event?: Event }) | undefined => {
    const store = getStore();
    const reg = store.registrations.find(r => r.registration_id === registrationId);
    if (reg) {
      const event = store.events.find(e => e.id === reg.event_id);
      return { ...reg, event };
    }
    return undefined;
  },
  createRegistration: (reg: Omit<Registration, 'id' | 'created_at'>): Registration => {
    const newReg: Registration = {
      ...reg,
      id: String(Date.now()),
      created_at: new Date().toISOString(),
    };
    getStore().registrations.push(newReg);
    return newReg;
  },
  updatePaymentStatus: (registrationId: string, status: 'paid' | 'pending'): Registration | undefined => {
    const store = getStore();
    const idx = store.registrations.findIndex(r => r.registration_id === registrationId);
    if (idx === -1) return undefined;
    store.registrations[idx].payment_status = status;
    return store.registrations[idx];
  },
  deleteRegistration: (id: string): boolean => {
    const store = getStore();
    const idx = store.registrations.findIndex(r => r.id === id);
    if (idx === -1) return false;
    store.registrations.splice(idx, 1);
    return true;
  },

  // Gallery
  getGalleryImages: (eventId?: string): GalleryImage[] => {
    const imgs = getStore().gallery;
    if (eventId) return imgs.filter(i => i.event_id === eventId);
    return imgs;
  },
  addGalleryImage: (img: Omit<GalleryImage, 'id' | 'created_at'>): GalleryImage => {
    const newImg: GalleryImage = {
      ...img,
      id: String(Date.now()),
      created_at: new Date().toISOString(),
    };
    getStore().gallery.push(newImg);
    return newImg;
  },
  deleteGalleryImage: (id: string): boolean => {
    const store = getStore();
    const idx = store.gallery.findIndex(i => i.id === id);
    if (idx === -1) return false;
    store.gallery.splice(idx, 1);
    return true;
  },

  // Stats
  getStats: () => {
    const store = getStore();
    const totalRegistrations = store.registrations.length;
    const paidCount = store.registrations.filter(r => r.payment_status === 'paid').length;
    const pendingCount = totalRegistrations - paidCount;
    const totalRevenue = store.registrations
      .filter(r => r.payment_status === 'paid')
      .reduce((sum, r) => sum + r.amount, 0);
    return { totalRegistrations, paidCount, pendingCount, totalRevenue, totalEvents: store.events.length };
  },
};
