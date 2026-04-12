// 로그인
export async function apiLogin(id: string, pw: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, pw }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || '로그인 실패');
  return data as { id: string; name: string };
}

// 회원가입
export async function apiSignup(id: string, name: string, pw: string) {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, name, pw }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || '회원가입 실패');
  return data;
}

// 투표 목록 조회
export async function apiGetVotes(): Promise<Record<string, string>> {
  const res = await fetch('/api/votes');
  if (!res.ok) return {};
  return res.json();
}

// 투표 등록
export async function apiCastVote(memberName: string, voteType: 'attend' | 'absent') {
  const res = await fetch('/api/votes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ memberName, voteType }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || '투표 실패');
  return data;
}

// 다음 경기 조회
export async function apiGetMatch() {
  const res = await fetch('/api/match');
  if (!res.ok) return null;
  return res.json() as Promise<{ date: string; place: string; time: string; method: string } | null>;
}

// 다음 경기 저장
export async function apiSaveMatch(date: string, place: string, time: string, method: string) {
  const res = await fetch('/api/match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, place, time, method }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || '저장 실패');
  return data;
}
