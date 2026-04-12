export async function apiLogin(id: string, pw: string) {
  const res = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id,pw}) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || '로그인 실패');
  return data as { id: string; name: string; role: string; mappedMember: string | null };
}

export async function apiSignup(id: string, name: string, pw: string) {
  const res = await fetch('/api/auth/signup', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id,name,pw}) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || '회원가입 실패');
  return data;
}

export async function apiUpdateProfile(userId: string, name: string, pw: string) {
  const res = await fetch('/api/user/profile', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({userId,name,pw}) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || '수정 실패');
  return data;
}

export async function apiGetVotes(): Promise<Record<string, string>> {
  const res = await fetch('/api/votes');
  if (!res.ok) return {};
  return res.json();
}

export async function apiCastVote(memberName: string, voteType: 'attend' | 'absent') {
  const res = await fetch('/api/votes', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({memberName,voteType}) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || '투표 실패');
  return data;
}

export interface NextMatchData {
  date: string; place: string; start_time: string; end_time: string; method: string;
}

export async function apiGetMatch(): Promise<NextMatchData | null> {
  const res = await fetch('/api/match');
  if (!res.ok) return null;
  return res.json();
}

export async function apiSaveMatch(date: string, place: string, startTime: string, endTime: string, method: string) {
  const res = await fetch('/api/match', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({date,place,startTime,endTime,method}) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || '저장 실패');
  return data;
}

export interface MatchHistoryItem {
  id: number; date: string; place: string; start_time: string; end_time: string;
  method: string; score_us: number; score_them: number; attendees: string[]; photos: string[];
}

export async function apiGetMatchHistory(): Promise<MatchHistoryItem[]> {
  const res = await fetch('/api/matches');
  if (!res.ok) return [];
  return res.json();
}

export async function apiUpdateMatch(
  id: number, date: string, place: string, startTime: string, endTime: string,
  method: string, scoreUs: number, scoreThem: number, attendees: string[], photos: string[], scoreDraw = 0
) {
  const res = await fetch('/api/matches', { method:'PATCH', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({id,date,place,startTime,endTime,method,scoreUs,scoreDraw,scoreThem,attendees,photos}) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || '수정 실패');
  return data;
}

export async function apiGetUsers() {
  const res = await fetch('/api/admin/users');
  if (!res.ok) return [];
  return res.json() as Promise<{id:string;name:string;role:string;mapped_member:string|null}[]>;
}

export async function apiSetCoach(userId: string, isCoach: boolean) {
  const res = await fetch('/api/admin/users', { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({userId,isCoach}) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function apiSetMapping(userId: string, memberName: string) {
  const res = await fetch('/api/admin/mapping', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({userId,memberName}) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export interface RankedMemberFull {
  name: string; attend: number; total: number; rate: number; score: number;
  lastScore: number; nextScore: number; rank: number; tier: string;
}

export async function apiGetStats(): Promise<RankedMemberFull[]> {
  const res = await fetch('/api/stats');
  if (!res.ok) return [];
  return res.json();
}
