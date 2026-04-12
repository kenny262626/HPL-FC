import { NextRequest, NextResponse } from 'next/server';
import { sql, initDB } from '@/lib/db';

// GET: 다음 경기 조회
export async function GET() {
  try {
    await initDB();
    const result = await sql`SELECT date, place, time, method FROM next_match WHERE id = 1`;
    if (result.rows.length === 0) return NextResponse.json(null);
    return NextResponse.json(result.rows[0]);
  } catch (e) {
    console.error(e);
    return NextResponse.json(null, { status: 500 });
  }
}

// POST: 다음 경기 저장 (관리자)
export async function POST(req: NextRequest) {
  try {
    await initDB();
    const { date, place, time, method } = await req.json();

    if (!date) return NextResponse.json({ error: '날짜를 입력해주세요' }, { status: 400 });

    await sql`
      INSERT INTO next_match (id, date, place, time, method, updated_at)
      VALUES (1, ${date}, ${place}, ${time}, ${method}, NOW())
      ON CONFLICT (id) DO UPDATE SET
        date = ${date}, place = ${place}, time = ${time}, method = ${method}, updated_at = NOW()
    `;

    // 투표 초기화
    await sql`DELETE FROM votes`;

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
