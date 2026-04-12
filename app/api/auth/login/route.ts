import { NextRequest, NextResponse } from 'next/server';
import { getDb, initDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await initDB();
    const sql = getDb();
    const { id, pw } = await req.json();
    if (!id || !pw) return NextResponse.json({ error: '아이디와 비밀번호를 입력해주세요' }, { status: 400 });
    const result = await sql`SELECT u.id, u.name, u.role, nm.member_name as mapped_member
      FROM users u LEFT JOIN name_mappings nm ON u.id = nm.user_id
      WHERE u.id = ${id} AND u.pw = ${pw}`;
    if (result.length === 0) return NextResponse.json({ error: '아이디 또는 비밀번호가 올바르지 않습니다' }, { status: 401 });
    const r = result[0];
    return NextResponse.json({ id: r.id, name: r.name, role: r.role, mappedMember: r.mapped_member });
  } catch (e) { console.error(e); return NextResponse.json({ error: '서버 오류' }, { status: 500 }); }
}
