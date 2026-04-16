import { NextRequest } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockStore } from '@/lib/mockData';

// Get participants
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId') || undefined;

  try {
    if (isSupabaseConfigured()) {
      let query = supabase.from('registrations').select('*, event:events(name)').order('created_at', { ascending: false });
      if (eventId) query = query.eq('event_id', eventId);
      const { data, error } = await query;
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json({ participants: data });
    } else {
      const participants = mockStore.getRegistrations(eventId);
      // Attach event names
      const withEvents = participants.map(p => ({
        ...p,
        event: mockStore.getEvent(p.event_id),
      }));
      return Response.json({ participants: withEvents });
    }
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update payment status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { registration_id, payment_status } = body;

    if (!registration_id || !payment_status) {
      return Response.json({ error: 'registration_id and payment_status required' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('registrations')
        .update({ payment_status })
        .eq('registration_id', registration_id)
        .select()
        .single();

      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json({ registration: data });
    } else {
      const reg = mockStore.updatePaymentStatus(registration_id, payment_status);
      if (!reg) return Response.json({ error: 'Registration not found' }, { status: 404 });
      return Response.json({ registration: reg });
    }
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Delete participant
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return Response.json({ error: 'Participant ID is required' }, { status: 400 });
  }

  try {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('registrations').delete().eq('id', id);
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json({ success: true });
    } else {
      const success = mockStore.deleteRegistration(id);
      if (!success) return Response.json({ error: 'Participant not found' }, { status: 404 });
      return Response.json({ success: true });
    }
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
