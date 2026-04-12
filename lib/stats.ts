import { MEMBERS, DATA } from './data';

export type Tier = 'gold' | 'silver' | 'bronze';

export interface RankedMember {
  name: string;
  attend: number;
  total: number;
  rate: number;
  score: number;
  rank: number;
  tier: Tier;
}

export function calcStats(): Record<string, { attend: number; total: number; score: number }> {
  const stats: Record<string, { attend: number; total: number; score: number }> = {};
  MEMBERS.forEach((m) => {
    stats[m] = { attend: 0, total: 0, score: 0 };
  });

  DATA.forEach((r) => {
    if (!stats[r.name]) return;
    if (r.attend) {
      stats[r.name].attend++;
      stats[r.name].score += r.score;
    }
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

  list.sort((a, b) => {
    if (b.rate !== a.rate) return b.rate - a.rate;
    return b.score - a.score;
  });

  return list.map((m, i) => ({
    ...m,
    rank: i + 1,
    tier: (i < 3 ? 'gold' : i < 10 ? 'silver' : 'bronze') as Tier,
  }));
}

export function getTierBadgeSVG(tier: Tier, rank: number): string {
  const colors = {
    gold: { outer: '#FFD700', inner: '#FFA500', text: '#5a3a00' },
    silver: { outer: '#C0C0C0', inner: '#909090', text: '#1a1a1a' },
    bronze: { outer: '#CD7F32', inner: '#8B4513', text: '#fff' },
  };
  const c = colors[tier];
  let pts = '';
  for (let i = 0; i < 10; i++) {
    const angle = (i * 36 - 90) * (Math.PI / 180);
    const r2 = i % 2 === 0 ? 16 : 7;
    const x = 18 + r2 * Math.cos(angle);
    const y = 18 + r2 * Math.sin(angle);
    pts += x.toFixed(1) + ',' + y.toFixed(1) + ' ';
  }
  return `<svg width="36" height="36" viewBox="0 0 36 36">
    <defs><radialGradient id="g_${tier}_${rank}" cx="40%" cy="35%">
      <stop offset="0%" stop-color="${c.outer}"/>
      <stop offset="100%" stop-color="${c.inner}"/>
    </radialGradient></defs>
    <polygon points="${pts}" fill="url(#g_${tier}_${rank})" stroke="rgba(0,0,0,0.2)" stroke-width="0.5"/>
    <text x="18" y="22" text-anchor="middle" font-family="Bebas Neue,sans-serif" font-size="12" fill="${c.text}" font-weight="900">${rank}</text>
  </svg>`;
}
