import React from 'react';

export default function VoteModal(): React.JSX.Element {
  return (
    <div id="voteModal" className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>투표하기</h2>
          <button className="close-btn">&times;</button>
        </div>
        <div className="modal-body">
          <div id="voteContent"></div>
        </div>
      </div>
    </div>
  );
}