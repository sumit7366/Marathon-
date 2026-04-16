import { NextRequest } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockStore } from '@/lib/mockData';
import { generateRegistrationId } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_id, name, phone, email, age, gender, category } = body;

    // Validate required fields
    if (!event_id || !name || !phone || !email || !age || !gender || !category) {
      return Response.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      // Get event to find price
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('categories')
        .eq('id', event_id)
        .single();

      if (eventError || !event) {
        return Response.json({ error: 'Event not found' }, { status: 404 });
      }

      const amount = event.categories[category];
      if (!amount) {
        return Response.json({ error: 'Invalid category' }, { status: 400 });
      }

      const registration_id = generateRegistrationId();

      const { data, error } = await supabase
        .from('registrations')
        .insert({
          registration_id,
          event_id,
          name,
          phone,
          email,
          age: parseInt(age),
          gender,
          category,
          amount,
          payment_status: 'pending',
        })
        .select()
        .single();

      if (error) {
        return Response.json({ error: error.message }, { status: 500 });
      }

      return Response.json({ registration: data }, { status: 201 });
    } else {
      // Mock mode
      const event = mockStore.getEvent(event_id);
      if (!event) {
        return Response.json({ error: 'Event not found' }, { status: 404 });
      }

      const amount = event.categories[category];
      if (!amount) {
        return Response.json({ error: 'Invalid category' }, { status: 400 });
      }

      const registration_id = generateRegistrationId();
      const registration = mockStore.createRegistration({
        registration_id,
        event_id,
        name,
        phone,
        email,
        age: parseInt(age),
        gender,
        category,
        amount,
        payment_status: 'pending',
      });

      return Response.json({ registration }, { status: 201 });
    }
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
