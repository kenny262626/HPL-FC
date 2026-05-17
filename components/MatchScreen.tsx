'use client';

import { useEffect, useState, useRef } from 'react';
import { apiGetMatchHistory, apiUpdateMatch, apiDeleteMatch, apiAddMatch, MatchHistoryItem } from '@/lib/api';
import { MEMBERS } from '@/lib/data';
import BottomNav from './BottomNav';

type Screen = 'home' | 'vote' | 'team' | 'match' | 'admin';
interface Props { canEdit: boolean; onNavigate: (s: Screen) => void; showToast: (m: string) => void; }

interface EditState {
  date: string; place: string; startTime: string; endTime: string; method: string;
  scoreUs: number; scoreDraw: number; scoreThem: number; attendees: string[]; photos: string[];
}

const emptyEdit = (): EditState => ({
  date: '', place: '', startTime: '', endTime: '', method: '',
  scoreUs: 0, scoreDraw: 0, scoreThem: 0, attendees: [], photos: [],
});

export default function MatchScreen({ canEdit, onNavigate, showToast }: Props) {
  const [matches, setMatches] = useState<MatchHistoryItem[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [edit, setEdit] = useState<EditState | null>(null);
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMatch, setNewMatch] = useState<EditState>(emptyEdit());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { apiGetMatchHistory().then(setMatches); }, []);

  function openEdit(m: MatchHistoryItem) {
    setEditId(m.id);
    setEdit({
      date: m.date || '', place: m.place || '', startTime: m.start_time || '',
      endTime: m.end_time || '', method: m.method || '',
      scoreUs: m.score_us || 0,
      scoreDraw: (m as unknown as Record<string, number>).score_draw || 0,
      scoreThem: m.score_them || 0,
      attendees: m.attendees || [], photos: m.photos || [],
    });
  }

  async function handleDelete(id: number) {
    try {
      await apiDeleteMatch(id);
      showToast('매치가 삭제됐습니다');
      setConfirmDelete(null);
      setEditId(null); setEdit(null);
      apiGetMatchHistory().then(setMatches);
    } catch { showToast('삭제 중 오류가 발생했습니다'); }
  }

  async function handleSave() {
    if (!edit || editId === null) return;
    try {
      await apiUpdateMatch(editId, edit.date, edit.place, edit.startTime, edit.endTime,
        edit.method, edit.scoreUs, edit.scoreThem, edit.attendees, edit.photos, edit.scoreDraw);
      showToast('저장됐습니다!');
      setEditId(null); setEdit(null);
      apiGetMatchHistory().then(setMatches);
    } catch { showToast('오류가 발생했습니다'); }
  }

  async function handleAdd() {
    if (!newMatch.date) { showToast('날짜를 입력해주세요'); return; }
    try {
      await apiAddMatch(newMatch.date, newMatch.place, newMatch.startTime, newMatch.endTime,
        newMatch.method, newMatch.scoreUs, newMatch.scoreDraw, newMatch.scoreThem, newMatch.attendees);
      showToast('매치가 추가됐습니다!');
      setShowAddForm(false);
      setNewMatch(emptyEdit());
      apiGetMatchHistory().then(setMatches);
    } catch { showToast('오류가 발생했습니다'); }
  }

  function toggleAttendee(name: string, isNew = false) {
    if (isNew) {
      const has = newMatch.attendees.includes(name);
      setNewMatch({ ...newMatch, attendees: has ? newMatch.attendees.filter(n => n !== name) : [...newMatch.attendees, name] });
    } else {
      if (!edit) return;
      const has = edit.attendees.includes(name);
      setEdit({ ...edit, attendees: has ? edit.attendees.filter(n => n !== name) : [...edit.attendees, name] });
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, isNew = false) {
    const target = isNew ? newMatch : edit;
    if (!target || !e.target.files || e.target.files.length === 0) return;
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
    if (isNew) setNewMatch({ ...newMatch, photos: [...newMatch.photos, ...newPhotos] });
    else setEdit({ ...edit!, photos: [...edit!.photos, ...newPhotos] });
    setUploading(false);
    e.target.value = '';
  }

  function removePhoto(idx: number, isNew = false) {
    if (isNew) setNewMatch({ ...newMatch, photos: newMatch.photos.filter((_, i) => i !== idx) });
    else if (edit) setEdit({ ...edit, photos: edit.photos.filter((_, i) => i !== idx) });
  }

  // 공통 폼 렌더링
  function renderForm(state: EditState, setState: (s: EditState) => void, isNew = false) {
    return (
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          <div>
            <div style={{fontSize:10,color:'var(--sub)',marginBottom:4}}>날짜</div>
            <input type="date" value={state.date} onChange={e=>setState({...state,date:e.target.value})} className="admin-input" style={{width:'100%'}}/>
          </div>
          <div>
            <div style={{fontSize:10,color:'var(--sub)',marginBottom:4}}>장소</div>
            <input type="text" value={state.place} onChange={e=>setState({...state,place:e.target.value})} className="admin-input" placeholder="장소" style={{width:'100%'}}/>
          </div>
          <div>
            <div style={{fontSize:10,color:'var(--sub)',marginBottom:4}}>시작</div>
            <input type="time" value={state.startTime} onChange={e=>setState({...state,startTime:e.target.value})} className="admin-input" style={{width:'100%'}}/>
          </div>
          <div>
            <div style={{fontSize:10,color:'var(--sub)',marginBottom:4}}>종료</div>
            <input type="time" value={state.endTime} onChange={e=>setState({...state,endTime:e.target.value})} className="admin-input" style={{width:'100%'}}/>
          </div>
        </div>
        <div>
          <div style={{fontSize:10,color:'var(--sub)',marginBottom:4}}>방식</div>
          <input type="text" value={state.method} onChange={e=>setState({...state,method:e.target.value})} className="admin-input" placeholder="예) 5vs5" style={{width:'100%'}}/>
        </div>
        <div>
          <div style={{fontSize:10,color:'var(--sub)',marginBottom:8}}>스코어 (승 : 무 : 패)</div>
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
              <input type="number" min="0" value={state.scoreUs} onChange={e=>setState({...state,scoreUs:Number(e.target.value)})}
                style={{width:'100%',background:'#1a1a1a',border:'1px solid var(--green)',borderRadius:8,padding:'8px',color:'var(--green)',fontSize:22,textAlign:'center'}}/>
              <span style={{fontSize:10,color:'var(--green)'}}>승</span>
            </div>
            <span style={{color:'var(--sub)',fontSize:20,marginBottom:16}}>:</span>
            <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
              <input type="number" min="0" value={state.scoreDraw} onChange={e=>setState({...state,scoreDraw:Number(e.target.value)})}
                style={{width:'100%',background:'#1a1a1a',border:'1px solid #888',borderRadius:8,padding:'8px',color:'#aaa',fontSize:22,textAlign:'center'}}/>
              <span style={{fontSize:10,color:'#888'}}>무</span>
            </div>
            <span style={{color:'var(--sub)',fontSize:20,marginBottom:16}}>:</span>
            <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
              <input type="number" min="0" value={state.scoreThem} onChange={e=>setState({...state,scoreThem:Number(e.target.value)})}
                style={{width:'100%',background:'#1a1a1a',border:'1px solid var(--red)',borderRadius:8,padding:'8px',color:'var(--red)',fontSize:22,textAlign:'center'}}/>
              <span style={{fontSize:10,color:'var(--red)'}}>패</span>
            </div>
          </div>
        </div>
        <div>
          <div style={{fontSize:10,color:'var(--sub)',marginBottom:6}}>출석 멤버 (클릭으로 선택)</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
            {MEMBERS.map(name => (
              <div key={name} onClick={() => toggleAttendee(name, isNew)}
                style={{padding:'4px 12px',borderRadius:20,fontSize:12,cursor:'pointer',border:'1px solid',
                  borderColor: state.attendees.includes(name) ? 'rgba(74,222,128,0.4)' : 'var(--border)',
                  color: state.attendees.includes(name) ? 'var(--green)' : 'var(--sub)',
                  background: state.attendees.includes(name) ? 'rgba(74,222,128,0.08)' : 'var(--card2)'}}>
                {name}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{fontSize:10,color:'var(--sub)',marginBottom:6}}>사진</div>
          <input ref={isNew ? addFileInputRef : fileInputRef} type="file" accept="image/*" multiple
            onChange={e => handleFileUpload(e, isNew)} style={{display:'none'}}/>
          <button onClick={() => (isNew ? addFileInputRef : fileInputRef).current?.click()} disabled={uploading}
            style={{width:'100%',background:'var(--card2)',border:'1px dashed var(--border)',borderRadius:10,padding:'12px',color:'var(--sub)',cursor:'pointer',fontSize:13}}>
            {uploading ? '업로드 중...' : '📷 앨범에서 사진 추가'}
          </button>
          {state.photos.length > 0 && (
            <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:8}}>
              {state.photos.map((url, i) => (
                <div key={i} style={{position:'relative'}}>
                  <img src={url} alt="" style={{width:70,height:70,objectFit:'cover',borderRadius:8}}/>
                  <button onClick={() => removePhoto(i, isNew)}
                    style={{position:'absolute',top:-4,right:-4,background:'var(--red)',border:'none',borderRadius:'50%',width:18,height:18,color:'#fff',cursor:'pointer',fontSize:11,lineHeight:'18px',textAlign:'center',padding:0}}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div id="screen-match" className="screen active">
      <div className="team-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingRight:24}}>
        <div>
          <div className="team-header-title">MATCH</div>
          <div className="team-header-sub">경기 기록</div>
        </div>
        {canEdit && (
          <button onClick={() => { setShowAddForm(!showAddForm); setNewMatch(emptyEdit()); }}
            style={{background:'linear-gradient(135deg,var(--gold),var(--gold2))',border:'none',borderRadius:10,padding:'8px 14px',color:'#000',fontWeight:900,cursor:'pointer',fontSize:12,letterSpacing:1}}>
            + 매치 추가
          </button>
        )}
      </div>

      <div className="screen-scroll">
        {/* 매치 추가 폼 */}
        {canEdit && showAddForm && (
          <div style={{margin:'16px 24px',background:'var(--card)',border:'1px solid var(--accent)',borderRadius:16,padding:16}}>
            <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:16,color:'var(--accent)',letterSpacing:2,marginBottom:14}}>NEW MATCH</div>
            {renderForm(newMatch, setNewMatch, true)}
            <div style={{display:'flex',gap:8,marginTop:12}}>
              <button onClick={handleAdd} style={{flex:1,background:'linear-gradient(135deg,var(--gold),var(--gold2))',border:'none',borderRadius:10,padding:'12px',color:'#000',fontWeight:900,cursor:'pointer',fontSize:13}}>추가</button>
              <button onClick={() => { setShowAddForm(false); setNewMatch(emptyEdit()); }}
                style={{flex:1,background:'var(--card2)',border:'1px solid var(--border)',borderRadius:10,padding:'12px',color:'var(--sub)',cursor:'pointer',fontSize:13}}>취소</button>
            </div>
          </div>
        )}

        {matches.length === 0 && !showAddForm && (
          <div className="no-match">아직 경기 기록이 없습니다</div>
        )}

        <div style={{padding:'0 24px 16px',display:'flex',flexDirection:'column',gap:16}}>
          {matches.map((m) => {
            const isEditing = editId === m.id;
            const scoreDraw = (m as unknown as Record<string, number>).score_draw || 0;
            const us = m.score_us || 0;
            const them = m.score_them || 0;

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
                    {renderForm(edit, setEdit as (s: EditState) => void)}
                    <div style={{display:'flex',gap:8,marginTop:4}}>
                      <button onClick={handleSave} style={{flex:1,background:'linear-gradient(135deg,var(--gold),var(--gold2))',border:'none',borderRadius:10,padding:'10px',color:'#000',fontWeight:900,cursor:'pointer',fontSize:13}}>저장</button>
                      <button onClick={() => {setEditId(null);setEdit(null);setConfirmDelete(null);}} style={{flex:1,background:'var(--card2)',border:'1px solid var(--border)',borderRadius:10,padding:'10px',color:'var(--sub)',cursor:'pointer',fontSize:13}}>취소</button>
                    </div>
                    {confirmDelete === editId ? (
                      <div style={{display:'flex',gap:8,marginTop:4}}>
                        <span style={{flex:1,fontSize:12,color:'var(--sub)',display:'flex',alignItems:'center'}}>정말 삭제할까요?</span>
                        <button onClick={() => handleDelete(editId!)} style={{background:'var(--red)',border:'none',borderRadius:10,padding:'10px 16px',color:'#fff',fontWeight:900,cursor:'pointer',fontSize:13}}>삭제</button>
                        <button onClick={() => setConfirmDelete(null)} style={{background:'var(--card2)',border:'1px solid var(--border)',borderRadius:10,padding:'10px 12px',color:'var(--sub)',cursor:'pointer',fontSize:13}}>취소</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDelete(editId)} style={{width:'100%',marginTop:4,background:'transparent',border:'1px solid rgba(248,113,113,0.3)',borderRadius:10,padding:'8px',color:'var(--red)',cursor:'pointer',fontSize:12}}>매치 삭제</button>
                    )}
                  </div>
                )}

                {/* 스코어 표시 */}
                {!isEditing && (
                  <div style={{padding:'16px',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                      <span style={{fontFamily:'Bebas Neue,sans-serif',fontSize:40,color:'var(--green)',lineHeight:1}}>{us}</span>
                      <span style={{fontSize:10,color:'var(--green)'}}>승</span>
                    </div>
                    <span style={{color:'var(--sub)',fontSize:24,marginBottom:14}}>:</span>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                      <span style={{fontFamily:'Bebas Neue,sans-serif',fontSize:40,color:'#aaa',lineHeight:1}}>{scoreDraw}</span>
                      <span style={{fontSize:10,color:'#888'}}>무</span>
                    </div>
                    <span style={{color:'var(--sub)',fontSize:24,marginBottom:14}}>:</span>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                      <span style={{fontFamily:'Bebas Neue,sans-serif',fontSize:40,color:'var(--red)',lineHeight:1}}>{them}</span>
                      <span style={{fontSize:10,color:'var(--red)'}}>패</span>
                    </div>
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
