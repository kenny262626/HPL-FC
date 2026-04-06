import React from 'react';

export default function BottomNav(): React.JSX.Element {
  return (
    <nav className="bottom-nav">
      <button className="nav-item active" data-tab="members">
        <span className="nav-icon">👥</span>
        <span className="nav-label">팀원</span>
      </button>
      <button className="nav-item" data-tab="match">
        <span className="nav-icon">⚽</span>
        <span className="nav-label">경기</span>
      </button>
      <button className="nav-item" data-tab="game">
        <span className="nav-icon">🎮</span>
        <span className="nav-label">게임</span>
      </button>
      <button className="nav-item" data-tab="myinfo">
        <span className="nav-icon">👤</span>
        <span className="nav-label">내 정보</span>
      </button>
    </nav>
  );
}