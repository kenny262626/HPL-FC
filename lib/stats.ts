import { MEMBERS, DATA } from './data';

export type Tier = 'gold' | 'silver' | 'bronze';

export interface RankedMember {
  name: string; attend: number; total: number; rate: number; score: number; rank: number; tier: Tier;
}

export function calcStats() {
  const stats: Record<string, { attend: number; total: number; score: number }> = {};
  MEMBERS.forEach((m) => { stats[m] = { attend: 0, total: 0, score: 0 }; });
  DATA.forEach((r) => {
    if (!stats[r.name]) return;
    if (r.attend) { stats[r.name].attend++; stats[r.name].score += r.score; }
    stats[r.name].total++;
  });
  return stats;
}

export function getRankedMembers(): RankedMember[] {
  const stats = calcStats();
  const list = MEMBERS.map((m) => {
    const s = stats[m] || { attend: 0, total: 0, score: 0 };
    const rate = s.total > 0 ? Math.round((s.attend / s.total) * 100) : 0;
    return { name: m, attend: s.attend, total: s.total, rate, score: s.score };
  });
  list.sort((a, b) => b.rate !== a.rate ? b.rate - a.rate : b.score - a.score);
  return list.map((m, i) => ({
    ...m, rank: i + 1,
    tier: (i < 3 ? 'gold' : i < 10 ? 'silver' : 'bronze') as Tier,
  }));
}

export function getTierImage(tier: Tier): string {
  return `/images/${tier}.png`;
}
