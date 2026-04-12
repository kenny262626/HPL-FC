import { NextRequest, NextResponse } from 'next/server';
import { getDb, initDB } from '@/lib/db';

export async function GET() {
  try {
    await initDB();
    const sql = getDb();
    const result = await sql`SELECT date, place, start_time, end_time, method FROM next_match WHERE id = 1`;
    if (result.length === 0) return NextResponse.json(null);
    const m = result[0];
    // 경기 종료 시간 지났으면 null 반환
    if (m.date && m.end_time) {
      const endDt = new Date(`${m.date}T${m.end_time}:00+09:00`);
      if (new Date() > endDt) return NextResponse.json(null);
    }
    return NextResponse.json(m);
  } catch (e) { console.error(e); return NextResponse.json(null, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  try {
    await initDB();
    const sql = getDb();
    const { date, place, startTime, endTime, method } = await req.json();
    if (!date) return NextResponse.json({ error: '날짜를 입력해주세요' }, { status: 400 });

    // 기존 next_match를 match_history로 이동 (attendees는 현재 votes에서)
    const prev = await sql`SELECT * FROM next_match WHERE id = 1`;
    if (prev.length > 0 && prev[0].date) {
      const votes = await sql`SELECT member_name FROM votes WHERE vote_type = 'attend'`;
      const attendees = votes.map((v: {member_name: string}) => v.member_name);
      await sql`INSERT INTO match_history (date, place, start_time, end_time, method, attendees)
        VALUES (${prev[0].date}, ${prev[0].place}, ${prev[0].start_time}, ${prev[0].end_time}, ${prev[0].method}, ${attendees})
        ON CONFLICT DO NOTHING`;
    }

    await sql`INSERT INTO next_match (id, date, place, start_time, end_time, method, updated_at)
      VALUES (1, ${date}, ${place}, ${startTime}, ${endTime}, ${method}, NOW())
      ON CONFLICT (id) DO UPDATE SET date=${date}, place=${place}, start_time=${startTime}, end_time=${endTime}, method=${method}, updated_at=NOW()`;
    await sql`DELETE FROM votes`;
    return NextResponse.json({ success: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: '서버 오류' }, { status: 500 }); }
}
