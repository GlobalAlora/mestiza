import type { NextRequest } from 'next/server';

/**
 * Daily cron job to prevent Supabase Free tier project from pausing.
 * Runs once per day via vercel.json schedule (Hobby: once/day max).
 * Secured with CRON_SECRET to prevent unauthorized invocations.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
      },
      signal: AbortSignal.timeout(5000),
    });

    return Response.json({
      ok: true,
      status: res.status,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : 'unknown' },
      { status: 500 },
    );
  }
}
