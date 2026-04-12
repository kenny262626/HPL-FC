'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getRankedMembers, getTierImage } from '@/lib/stats';
import { MERCENARIES } from '@/lib/data';
import { apiSetCoach } from '@/lib/api';
import BottomNav from './BottomNav';

type Screen = 'home' | 'vote' | 'team' | 'match' | 'admin';

interface Props { isAdmin: boolean; onNavigate: (s: Screen) => void; showToast: (m: string) => void; }

export default function TeamScreen({ isAdmin, onNavigate, showToast }: Props) {
  const ranked = getRankedMembers();
  const regular = ranked.filter(m => !MERCENARIES.includes(m.name));
  const mercs = ranked.filter(m => MERCENARIES.includes(m.name));

  async function handleCoach(userId: string, name: string) {
    // 실제 구현에서는 userId 필요 - 여기선 팀 화면에서 name 기반으로 처리
    showToast(`${name} 코치 지정 기능은 MY 탭 관리자 메뉴에서 가능합니다`);
  }

  const renderRow = (m: ReturnType<typeof getRankedMembers>[0], isMerc = false) => (
    <div key={m.name} className="team-row" onClick={() => isAdmin && handleCoach('', m.name)} style={{cursor: isAdmin ? 'pointer' : 'default'}}>
      <div className="rank-num">{m.rank}</div>
      <div className="tier-badge">
        <Image src={isMerc ? '/images/mercenary.png' : getTierImage(m.tier)} alt={m.tier} width={36} height={36} style={{objectFit:'contain'}}/>
      </div>
      <div className="member-info">
        <div className="member-name" style={{display:'flex',alignItems:'center',gap:6}}>
          {m.name}
          {isMerc && <span style={{fontSize:9,background:'#1a3a5c',color:'#4a9eff',padding:'2px 6px',borderRadius:10,letterSpacing:1}}>용병</span>}
        </div>
        <div className="member-rate">출석 {m.attend}/{m.total} ({m.rate}%)</div>
      </div>
      <div className="member-score-wrap">
        <div className="member-score">{m.score}</div>
        <div className="gem-icon"/>
      </div>
    </div>
  );

  return (
    <div id="screen-team" className="screen active">
      <div className="team-header">
        <div className="team-header-title">TEAM STATS</div>
        <div className="team-header-sub">출석률 기준 랭킹</div>
      </div>
      <div className="screen-scroll">
        <div className="team-list">
          {regular.map(m => renderRow(m, false))}
          {mercs.length > 0 && (
            <>
              <div style={{padding:'12px 0 6px',fontSize:11,color:'var(--sub)',letterSpacing:2,fontFamily:'Bebas Neue,sans-serif'}}>— 용병 —</div>
              {mercs.map(m => renderRow(m, true))}
            </>
          )}
        </div>
      </div>
      <BottomNav active="team" onNavigate={onNavigate} />
    </div>
  );
}
