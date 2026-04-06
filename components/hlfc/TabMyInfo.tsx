import React from 'react';

export default function TabMyInfo(): React.JSX.Element {
  return (
    <div id="tabMyInfo" style={{ flex: 1, display: 'none', flexDirection: 'column' }}>
      <div className="top-header">
        <div className="header-logo">내 정보</div>
      </div>
      <div className="scroll-area" style={{ padding: '16px 20px' }}>
        <div id="myInfoContent"></div>
      </div>
    </div>
  );
}