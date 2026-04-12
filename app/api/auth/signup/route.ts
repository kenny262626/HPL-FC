import { NextRequest, NextResponse } from 'next/server';
import { sql, initDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await initDB();
    const { id, name, pw } = await req.json();

    if (!name) return NextResponse.json({ error: '이름을 입력해주세요' }, { status: 400 });
    if (!id) return NextResponse.json({ error: '아이디를 입력해주세요' }, { status: 400 });
    if (id.length < 3) return NextResponse.json({ error: '아이디는 3자 이상이어야 합니다' }, { status: 400 });
    if (!pw) return NextResponse.json({ error: '비밀번호를 입력해주세요' }, { status: 400 });
    if (pw.length < 4) return NextResponse.json({ error: '비밀번호는 4자 이상이어야 합니다' }, { status: 400 });

    const existing = await sql`SELECT id FROM users WHERE id = ${id}`;
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: '이미 사용 중인 아이디입니다' }, { status: 409 });
    }

    await sql`INSERT INTO users (id, name, pw) VALUES (${id}, ${name}, ${pw})`;

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
