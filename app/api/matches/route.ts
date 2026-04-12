import { NextRequest, NextResponse } from 'next/server';
import { getDb, initDB } from '@/lib/db';

export async function GET() {
  try {
    await initDB();
    const sql = getDb();
    const result = await sql`SELECT * FROM match_history ORDER BY date DESC`;
    return NextResponse.json(result);
  } catch (e) { console.error(e); return NextResponse.json([], { status: 500 }); }
}

export async function PATCH(req: NextRequest) {
  try {
    await initDB();
    const sql = getDb();
    const { id, scoreUs, scoreThem, photos } = await req.json();
    await sql`UPDATE match_history SET score_us=${scoreUs}, score_them=${scoreThem}, photos=${photos} WHERE id=${id}`;
    return NextResponse.json({ success: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: '서버 오류' }, { status: 500 }); }
}
