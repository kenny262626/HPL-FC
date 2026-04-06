// src/data/hlfc.ts

export const TEAM_MEMBERS = [
  { rank: 1,  name: '홍강현', attend: 12, score: 30, rate: 92.3, avClass: 'av1' },
  { rank: 2,  name: '오승엽', attend: 28, score: 70, rate: 87.5, avClass: 'av2' },
  { rank: 3,  name: '김연호', attend: 13, score: 28, rate: 86.7, avClass: 'av3' },
  { rank: 4,  name: '유승한', attend: 26, score: 64, rate: 83.9, avClass: 'av4' },
  { rank: 5,  name: '강태훈', attend: 18, score: 43, rate: 81.8, avClass: 'av5' },
  { rank: 6,  name: '진대철', attend: 25, score: 54, rate: 78.1, avClass: 'av6' },
  { rank: 7,  name: '오승영', attend: 15, score: 26, rate: 75.0, avClass: 'av7' },
  { rank: 8,  name: '최상원', attend: 8,  score: 12, rate: 72.7, avClass: 'av8' },
  { rank: 9,  name: '김성진', attend: 22, score: 44, rate: 71.0, avClass: 'av9' },
  { rank: 9,  name: '이도훈', attend: 22, score: 45, rate: 71.0, avClass: 'av10' },
  { rank: 11, name: '박재현', attend: 17, score: 28, rate: 68.0, avClass: 'av11' },
  { rank: 12, name: '김종원', attend: 21, score: 46, rate: 65.6, avClass: 'av12' },
];


// ===== 매치 기록 타입 =====
interface MatchHistory {
  id: number;
  date: string;
  result: 'win' | 'lose' | 'draw';
  score: string;
  members: string[];
  hasPhoto: boolean;
  title?: string;  // ✅ 선택적 속성 추가
}

export const MATCH_HISTORY: MatchHistory[] = [
  {
    id: 1,
    date: '2025년 3월 22일 (토)',
    result: 'win',
    score: '7 : 4',
    members: ['홍강현','오승엽','김연호','유승한','강태훈','진대철','오승영','최상원','김성진','이도훈'],
    hasPhoto: true,
  },
  // ... 나머지 동일

  {
    id: 1,
    date: '2025년 3월 22일 (토)',

    result: 'win',
    score: '7 : 4',
    members: ['홍강현','오승엽','김연호','유승한','강태훈','진대철','오승영','최상원','김성진','이도훈'],
    hasPhoto: true,
  },
  {
    id: 2,
    date: '2025년 3월 15일 (토)',
    result: 'draw',
    score: '5 : 5',
    members: ['홍강현','오승엽','유승한','강태훈','진대철','오승영','박재현','김종원','이도훈','김성진'],
    hasPhoto: false,
  },
  {
    id: 3,
    date: '2025년 3월 8일 (토)',
    result: 'lose',
    score: '3 : 6',
    members: ['홍강현','김연호','유승한','강태훈','진대철','오승영','최상원','박재현','김종원'],
    hasPhoto: true,
  },
  {
    id: 4,
    date: '2025년 3월 1일 (토)',
    result: 'win',
    score: '8 : 3',
    members: ['오승엽','김연호','유승한','강태훈','진대철','오승영','최상원','김성진','이도훈','박재현','김종원'],
    hasPhoto: false,
  },
];

export const ACCOUNTS = [
  { id: 'demo', pw: '1234', name: '홍강현', memberIdx: 0 },
  { id: 'hong', pw: '1234', name: '홍강현', memberIdx: 0 },
  { id: 'oh',   pw: '1234', name: '오승엽', memberIdx: 1 },
];

// ===== 게임 탭 - 팀 대결 기록 =====
export const GAME_RECORDS = [
  {
    id: 1,
    date: '2025년 3월 22일',
    teamA: { name: 'A팀', members: ['홍강현','오승엽','김연호','유승한','강태훈'], score: 7 },
    teamB: { name: 'B팀', members: ['진대철','오승영','최상원','김성진','이도훈'], score: 4 },
  },
  {
    id: 2,
    date: '2025년 3월 15일',
    teamA: { name: 'A팀', members: ['홍강현','오승엽','유승한','강태훈','진대철'], score: 5 },
    teamB: { name: 'B팀', members: ['오승영','박재현','김종원','이도훈','김성진'], score: 5 },
  },
  {
    id: 3,
    date: '2025년 3월 8일',
    teamA: { name: 'A팀', members: ['홍강현','김연호','유승한','강태훈','진대철'], score: 3 },
    teamB: { name: 'B팀', members: ['오승영','최상원','박재현','김종원','이도훈'], score: 6 },
  },
];

