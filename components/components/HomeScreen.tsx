'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { apiGetVotes, apiGetMatch, NextMatchData } from '@/lib/api';
import { getRankedMembers, getTierImage } from '@/lib/stats';
import { MEMBERS } from '@/lib/data';
import BottomNav from './BottomNav';

type Screen = 'home' | 'vote' | 'team' | 'match' | 'admin';

interface Props { userId: string; userName: string; memberName: string; onNavigate: (s: Screen) => void; }

export default function HomeScreen({ userId, userName, memberName, onNavigate }: Props) {
  const [nm, setNm] = useState<NextMatchData | null>(null);
  const [attendCnt, setAttendCnt] = useState(0);
  const [absentCnt, setAbsentCnt] = useState(0);
  const [novoteCnt, setNovoteCnt] = useState(0);
  const [myStats, setMyStats] = useState({ attend: 0, rate: '0%', score: 0, tier: 'bronze' as string, rank: 0 });

  useEffect(() => {
    async function load() {
      const [match, votes] = await Promise.all([apiGetMatch(), apiGetVotes()]);
      setNm(match);
      let ac = 0, ab = 0;
      Object.values(votes).forEach((v) => { if (v === 'attend') ac++; else if (v === 'absent') ab++; });
      setAttendCnt(ac); setAbsentCnt(ab); setNovoteCnt(MEMBERS.length - ac - ab);
      const ranked = getRankedMembers();
      const me = ranked.find((m) => m.name === memberName);
      if (me) setMyStats({ attend: me.attend, rate: me.rate + '%', score: me.score, tier: me.tier, rank: me.rank });
    }
    load();
  }, [memberName]);

  const timeStr = nm?.start_time && nm?.end_time ? `${nm.start_time} – ${nm.end_time}` : nm?.start_time || '시간 미정';

  return (
    <div id="screen-home" className="screen active">
      <div className="screen-scroll">
        <div className="home-header">
          <div>
            <div className="home-greeting">Welcome back</div>
            <div className="home-title">{userName.toUpperCase()}</div>
          </div>
          <div className="home-logo-small">
            <Image src="/images/logo.jpg" alt="HPLFC" width={36} height={36} style={{borderRadius:'50%',objectFit:'cover'}}/>
          </div>
        </div>

        <div className="section-title">UPCOMING MATCH</div>
        <div className="upcoming-card">
          <div className="upcoming-badge">NEXT MATCH</div>
          <div className="upcoming-date">{nm?.date || 'TBD'}</div>
          <div className="upcoming-info">
            <div className="upcoming-info-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#888"/></svg>
              <span>{nm?.place || '장소 미정'}</span>
            </div>
            <div className="upcoming-info-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 5v5.25l4.5 2.67-.75 1.23L11 13V7h1.5z" fill="#888"/></svg>
              <span>{timeStr}</span>
            </div>
            <div className="upcoming-info-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="#888"/></svg>
              <span>{nm?.method || '방식 미정'}</span>
            </div>
          </div>
          <div className="vote-counts">
            <div className="vote-count-item"><div className="vote-count-num" style={{color:'var(--green)'}}>{attendCnt}</div><div className="vote-count-label">출석</div></div>
            <div className="vote-count-item"><div className="vote-count-num" style={{color:'var(--red)'}}>{absentCnt}</div><div className="vote-count-label">불참</div></div>
            <div className="vote-count-item"><div className="vote-count-num" style={{color:'var(--sub)'}}>{novoteCnt}</div><div className="vote-count-label">미투표</div></div>
          </div>
          <button className="attend-btn" onClick={() => onNavigate('vote')}>출석 투표하기</button>
        </div>

        <div className="section-title">MY STATS</div>
        <div className="my-stats-card">
          <div className="my-stats-header">
            <div className="my-stats-title">{memberName || userName}</div>
            <div style={{display:'flex',alignItems:'center',gap:6}}>
              <Image src={getTierImage(myStats.tier as 'gold'|'silver'|'bronze')} alt={myStats.tier} width={28} height={28} style={{objectFit:'contain'}}/>
              <span style={{fontSize:12,fontWeight:700,color:myStats.tier==='gold'?'#FFD700':myStats.tier==='silver'?'#C0C0C0':'#CD7F32'}}>
                {myStats.tier==='gold'?'골드':myStats.tier==='silver'?'실버':'브론즈'}
              </span>
            </div>
          </div>
          <div className="stats-row">
            <div className="stat-item"><div className="stat-num">{myStats.attend}</div><div className="stat-label">출석 횟수</div></div>
            <div className="stat-item"><div className="stat-num">{myStats.rate}</div><div className="stat-label">출석률</div></div>
            <div className="stat-item"><div className="stat-num">{myStats.score}</div><div className="stat-label">총 점수</div></div>
          </div>
        </div>
      </div>
      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  );
}
