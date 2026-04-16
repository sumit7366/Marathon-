import { NextRequest } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockStore } from '@/lib/mockData';

// Get all events
export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json({ events: data });
    } else {
      return Response.json({ events: mockStore.getAllEvents() });
    }
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Create event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('events')
        .insert(body)
        .select()
        .single();

      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json({ event: data }, { status: 201 });
    } else {
      const event = mockStore.createEvent(body);
      return Response.json({ event }, { status: 201 });
    }
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update event
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) return Response.json({ error: 'Event ID required' }, { status: 400 });

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json({ event: data });
    } else {
      const event = mockStore.updateEvent(id, updates);
      if (!event) return Response.json({ error: 'Event not found' }, { status: 404 });
      return Response.json({ event });
    }
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Delete event
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return Response.json({ error: 'Event ID required' }, { status: 400 });

    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json({ success: true });
    } else {
      mockStore.deleteEvent(id);
      return Response.json({ success: true });
    }
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
