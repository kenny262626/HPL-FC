export interface UserRecord {
  name: string;
  pw: string;
  createdAt: string;
}

export interface NextMatch {
  date: string;
  place: string;
  time: string;
  method: string;
}

export type VoteType = 'attend' | 'absent';
export type VotesMap = Record<string, VoteType>;
export type UsersMap = Record<string, UserRecord>;

export function getUsers(): UsersMap {
  try {
    return JSON.parse(localStorage.getItem('hplfc_users') || '{}');
  } catch { return {}; }
}

export function saveUsers(users: UsersMap): void {
  localStorage.setItem('hplfc_users', JSON.stringify(users));
}

export function getCurrentUser(): string {
  return localStorage.getItem('hplfc_current_user') || '';
}

export function setCurrentUser(id: string): void {
  localStorage.setItem('hplfc_current_user', id);
}

export function getNextMatch(): NextMatch | null {
  try {
    return JSON.parse(localStorage.getItem('hplfc_next_match') || 'null');
  } catch { return null; }
}

export function saveNextMatch(nm: NextMatch): void {
  localStorage.setItem('hplfc_next_match', JSON.stringify(nm));
}

export function getVotes(): VotesMap {
  try {
    return JSON.parse(localStorage.getItem('hplfc_votes') || '{}');
  } catch { return {}; }
}

export function saveVotes(v: VotesMap): void {
  localStorage.setItem('hplfc_votes', JSON.stringify(v));
}
