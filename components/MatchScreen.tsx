'use client';

import { useEffect, useState, useRef } from 'react';
import { apiGetMatchHistory, apiUpdateMatch, MatchHistoryItem } from '@/lib/api';
import { MEMBERS } from '@/lib/data';
import BottomNav from './BottomNav';

type Screen = 'home' | 'vote' | 'team' | 'match' | 'admin';
interface Props { canEdit: boolean; onNavigate: (s: Screen) => void; showToast: (m: string) => void; }

function getResult(us: number, them: number) {
  if (us > them) return { text: '승', color: 'var(--green)' };
  if (us < them) return { text: '패', color: 'var(--red)' };
  return { text: null, color: '#aaa' };
}

interface EditState {
  date: string; place: string; startTime: string; endTime: string; method: string;
  scoreUs: number; scoreThem: number; attendees: string[]; photos: string[];
}

export default function MatchScreen({ canEdit, onNavigate, showToast }: Props) {
  const [matches, setMatches] = useState<MatchHistoryItem[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [edit, setEdit] = useState<EditState | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { apiGetMatchHistory().then(setMatches); }, []);

  function openEdit(m: MatchHistoryItem) {
    setEditId(m.id);
    setEdit({
      date: m.date || '', place: m.place || '', startTime: m.start_time || '',
      endTime: m.end_time || '', method: m.method || '',
      scoreUs: m.score_us || 0, scoreThem: m.score_them || 0,
      attendees: m.attendees || [], photos: m.photos || [],
    });
  }

  async function handleSave() {
    if (!edit || editId === null) return;
    try {
      await apiUpdateMatch(editId, edit.date, edit.place, edit.startTime, edit.endTime,
        edit.method, edit.scoreUs, edit.scoreThem, edit.attendees, edit.photos);
      showToast('저장됐습니다!');
      setEditId(null); setEdit(null);
      apiGetMatchHistory().then(setMatches);
    } catch { showToast('오류가 발생했습니다'); }
  }

  function toggleAttendee(name: string) {
    if (!edit) return;
    const has = edit.attendees.includes(name);
    setEdit({ ...edit, attendees: has ? edit.attendees.filter(n => n !== name) : [...edit.attendees, name] });
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!edit || !e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const files = Array.from(e.target.files);
    const newPhotos: string[] = [];
    for (const file of files) {
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target?.result as string);
        reader.readAsDataURL(file);
      });
      newPhotos.push(dataUrl);
    }
    setEdit({ ...edit, photos: [...edit.photos, ...newPhotos] });
    setUploading(false);
    e.target.value = '';
  }

  function removePhoto(idx: number) {
    if (!edit) return;
    setEdit({ ...edit, photos: edit.photos.filter((_, i) => i !== idx) });
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
          {matches.map((m) => {
            const isEditing = editId === m.id;
            const res = getResult(m.score_us || 0, m.score_them || 0);
            return (
              <div key={m.id} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:16,overflow:'hidden'}}>

                {/* 헤더 */}
                <div style={{background:'linear-gradient(135deg,#1a1600,#151200)',padding:'14px 16px',borderBottom:'1px solid rgba(232,200,74,0.2)',display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <div>
                    <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:18,color:'var(--accent)',letterSpacing:2}}>{m.date}</div>
                    <div style={{fontSize:11,color:'var(--sub)',marginTop:2}}>
                      {[m.place, m.start_time && m.end_time ? `${m.start_time} – ${m.end_time}` : m.start_time, m.method].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                  {canEdit && !isEditing && (
                    <button onClick={() => openEdit(m)}
                      style={{background:'none',border:'1px solid var(--border)',borderRadius:8,width:32,height:32,cursor:'pointer',color:'var(--sub)',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center'}}>
                      ⚙️
                    </button>
                  )}
                </div>

                {/* 수정 모드 */}
                {isEditing && edit && (
                  <div style={{padding:'16px',display:'flex',flexDirection:'column',gap:10,borderBottom:'1px solid var(--border)'}}>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                      <div>
                        <div style={{fontSize:10,color:'var(--sub)',marginBottom:4}}>날짜</div>
                        <input type="date" value={edit.date} onChange={e=>setEdit({...edit,date:e.target.value})} className="admin-input" style={{width:'100%'}}/>
                      </div>
                      <div>
                        <div style={{fontSize:10,color:'var(--sub)',marginBottom:4}}>장소</div>
                        <input type="text" value={edit.place} onChange={e=>setEdit({...edit,place:e.target.value})} className="admin-input" placeholder="장소" style={{width:'100%'}}/>
                      </div>
                      <div>
                        <div style={{fontSize:10,color:'var(--sub)',marginBottom:4}}>시작</div>
                        <input type="time" value={edit.startTime} onChange={e=>setEdit({...edit,startTime:e.target.value})} className="admin-input" style={{width:'100%'}}/>
                      </div>
                      <div>
                        <div style={{fontSize:10,color:'var(--sub)',marginBottom:4}}>종료</div>
                        <input type="time" value={edit.endTime} onChange={e=>setEdit({...edit,endTime:e.target.value})} className="admin-input" style={{width:'100%'}}/>
                      </div>
                    </div>
                    <div>
                      <div style={{fontSize:10,color:'var(--sub)',marginBottom:4}}>방식</div>
                      <input type="text" value={edit.method} onChange={e=>setEdit({...edit,method:e.target.value})} className="admin-input" placeholder="예) 5vs5" style={{width:'100%'}}/>
                    </div>
                    <div>
                      <div style={{fontSize:10,color:'var(--sub)',marginBottom:6}}>스코어</div>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <input type="number" value={edit.scoreUs} onChange={e=>setEdit({...edit,scoreUs:Number(e.target.value)})}
                          style={{width:60,background:'#1a1a1a',border:'1px solid var(--accent)',borderRadius:8,padding:'6px 8px',color:'var(--text)',fontSize:20,textAlign:'center'}}/>
                        <span style={{color:'var(--sub)',fontSize:18}}>:</span>
                        <input type="number" value={edit.scoreThem} onChange={e=>setEdit({...edit,scoreThem:Number(e.target.value)})}
                          style={{width:60,background:'#1a1a1a',border:'1px solid var(--border)',borderRadius:8,padding:'6px 8px',color:'var(--text)',fontSize:20,textAlign:'center'}}/>
                      </div>
                    </div>
                    <div>
                      <div style={{fontSize:10,color:'var(--sub)',marginBottom:6}}>출석 멤버 (클릭으로 선택)</div>
                      <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                        {MEMBERS.map(name => (
                          <div key={name} onClick={() => toggleAttendee(name)}
                            style={{padding:'4px 12px',borderRadius:20,fontSize:12,cursor:'pointer',border:'1px solid',
                              borderColor: edit.attendees.includes(name) ? 'rgba(74,222,128,0.4)' : 'var(--border)',
                              color: edit.attendees.includes(name) ? 'var(--green)' : 'var(--sub)',
                              background: edit.attendees.includes(name) ? 'rgba(74,222,128,0.08)' : 'var(--card2)'}}>
                            {name}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* 사진 업로드 */}
                    <div>
                      <div style={{fontSize:10,color:'var(--sub)',marginBottom:6}}>사진</div>
                      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileUpload}
                        style={{display:'none'}}/>
                      <button onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        style={{width:'100%',background:'var(--card2)',border:'1px dashed var(--border)',borderRadius:10,padding:'12px',color:'var(--sub)',cursor:'pointer',fontSize:13}}>
                        {uploading ? '업로드 중...' : '📷 앨범에서 사진 추가'}
                      </button>
                      {edit.photos.length > 0 && (
                        <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:8}}>
                          {edit.photos.map((url, i) => (
                            <div key={i} style={{position:'relative'}}>
                              <img src={url} alt="" style={{width:70,height:70,objectFit:'cover',borderRadius:8}}/>
                              <button onClick={() => removePhoto(i)}
                                style={{position:'absolute',top:-4,right:-4,background:'var(--red)',border:'none',borderRadius:'50%',width:18,height:18,color:'#fff',cursor:'pointer',fontSize:11,lineHeight:'18px',textAlign:'center',padding:0}}>×</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{display:'flex',gap:8,marginTop:4}}>
                      <button onClick={handleSave} style={{flex:1,background:'linear-gradient(135deg,var(--gold),var(--gold2))',border:'none',borderRadius:10,padding:'10px',color:'#000',fontWeight:900,cursor:'pointer',fontSize:13}}>저장</button>
                      <button onClick={() => {setEditId(null);setEdit(null);}} style={{flex:1,background:'var(--card2)',border:'1px solid var(--border)',borderRadius:10,padding:'10px',color:'var(--sub)',cursor:'pointer',fontSize:13}}>취소</button>
                    </div>
                  </div>
                )}

                {/* 스코어 표시 */}
                {!isEditing && (
                  <div style={{padding:'14px 16px',display:'flex',alignItems:'center',justifyContent:'center',gap:16}}>
                    {res.text && (
                      <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:20,color:res.color,background:`${res.color}18`,borderRadius:8,padding:'4px 12px'}}>
                        {res.text}
                      </div>
                    )}
                    <span style={{fontFamily:'Bebas Neue,sans-serif',fontSize:36,color:'var(--text)'}}>{m.score_us ?? '-'}</span>
                    <span style={{fontSize:20,color:'var(--sub)'}}>:</span>
                    <span style={{fontFamily:'Bebas Neue,sans-serif',fontSize:36,color:'var(--text)'}}>{m.score_them ?? '-'}</span>
                  </div>
                )}

                {/* 사진 */}
                {!isEditing && m.photos && m.photos.length > 0 && (
                  <div style={{padding:'0 16px 14px',display:'flex',gap:8,overflowX:'auto'}}>
                    {m.photos.map((url, i) => (
                      <img key={i} src={url} alt="" style={{width:90,height:90,objectFit:'cover',borderRadius:10,flexShrink:0}}/>
                    ))}
                  </div>
                )}

                {/* 출석 멤버 */}
                {!isEditing && m.attendees && m.attendees.length > 0 && (
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
            );
          })}
        </div>
      </div>
      <BottomNav active="match" onNavigate={onNavigate} />
    </div>
  );
}
