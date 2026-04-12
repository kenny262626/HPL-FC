import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const sql = getDb();
    const result = await sql`SELECT u.id, u.name, u.role, nm.member_name as mapped_member
      FROM users u LEFT JOIN name_mappings nm ON u.id = nm.user_id ORDER BY u.created_at`;
    return NextResponse.json(result);
  } catch (e) { console.error(e); return NextResponse.json([], { status: 500 }); }
}

export async function PATCH(req: NextRequest) {
  try {
    const sql = getDb();
    const { userId, isCoach } = await req.json();
    const role = isCoach ? 'coach' : 'member';
    await sql`UPDATE users SET role=${role} WHERE id=${userId} AND role != 'admin'`;
    return NextResponse.json({ success: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: '서버 오류' }, { status: 500 }); }
}
