import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const sql = getDb();
    const { userId, name, pw } = await req.json();
    if (pw) {
      await sql`UPDATE users SET name=${name}, pw=${pw} WHERE id=${userId}`;
    } else {
      await sql`UPDATE users SET name=${name} WHERE id=${userId}`;
    }
    return NextResponse.json({ success: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: '서버 오류' }, { status: 500 }); }
}
