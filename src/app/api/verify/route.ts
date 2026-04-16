import { NextRequest } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockStore } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return Response.json({ error: 'Registration ID is required' }, { status: 400 });
  }

  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('registrations')
        .select('*, event:events(*)')
        .eq('registration_id', id)
        .single();

      if (error || !data) {
        return Response.json({ error: 'Registration not found' }, { status: 404 });
      }

      return Response.json({ registration: data });
    } else {
      const registration = mockStore.getRegistration(id);
      if (!registration) {
        return Response.json({ error: 'Registration not found' }, { status: 404 });
      }
      return Response.json({ registration });
    }
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
