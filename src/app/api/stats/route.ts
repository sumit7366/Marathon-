import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockStore } from '@/lib/mockData';

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const { data: registrations } = await supabase.from('registrations').select('payment_status, amount');
      const { data: events } = await supabase.from('events').select('id');
      
      const totalRegistrations = registrations?.length || 0;
      const paidCount = registrations?.filter(r => r.payment_status === 'paid').length || 0;
      const pendingCount = totalRegistrations - paidCount;
      const totalRevenue = registrations?.filter(r => r.payment_status === 'paid').reduce((sum, r) => sum + r.amount, 0) || 0;
      
      return Response.json({
        stats: { totalRegistrations, paidCount, pendingCount, totalRevenue, totalEvents: events?.length || 0 }
      });
    } else {
      return Response.json({ stats: mockStore.getStats() });
    }
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
