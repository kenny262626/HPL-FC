'use client';

import { useEffect, useState } from 'react';
import { apiGetMatchHistory, apiUpdateMatch, MatchHistoryItem } from '@/lib/api';
import BottomNav from './BottomNav';

type Screen = 'home' | 'vote' | 'team' | 'match' | 'admin';

interface Props { canEdit: boolean; onNavigate: (s: Screen) => void; showToast: (m: string) => void; }

export default function MatchScreen({ canEdit, onNavigate, showToast }: Props) {
  const [matches, setMatches] = useState<MatchHistoryItem[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [scoreUs, setScoreUs] = useState(0);
  const [scoreThem, setScoreThem] = useState(0);

  useEffect(() => { apiGetMatchHistory().then(setMatches); }, []);

  async function handleSaveScore(m: MatchHistoryItem) {
    try {
      await apiUpdateMatch(m.id, scoreUs, scoreThem, m.photos || []);
      showToast('저장됐습니다!');
      setEditId(null);
      const updated = await apiGetMatchHistory();
      setMatches(updated);
    } catch { showToast('오류가 발생했습니다'); }
  }

  if (matches.length === 0) return (
    <div id="screen-match" className="screen active">
      <div className="team-header"><div className="team-header-title">MATCH</div><div className="team-header-sub">경기 기록</div></div>
      <div className="screen-scroll"><div className="no-match">아직 경기 기록이 없습니다</div></div>
      <BottomNav active="match" onNavigate={onNavigate} />
    </div>
  );

  return (
    <div id="screen-match" className="screen active">
      <div className="team-header"><div className="team-header-title">MATCH</div><div className="team-header-sub">경기 기록</div></div>
      <div className="screen-scroll">
        <div style={{padding:'16px 24px',display:'flex',flexDirection:'column',gap:16}}>
          {matches.map((m) => (
            <div key={m.id} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:16,overflow:'hidden'}}>
              {/* 헤더 */}
              <div style={{background:'linear-gradient(135deg,#1a1600,#151200)',padding:'14px 16px',borderBottom:'1px solid rgba(232,200,74,0.2)'}}>
                <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:18,color:'var(--accent)',letterSpacing:2}}>{m.date}</div>
                <div style={{fontSize:11,color:'var(--sub)',marginTop:2}}>{m.place} · {m.start_time}{m.end_time ? ` – ${m.end_time}` : ''} · {m.method}</div>
              </div>
              {/* 스코어 */}
              <div style={{padding:'14px 16px',display:'flex',alignItems:'center',justifyContent:'center',gap:16}}>
                {editId === m.id ? (
                  <>
                    <input type="number" value={scoreUs} onChange={e=>setScoreUs(Number(e.target.value))} style={{width:60,background:'#1a1a1a',border:'1px solid var(--accent)',borderRadius:8,padding:'6px 8px',color:'var(--text)',fontSize:22,textAlign:'center'}}/>
                    <span style={{fontSize:20,color:'var(--sub)'}}>:</span>
                    <input type="number" value={scoreThem} onChange={e=>setScoreThem(Number(e.target.value))} style={{width:60,background:'#1a1a1a',border:'1px solid var(--border)',borderRadius:8,padding:'6px 8px',color:'var(--text)',fontSize:22,textAlign:'center'}}/>
                    <button onClick={() => handleSaveScore(m)} style={{background:'linear-gradient(135deg,var(--gold),var(--gold2))',border:'none',borderRadius:8,padding:'6px 12px',color:'#000',fontWeight:900,cursor:'pointer',fontSize:12}}>저장</button>
                    <button onClick={() => setEditId(null)} style={{background:'var(--card2)',border:'1px solid var(--border)',borderRadius:8,padding:'6px 10px',color:'var(--sub)',cursor:'pointer',fontSize:12}}>취소</button>
                  </>
                ) : (
                  <>
                    <span style={{fontFamily:'Bebas Neue,sans-serif',fontSize:36,color:'var(--green)'}}>{m.score_us ?? '-'}</span>
                    <span style={{fontSize:20,color:'var(--sub)'}}>:</span>
                    <span style={{fontFamily:'Bebas Neue,sans-serif',fontSize:36,color:'var(--red)'}}>{m.score_them ?? '-'}</span>
                    {canEdit && (
                      <button onClick={() => { setEditId(m.id); setScoreUs(m.score_us||0); setScoreThem(m.score_them||0); }}
                        style={{marginLeft:8,background:'var(--card2)',border:'1px solid var(--border)',borderRadius:8,padding:'4px 10px',color:'var(--sub)',cursor:'pointer',fontSize:11}}>수정</button>
                    )}
                  </>
                )}
              </div>
              {/* 출석 멤버 */}
              {m.attendees && m.attendees.length > 0 && (
                <div style={{padding:'0 16px 14px'}}>
                  <div style={{fontSize:10,color:'var(--sub)',letterSpacing:2,marginBottom:8}}>ATTENDEES</div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                    {m.attendees.map(name => (
                      <div key={name} className="vote-member-chip attend"><div className="gem-dot"/>{name}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <BottomNav active="match" onNavigate={onNavigate} />
    </div>
  );
}
