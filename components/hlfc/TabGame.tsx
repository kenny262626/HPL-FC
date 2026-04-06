import React from 'react';

export default function TabGame(): React.JSX.Element {
  return (
    <div id="tabGame" style={{ flex: 1, display: 'none', flexDirection: 'column' }}>
      <div className="top-header">
        <div className="header-logo">게임</div>
      </div>
      <div className="scroll-area" style={{ padding: '16px 20px' }}>
        <div id="gameList"></div>
      </div>
    </div>
  );
}