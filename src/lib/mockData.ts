// In-memory store WITHOUT demo data
import { Event, Registration, GalleryImage } from './types';

// Empty initial data
const mockEvents: Event[] = [];
const mockRegistrations: Registration[] = [];
const mockGallery: GalleryImage[] = [];

// Store in global for persistence within session
const getStore = () => {
  if (typeof globalThis !== 'undefined') {
    const g = globalThis as Record<string, unknown>;
    if (!g.__mockStore) {
      g.__mockStore = {
        events: [],
        registrations: [],
        gallery: [],
      };
    }
    return g.__mockStore as {
      events: Event[];
      registrations: Registration[];
      gallery: GalleryImage[];
    };
  }
  return { events: [], registrations: [], gallery: [] };
};

export const mockStore = {
  // Events
  getEvents: (): Event[] => getStore().events.filter(e => e.is_active),
  getAllEvents: (): Event[] => getStore().events,
  getEvent: (id: string): Event | undefined =>
    getStore().events.find(e => e.id === id),

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
    return eventId ? regs.filter(r => r.event_id === eventId) : regs;
  },

  getRegistration: (registrationId: string):
    (Registration & { event?: Event }) | undefined => {
    const store = getStore();
    const reg = store.registrations.find(
      r => r.registration_id === registrationId
    );
    if (!reg) return undefined;

    const event = store.events.find(e => e.id === reg.event_id);
    return { ...reg, event };
  },

  createRegistration: (
    reg: Omit<Registration, 'id' | 'created_at'>
  ): Registration => {
    const newReg: Registration = {
      ...reg,
      id: String(Date.now()),
      created_at: new Date().toISOString(),
    };
    getStore().registrations.push(newReg);
    return newReg;
  },

  updatePaymentStatus: (
    registrationId: string,
    status: 'paid' | 'pending'
  ): Registration | undefined => {
    const store = getStore();
    const idx = store.registrations.findIndex(
      r => r.registration_id === registrationId
    );
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
    return eventId ? imgs.filter(i => i.event_id === eventId) : imgs;
  },

  addGalleryImage: (
    img: Omit<GalleryImage, 'id' | 'created_at'>
  ): GalleryImage => {
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
    const paidCount = store.registrations.filter(
      r => r.payment_status === 'paid'
    ).length;
    const pendingCount = totalRegistrations - paidCount;
    const totalRevenue = store.registrations
      .filter(r => r.payment_status === 'paid')
      .reduce((sum, r) => sum + r.amount, 0);

    return {
      totalRegistrations,
      paidCount,
      pendingCount,
      totalRevenue,
      totalEvents: store.events.length,
    };
  },
};