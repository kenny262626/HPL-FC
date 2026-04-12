import { NextRequest, NextResponse } from 'next/server';
import { getDb, initDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await initDB();
    const sql = getDb();
    const { id, pw } = await req.json();

    if (!id || !pw) {
      return NextResponse.json({ error: '아이디와 비밀번호를 입력해주세요' }, { status: 400 });
    }

    const result = await sql`SELECT id, name FROM users WHERE id = ${id} AND pw = ${pw}`;

    if (result.length === 0) {
      return NextResponse.json({ error: '아이디 또는 비밀번호가 올바르지 않습니다' }, { status: 401 });
    }

    return NextResponse.json({ id: result[0].id, name: result[0].name });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
