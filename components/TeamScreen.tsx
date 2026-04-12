'use client';

import { getRankedMembers, getTierBadgeSVG } from '@/lib/stats';
import BottomNav from './BottomNav';

type Screen = 'home' | 'vote' | 'team' | 'admin';

interface Props {
  onNavigate: (screen: Screen) => void;
}

export default function TeamScreen({ onNavigate }: Props) {
  const ranked = getRankedMembers();

  return (
    <div id="screen-team" className="screen active">
      <div className="team-header">
        <div className="team-header-title">TEAM STATS</div>
        <div className="team-header-sub">출석률 기준 랭킹</div>
      </div>
      <div className="screen-scroll">
        <div className="team-list">
          {ranked.map((m) => (
            <div key={m.name} className="team-row">
              <div className="rank-num">{m.rank}</div>
              <div className={`tier-badge ${m.tier}`} dangerouslySetInnerHTML={{ __html: getTierBadgeSVG(m.tier, m.rank) }} />
              <div className="member-info">
                <div className="member-name">{m.name}</div>
                <div className="member-rate">출석 {m.attend}/{m.total} ({m.rate}%)</div>
              </div>
              <div className="member-score-wrap">
                <div className="member-score">{m.score}</div>
                <div className="gem-icon" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav active="team" onNavigate={onNavigate} />
    </div>
  );
}
