// src/lib/helpers.ts

export function getTier(rate: number): string {
  if (rate >= 85) return 'GOLD';
  if (rate >= 70) return 'SILVER';
  return 'BRONZE';
}

export function tierColor(tier: string): string {
  if (tier === 'GOLD') return 'var(--gold)';
  if (tier === 'SILVER') return 'var(--silver)';
  return 'var(--bronze)';
}

export function showToast(msg: string) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

export function getNextSaturday(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = (6 - day + 7) % 7 || 7;
  const next = new Date(now);
  next.setDate(now.getDate() + diff);
  const days = ['일','월','화','수','목','금','토'];
  const months = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
  return `${next.getFullYear()}년 ${months[next.getMonth()]} ${next.getDate()}일 (${days[next.getDay()]})`;
}

export function getInitials(name: string): string {
  return name.length >= 2 ? name[1] : name[0];
}
