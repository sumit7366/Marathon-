import { NextRequest } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockStore } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId') || undefined;

  try {
    if (isSupabaseConfigured()) {
      let query = supabase.from('gallery').select('*').order('created_at', { ascending: false });
      if (eventId) query = query.eq('event_id', eventId);
      const { data, error } = await query;
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json({ images: data });
    } else {
      return Response.json({ images: mockStore.getGalleryImages(eventId) });
    }
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image_url, event_id, caption } = body;

    if (!image_url) return Response.json({ error: 'image_url required' }, { status: 400 });

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('gallery')
        .insert({ image_url, event_id: event_id || null, caption: caption || null })
        .select()
        .single();
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json({ image: data }, { status: 201 });
    } else {
      const image = mockStore.addGalleryImage({ image_url, event_id: event_id || null, caption: caption || null });
      return Response.json({ image }, { status: 201 });
    }
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return Response.json({ error: 'Image ID required' }, { status: 400 });

    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json({ success: true });
    } else {
      mockStore.deleteGalleryImage(id);
      return Response.json({ success: true });
    }
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
