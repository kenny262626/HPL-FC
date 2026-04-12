'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { apiGetMatch, apiSaveMatch, apiGetUsers, apiSetCoach, apiSetMapping, apiUpdateProfile, NextMatchData } from '@/lib/api';
import { getRankedMembers, getTierImage } from '@/lib/stats';
import { MEMBERS } from '@/lib/data';
import BottomNav from './BottomNav';

type Screen = 'home' | 'vote' | 'team' | 'match' | 'admin';

interface Props { userId: string; userName: string; memberName: string; role: string; onNavigate: (s: Screen) => void; onLogout: () => void; showToast: (m: string) => void; }

interface UserRecord { id: string; name: string; role: string; mapped_member: string | null; }

export default function AdminScreen({ userId, userName, memberName, role, onNavigate, onLogout, showToast }: Props) {
  const isAdmin = role === 'admin';
  const [nm, setNm] = useState<NextMatchData | null>(null);
  const [date, setDate] = useState('');
  const [place, setPlace] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [method, setMethod] = useState('');
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [newName, setNewName] = useState(userName);
  const [newPw, setNewPw] = useState('');

  // 내 랭킹/통계
  const ranked = getRankedMembers();
  const me = ranked.find(m => m.name === memberName);

  useEffect(() => {
    apiGetMatch().then(m => {
      setNm(m);
      if (m) { setDate(m.date||''); setPlace(m.place||''); setStartTime(m.start_time||''); setEndTime(m.end_time||''); setMethod(m.method||''); }
    });
    if (isAdmin) apiGetUsers().then(setUsers);
  }, [isAdmin]);

  async function handleSaveMatch() {
    if (!date) { showToast('날짜를 입력해주세요'); return; }
    try { await apiSaveMatch(date, place, startTime, endTime, method); showToast('경기 일정이 저장되었습니다!'); }
    catch { showToast('저장 중 오류가 발생했습니다'); }
  }

  async function handleCoach(u: UserRecord) {
    if (u.role === 'admin') return;
    const makeCoach = u.role !== 'coach';
    try { await apiSetCoach(u.id, makeCoach); showToast(makeCoach ? `${u.name} 코치로 지정됐습니다` : `${u.name} 코치 해제됐습니다`); apiGetUsers().then(setUsers); }
    catch { showToast('오류가 발생했습니다'); }
  }

  async function handleMapping(u: UserRecord, memberName: string) {
    try { await apiSetMapping(u.id, memberName); showToast('이름이 연결됐습니다!'); apiGetUsers().then(setUsers); }
    catch { showToast('오류가 발생했습니다'); }
  }

  async function handleSaveProfile() {
    try { await apiUpdateProfile(userId, newName, newPw); showToast('저장됐습니다!'); setShowProfile(false); }
    catch { showToast('오류가 발생했습니다'); }
  }

  const tierColor = me?.tier === 'gold' ? '#FFD700' : me?.tier === 'silver' ? '#C0C0C0' : '#CD7F32';
  const tierName = me?.tier === 'gold' ? '골드' : me?.tier === 'silver' ? '실버' : '브론즈';

  return (
    <div id="screen-admin" className="screen active">
      <div className="admin-header"><div className="admin-header-title">MY PAGE</div></div>
      <div className="screen-scroll">
        <div className="admin-section">

          {/* MY INFO */}
          <div className="admin-card">
            <div className="admin-card-title">MY INFO</div>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
              {me && <Image src={getTierImage(me.tier)} alt={me.tier} width={44} height={44} style={{objectFit:'contain'}}/>}
              <div>
                <div style={{fontSize:16,fontWeight:700,color:'var(--text)'}}>{memberName || userName}</div>
                <div style={{fontSize:12,color:tierColor,marginTop:2}}>{tierName} · #{me?.rank}</div>
              </div>
            </div>
            <div className="stats-row" style={{marginBottom:14}}>
              <div className="stat-item"><div className="stat-num">{me?.attend||0}</div><div className="stat-label">출석 횟수</div></div>
              <div className="stat-item"><div className="stat-num">{me?.rate||0}%</div><div className="stat-label">출석률</div></div>
              <div className="stat-item"><div className="stat-num">{me?.score||0}</div><div className="stat-label">총 점수</div></div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              <button className="admin-btn-secondary" onClick={() => setShowProfile(!showProfile)}>내 정보 변경</button>
              <button className="admin-btn-secondary" onClick={() => showToast('문의: happy.life.fc@gmail.com')}>문의</button>
              <button className="logout-btn" onClick={onLogout}>로그아웃</button>
            </div>
            {showProfile && (
              <div style={{marginTop:14,display:'flex',flexDirection:'column',gap:8}}>
                <div className="admin-label">이름</div>
                <input className="admin-input" value={newName} onChange={e=>setNewName(e.target.value)} style={{flex:'unset',width:'100%'}}/>
                <div className="admin-label">새 비밀번호 (변경 시만 입력)</div>
                <input className="admin-input" type="password" value={newPw} onChange={e=>setNewPw(e.target.value)} placeholder="변경 안 하면 빈칸" style={{flex:'unset',width:'100%'}}/>
                <button className="admin-btn" style={{width:'100%'}} onClick={handleSaveProfile}>저장</button>
              </div>
            )}
          </div>

          {/* NEXT MATCH REGISTER - 관리자만 */}
          {isAdmin && (
            <div className="admin-card">
              <div className="admin-card-title">NEXT MATCH REGISTER</div>
              <div className="admin-label">날짜</div>
              <div className="admin-input-row"><input className="admin-input" type="date" value={date} onChange={e=>setDate(e.target.value)}/></div>
              <div className="admin-label">장소</div>
              <div className="admin-input-row"><input className="admin-input" type="text" placeholder="예) 행복풋살장" value={place} onChange={e=>setPlace(e.target.value)}/></div>
              <div className="admin-label">시작 시간</div>
              <div className="admin-input-row"><input className="admin-input" type="time" value={startTime} onChange={e=>setStartTime(e.target.value)}/></div>
              <div className="admin-label">종료 시간</div>
              <div className="admin-input-row"><input className="admin-input" type="time" value={endTime} onChange={e=>setEndTime(e.target.value)}/></div>
              <div className="admin-label">방식</div>
              <div className="admin-input-row"><input className="admin-input" type="text" placeholder="예) 5vs5" value={method} onChange={e=>setMethod(e.target.value)}/></div>
              <div className="admin-input-row" style={{marginTop:4}}><button className="admin-btn" onClick={handleSaveMatch}>저장</button></div>
            </div>
          )}

          {/* 멤버 관리 - 관리자만 */}
          {isAdmin && (
            <div className="admin-card">
              <div className="admin-card-title">MEMBER MANAGEMENT</div>
              {users.filter(u => u.id !== 'admin').map(u => (
                <div key={u.id} style={{padding:'10px 0',borderBottom:'1px solid var(--border)',display:'flex',flexDirection:'column',gap:6}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <div>
                      <span style={{fontSize:13,color:'var(--text)',fontWeight:700}}>{u.name}</span>
                      <span style={{fontSize:11,color:'var(--sub)',marginLeft:6}}>@{u.id}</span>
                      {u.role === 'coach' && <span style={{marginLeft:6,fontSize:9,background:'rgba(232,200,74,0.15)',color:'var(--accent)',padding:'2px 6px',borderRadius:10}}>코치</span>}
                    </div>
                    <button onClick={() => handleCoach(u)}
                      style={{fontSize:11,padding:'4px 10px',borderRadius:8,border:'1px solid var(--border)',background:'var(--card2)',color:u.role==='coach'?'var(--red)':'var(--accent)',cursor:'pointer'}}>
                      {u.role === 'coach' ? '코치 해제' : '코치 지정'}
                    </button>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{fontSize:11,color:'var(--sub)'}}>매핑:</span>
                    <select defaultValue={u.mapped_member || ''} onChange={e => handleMapping(u, e.target.value)}
                      style={{flex:1,background:'#1a1a1a',border:'1px solid var(--border)',borderRadius:8,padding:'4px 8px',color:'var(--text)',fontSize:12}}>
                      <option value="">-- 연결 없음 --</option>
                      {MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
      <BottomNav active="admin" onNavigate={onNavigate} />
    </div>
  );
}
