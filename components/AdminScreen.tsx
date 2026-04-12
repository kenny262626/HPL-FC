'use client';

import { useEffect, useState } from 'react';
import { apiGetMatch, apiSaveMatch } from '@/lib/api';
import BottomNav from './BottomNav';

type Screen = 'home' | 'vote' | 'team' | 'admin';

interface Props {
  userId: string;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  showToast: (msg: string) => void;
}

export default function AdminScreen({ userId, onNavigate, onLogout, showToast }: Props) {
  const [date, setDate] = useState('');
  const [place, setPlace] = useState('');
  const [time, setTime] = useState('');
  const [method, setMethod] = useState('');

  useEffect(() => {
    apiGetMatch().then((nm) => {
      if (nm) {
        setDate(nm.date || '');
        setPlace(nm.place || '');
        setTime(nm.time || '');
        setMethod(nm.method || '');
      }
    });
  }, []);

  async function handleSave() {
    if (!date) { showToast('날짜를 입력해주세요'); return; }
    try {
      await apiSaveMatch(date, place, time, method);
      showToast('경기 일정이 저장되었습니다!');
    } catch {
      showToast('저장 중 오류가 발생했습니다');
    }
  }

  return (
    <div id="screen-admin" className="screen active">
      <div className="admin-header">
        <div className="admin-header-title">MY PAGE</div>
      </div>
      <div className="screen-scroll">
        <div className="admin-section">
          <div className="admin-card">
            <div className="admin-card-title">MY INFO</div>
            <div className="logged-in-info">로그인: <span>{userId}</span></div>
            <button className="logout-btn" onClick={onLogout}>로그아웃</button>
          </div>

          <div className="admin-card">
            <div className="admin-card-title">NEXT MATCH REGISTER</div>
            <div className="admin-label">날짜</div>
            <div className="admin-input-row">
              <input className="admin-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="admin-label">장소</div>
            <div className="admin-input-row">
              <input className="admin-input" type="text" placeholder="예) 행복풋살장" value={place} onChange={e => setPlace(e.target.value)} />
            </div>
            <div className="admin-label">시간</div>
            <div className="admin-input-row">
              <input className="admin-input" type="time" value={time} onChange={e => setTime(e.target.value)} />
            </div>
            <div className="admin-label">방식</div>
            <div className="admin-input-row">
              <input className="admin-input" type="text" placeholder="예) 5vs5" value={method} onChange={e => setMethod(e.target.value)} />
            </div>
            <div className="admin-input-row" style={{ marginTop: '4px' }}>
              <button className="admin-btn" onClick={handleSave}>저장</button>
            </div>
          </div>
        </div>
      </div>
      <BottomNav active="admin" onNavigate={onNavigate} />
    </div>
  );
}
