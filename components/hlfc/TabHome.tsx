// src/components/hlfc/TabHome.tsx
export default function TabHome() {
  return (
    <div id="tabHome" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div className="top-header">
        <div className="header-logo">HLFC</div>
        <div className="header-right">
          <div className="icon-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="scroll-area">
        {/* 다음 매치 카드 */}
        <div className="section">
          <div className="section-title">NEXT MATCH</div>
          <div className="next-match-card">
            <div className="match-badge">
              <div className="match-badge-dot"></div>
              <div className="match-badge-text">UPCOMING</div>
            </div>
            <div className="match-title">정기 풋살 매치</div>
            <div className="match-date" id="homeMatchDate"></div>
            <div className="match-info-row">
              <div className="match-info-item">
                <div className="match-info-label">장소</div>
                <div className="match-info-val">월드컵 풋살장</div>
              </div>
              <div className="match-info-item">
                <div className="match-info-label">시간</div>
                <div className="match-info-val">20:00</div>
              </div>
              <div className="match-info-item">
                <div className="match-info-label">방식</div>
                <div className="match-info-val">6vs6</div>
              </div>
            </div>
            <div className="vote-status-row">
              <div className="vote-chip attend">
                <div className="vote-chip-num" id="voteAttendCount">0</div>
                <div className="vote-chip-label">출석</div>
              </div>
              <div className="vote-chip absent">
                <div className="vote-chip-num" id="voteAbsentCount">0</div>
                <div className="vote-chip-label">불참</div>
              </div>
              <div className="vote-chip pending">
                <div className="vote-chip-num" id="votePendingCount">12</div>
                <div className="vote-chip-label">미투표</div>
              </div>
            </div>
            <button className="btn-check">출석 확인하기</button>
          </div>
        </div>

        {/* 점수 규칙 */}
        <div className="section">
          <div className="section-title">점수 규칙</div>
          <div className="rules-card">
            <div className="rule-row"><span className="rule-name">첫 출석</span><span className="rule-score pos">+1점</span></div>
            <div className="rule-row"><span className="rule-name">연속 2회 출석</span><span className="rule-score pos">+2점</span></div>
            <div className="rule-row"><span className="rule-name">연속 3회 이상 출석</span><span className="rule-score pos">+3점</span></div>
            <div className="rule-row"><span className="rule-name">용병 출석</span><span className="rule-score pos">+3점</span></div>
            <div className="rule-row"><span className="rule-name">지각</span><span className="rule-score neg">-0.5점</span></div>
            <div className="rule-row"><span className="rule-name">노쇼</span><span className="rule-score neg">-1점</span></div>
            <div className="rule-row"><span className="rule-name">결석</span><span className="rule-score">0점</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
