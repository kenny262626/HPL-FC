import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const sql = getDb();
    const { userId, memberName } = await req.json();
    if (memberName) {
      await sql`INSERT INTO name_mappings (user_id, member_name) VALUES (${userId}, ${memberName})
        ON CONFLICT (user_id) DO UPDATE SET member_name=${memberName}`;
    } else {
      await sql`DELETE FROM name_mappings WHERE user_id=${userId}`;
    }
    return NextResponse.json({ success: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: '서버 오류' }, { status: 500 }); }
}
