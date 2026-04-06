import React from 'react';

export default function TabMatch(): React.JSX.Element {
  return (
    <div id="tabMatch" style={{ flex: 1, display: 'none', flexDirection: 'column' }}>
      <div className="top-header">
        <div className="header-logo">경기</div>
      </div>
      <div className="scroll-area" style={{ padding: '16px 20px' }}>
        <div id="matchList"></div>
      </div>
    </div>
  );
}