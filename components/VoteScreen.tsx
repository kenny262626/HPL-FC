'use client';

import { useEffect, useState } from 'react';
import { apiGetVotes, apiCastVote, apiGetMatch } from '@/lib/api';
import { MEMBERS } from '@/lib/data';
import BottomNav from './BottomNav';

type Screen = 'home' | 'vote' | 'team' | 'admin';

interface Props {
  userName: string;
  onNavigate: (screen: Screen) => void;
  showToast: (msg: string) => void;
}

export default function VoteScreen({ userName, onNavigate, showToast }: Props) {
  const [matchDate, setMatchDate] = useState('다음 경기 일정');
  const [matchInfo, setMatchInfo] = useState('일정이 등록되지 않았습니다');
  const [attendList, setAttendList] = useState<string[]>([]);
  const [absentList, setAbsentList] = useState<string[]>([]);
  const [novoteList, setNovoteList] = useState<string[]>([]);

  async function loadData() {
    const [nm, votes] = await Promise.all([apiGetMatch(), apiGetVotes()]);
    if (nm) {
      setMatchDate(nm.date);
      setMatchInfo(`장소: ${nm.place || '미정'}\n시간: ${nm.time || '미정'}\n방식: ${nm.method || '미정'}`);
    } else {
      setMatchDate('다음 경기 일정');
      setMatchInfo('등록된 일정이 없습니다');
    }
    const a: string[] = [], b: string[] = [], n: string[] = [];
    MEMBERS.forEach((m) => {
      if (votes[m] === 'attend') a.push(m);
      else if (votes[m] === 'absent') b.push(m);
      else n.push(m);
    });
    setAttendList(a);
    setAbsentList(b);
    setNovoteList(n);
  }

  useEffect(() => { loadData(); }, []);

  async function castVote(type: 'attend' | 'absent') {
    if (!userName || !MEMBERS.includes(userName)) {
      showToast('팀 멤버만 투표할 수 있습니다');
      return;
    }
    const votes = await apiGetVotes();
    if (votes[userName] === type) {
      showToast(type === 'attend' ? '이미 출석으로 투표했습니다' : '이미 불참으로 투표했습니다');
      return;
    }
    try {
      await apiCastVote(userName, type);
      showToast(type === 'attend' ? '출석으로 투표했습니다!' : '불참으로 투표했습니다');
      loadData();
    } catch {
      showToast('투표 중 오류가 발생했습니다');
    }
  }

  return (
    <div id="screen-vote" className="screen active">
      <div className="vote-header">
        <div className="vote-header-title">ATTENDANCE VOTE</div>
        <div className="vote-header-sub">다음 경기 출석 여부를 투표해주세요</div>
      </div>
      <div className="screen-scroll">
        <div className="vote-match-card">
          <div className="vote-match-date">{matchDate}</div>
          <div className="vote-match-info" style={{ whiteSpace: 'pre-line' }}>{matchInfo}</div>
        </div>

        <div className="vote-buttons">
          <button className="vote-ox-btn attend-vote" onClick={() => castVote('attend')}>
            <div className="vote-ox-letter" style={{ color: 'var(--green)' }}>O</div>
            <div className="vote-ox-label">출석</div>
          </button>
          <button className="vote-ox-btn absent-vote" onClick={() => castVote('absent')}>
            <div className="vote-ox-letter" style={{ color: 'var(--red)' }}>X</div>
            <div className="vote-ox-label">불참</div>
          </button>
        </div>

        <div className="vote-list-section">
          <div className="vote-list-header">
            <div className="vote-list-title">출석</div>
            <div className="vote-list-count" style={{ color: 'var(--green)' }}>{attendList.length}</div>
          </div>
          <div className="vote-member-list">
            {attendList.map((name) => (
              <div key={name} className="vote-member-chip attend"><div className="gem-dot" />{name}</div>
            ))}
          </div>

          <div className="vote-list-header">
            <div className="vote-list-title">불참</div>
            <div className="vote-list-count" style={{ color: 'var(--red)' }}>{absentList.length}</div>
          </div>
          <div className="vote-member-list">
            {absentList.map((name) => (
              <div key={name} className="vote-member-chip absent"><div className="gem-dot" />{name}</div>
            ))}
          </div>

          <div className="vote-list-header">
            <div className="vote-list-title">미투표</div>
            <div className="vote-list-count" style={{ color: 'var(--sub)' }}>{novoteList.length}</div>
          </div>
          <div className="vote-member-list">
            {novoteList.map((name) => (
              <div key={name} className="vote-member-chip"><div className="gem-dot" />{name}</div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav active="vote" onNavigate={onNavigate} />
    </div>
  );
}
