import React from 'react';

export default function TabMembers(): React.JSX.Element {
  return (
    <div id="tabMembers" style={{ flex: 1, display: 'none', flexDirection: 'column' }}>
      <div className="top-header">
        <div className="header-logo">팀원</div>
      </div>
      <div className="scroll-area" style={{ padding: '16px 20px' }}>
        <div id="memberRankList"></div>
      </div>
    </div>
  );
}
