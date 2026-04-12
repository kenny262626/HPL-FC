import { NextResponse } from 'next/server';
import { getDb, initDB } from '@/lib/db';
import { DATA, MEMBERS } from '@/lib/data';

export async function GET() {
  try {
    await initDB();
    const sql = getDb();

    const history = await sql`SELECT date, attendees FROM match_history ORDER BY date ASC`;
    const hardcodedDates = [...new Set(DATA.map(r => r.date))].sort();
    const lastHardcodedDate = hardcodedDates[hardcodedDates.length - 1] || '';
    const newMatches = history.filter((h: Record<string, unknown>) => (h.date as string) > lastHardcodedDate);

    interface MS { attend: number; total: number; score: number; lastScore: number; }
    const stats: Record<string, MS> = {};
    MEMBERS.forEach(m => { stats[m] = { attend: 0, total: 0, score: 0, lastScore: 0 }; });

    [...DATA].sort((a, b) => a.date.localeCompare(b.date)).forEach(r => {
      if (!stats[r.name]) return;
      stats[r.name].total++;
      if (r.attend) {
        stats[r.name].attend++;
        stats[r.name].score += r.score;
        stats[r.name].lastScore = r.score;
      } else {
        stats[r.name].lastScore = 0;
      }
    });

    for (const match of newMatches) {
      const attendees: string[] = Array.isArray(match.attendees) ? match.attendees as string[] : [];
      MEMBERS.forEach(m => {
        if (!stats[m]) return;
        stats[m].total++;
        if (attendees.includes(m)) {
          const next = stats[m].lastScore === 0 ? 1 : stats[m].lastScore === 1 ? 2 : 3;
          stats[m].attend++;
          stats[m].score += next;
          stats[m].lastScore = next;
        } else {
          stats[m].lastScore = 0;
        }
      });
    }

    const MERCENARIES = ['박준혁'];
    const regular = MEMBERS.filter(m => !MERCENARIES.includes(m));
    const mercs = MEMBERS.filter(m => MERCENARIES.includes(m));

    const list = regular.map(m => {
      const s = stats[m];
      const rate = s.total > 0 ? Math.round((s.attend / s.total) * 100) : 0;
      const nextScore = s.lastScore === 0 ? 1 : s.lastScore === 1 ? 2 : 3;
      return { name: m, attend: s.attend, total: s.total, rate, score: s.score, lastScore: s.lastScore, nextScore };
    });
    list.sort((a, b) => b.rate !== a.rate ? b.rate - a.rate : b.score - a.score);
    const ranked = list.map((m, i) => ({ ...m, rank: i + 1, tier: i < 3 ? 'gold' : i < 10 ? 'silver' : 'bronze' }));

    const mercRanked = mercs.map(m => {
      const s = stats[m];
      const rate = s.total > 0 ? Math.round((s.attend / s.total) * 100) : 0;
      return { name: m, attend: s.attend, total: s.total, rate, score: s.score, lastScore: s.lastScore, nextScore: 3, rank: 0, tier: 'bronze' };
    });

    return NextResponse.json([...ranked, ...mercRanked]);
  } catch (e) {
    console.error(e);
    return NextResponse.json([], { status: 500 });
  }
}
