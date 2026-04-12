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
    const { id, date, place, startTime, endTime, method, scoreUs, scoreDraw, scoreThem, attendees, photos } = await req.json();
    await sql`UPDATE match_history SET
      date=${date}, place=${place}, start_time=${startTime}, end_time=${endTime},
      method=${method}, score_us=${scoreUs}, score_draw=${scoreDraw ?? 0}, score_them=${scoreThem},
      attendees=${attendees}, photos=${photos}
      WHERE id=${id}`;
    return NextResponse.json({ success: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: '서버 오류' }, { status: 500 }); }
}

export async function DELETE(req: NextRequest) {
  try {
    const sql = getDb();
    const { id } = await req.json();
    await sql`DELETE FROM match_history WHERE id=${id}`;
    return NextResponse.json({ success: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: '서버 오류' }, { status: 500 }); }
}
