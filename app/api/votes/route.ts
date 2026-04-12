import { NextRequest, NextResponse } from 'next/server';
import { sql, initDB } from '@/lib/db';

// GET: 전체 투표 현황 조회
export async function GET() {
  try {
    await initDB();
    const result = await sql`SELECT member_name, vote_type FROM votes`;
    const votes: Record<string, string> = {};
    result.rows.forEach((r) => {
      votes[r.member_name] = r.vote_type;
    });
    return NextResponse.json(votes);
  } catch (e) {
    console.error(e);
    return NextResponse.json({}, { status: 500 });
  }
}

// POST: 투표 등록/변경
export async function POST(req: NextRequest) {
  try {
    await initDB();
    const { memberName, voteType } = await req.json();

    if (!memberName || !['attend', 'absent'].includes(voteType)) {
      return NextResponse.json({ error: '잘못된 요청' }, { status: 400 });
    }

    await sql`
      INSERT INTO votes (member_name, vote_type, voted_at)
      VALUES (${memberName}, ${voteType}, NOW())
      ON CONFLICT (member_name) DO UPDATE SET vote_type = ${voteType}, voted_at = NOW()
    `;

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}

// DELETE: 경기 변경 시 투표 초기화
export async function DELETE() {
  try {
    await initDB();
    await sql`DELETE FROM votes`;
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
