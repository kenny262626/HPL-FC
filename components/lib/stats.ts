import { MEMBERS, DATA, MERCENARIES } from './data';

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
  // 용병 제외하고 랭킹 계산
  const regularMembers = MEMBERS.filter(m => !MERCENARIES.includes(m));
  const mercMembers = MEMBERS.filter(m => MERCENARIES.includes(m));

  const regularList = regularMembers.map((m) => {
    const s = stats[m] || { attend: 0, total: 0, score: 0 };
    const rate = s.total > 0 ? Math.round((s.attend / s.total) * 100) : 0;
    return { name: m, attend: s.attend, total: s.total, rate, score: s.score };
  });

  regularList.sort((a, b) => b.rate !== a.rate ? b.rate - a.rate : b.score - a.score);

  const ranked = regularList.map((m, i) => ({
    ...m, rank: i + 1,
    tier: (i < 3 ? 'gold' : i < 10 ? 'silver' : 'bronze') as Tier,
  }));

  // 용병은 별도로 추가 (랭킹 없음, 브론즈 표시)
  const mercRanked = mercMembers.map((m) => {
    const s = stats[m] || { attend: 0, total: 0, score: 0 };
    const rate = s.total > 0 ? Math.round((s.attend / s.total) * 100) : 0;
    return { name: m, attend: s.attend, total: s.total, rate, score: s.score, rank: 0, tier: 'bronze' as Tier };
  });

  return [...ranked, ...mercRanked];
}

export function getTierImage(tier: Tier): string {
  return `/images/${tier}.png`;
}
