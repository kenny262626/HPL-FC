// src/app/page.tsx
"use client";

import { useEffect } from "react";
import '../styles/hlfc.css';

// 컴포넌트
import LoginScreen from '@/components/hlfc/LoginScreen';
import TabHome from '@/components/hlfc/TabHome';
import TabMembers from '@/components/hlfc/TabMembers';
import TabMatch from '@/components/hlfc/TabMatch';
import TabGame from '@/components/hlfc/TabGame';
import TabMyInfo from '@/components/hlfc/TabMyInfo';
import BottomNav from '@/components/hlfc/BottomNav';
import VoteModal from '@/components/hlfc/VoteModal';

// 데이터 & 헬퍼
import { TEAM_MEMBERS, MATCH_HISTORY, ACCOUNTS, GAME_RECORDS } from '@/data/hlfc';
import { getTier, tierColor, showToast, getNextSaturday, getInitials } from '@/lib/helpers';

export default function Home() {
  useEffect(() => {

    // ===== 상태 변수 =====
    let votes = {
      attend: [] as string[],
      absent: [] as string[],
      pending: [...TEAM_MEMBERS.map(m => m.name)],
    };
    let currentUser: { id: string; pw?: string; name: string; memberIdx: number } | null = null;
    let currentUserVote: string | null = null;
    const accounts = [...ACCOUNTS];

    // ===== 초기 렌더링 =====
    setNextMatchDate();
    renderMemberRankList();
    renderMatchList();
    renderGameTab();

    // ===== 날짜 계산 =====
    function setNextMatchDate() {
      const el = document.getElementById('homeMatchDate');
      if (el) el.textContent = getNextSaturday();
    }

    // ===== 팀원 랭킹 렌더링 =====
    function renderMemberRankList() {
      const container = document.getElementById('memberRankList');
      if (!container) return;
      container.innerHTML = '';
      TEAM_MEMBERS.forEach((m) => {
        const initials = getInitials(m.name);
        let rankClass = 'rank-other';
        if (m.rank === 1) rankClass = 'rank-1';
        else if (m.rank === 2) rankClass = 'rank-2';
        else if (m.rank === 3) rankClass = 'rank-3';
        const tier = getTier(m.rate);
        const card = document.createElement('div');
        card.className = 'rank-card';
        card.innerHTML = `
          <div class="rank-num ${rankClass}">${m.rank}</div>
          <div class="member-avatar ${m.avClass}">${initials}</div>
          <div class="member-info">
            <div class="member-name">${m.name} <span style="font-size:10px;color:${tierColor(tier)};font-weight:700;margin-left:4px;">${tier}</span></div>
            <div class="member-stats">
              <div class="member-stat">출석 <span>${m.attend}회</span></div>
              <div class="member-stat">출석률 <span>${m.rate}%</span></div>
            </div>
            <div class="attend-bar-wrap"><div class="attend-bar" style="width:${m.rate}%"></div></div>
          </div>
          <div class="member-score-badge">
            <span class="member-score-val">${m.score}</span>
            <div class="member-score-label">점</div>
          </div>
        `;
        container.appendChild(card);
      });
    }

    // ===== 매치 기록 렌더링 =====
    function renderMatchList() {
      const container = document.getElementById('matchList');
      if (!container) return;
      container.innerHTML = '';
      MATCH_HISTORY.forEach(match => {
        const resultLabel = match.result === 'win' ? '승리' : match.result === 'lose' ? '패배' : '무승부';
        const resultClass = match.result === 'win' ? 'win' : match.result === 'lose' ? 'lose' : 'draw';
        const memberChips = match.members.map(n => `<div class="member-chip">${n}</div>`).join('');
        const photoSection = match.hasPhoto
          ? `<div class="match-photo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/>
              </svg>
              <span style="font-size:11px;color:var(--sub);">사진 준비 중</span>
             </div>`
          : '';
        const card = document.createElement('div');
        card.className = 'match-list-card';
        card.innerHTML = `
          ${photoSection}
          <div class="match-list-header">
            <div>
              <div class="match-list-date">${match.date}</div>
              <div class="match-list-title">${match.title || '정기 풋살 매치'}</div>
            </div>
            <div class="match-result-badge ${resultClass}">${resultLabel}</div>
          </div>
          <div class="match-score">${match.score}</div>
          <div class="match-members-wrap">${memberChips}</div>
        `;
        container.appendChild(card);
      });
    }

    // ===== 게임 탭 렌더링 =====
    function renderGameTab() {
      // 전적 집계
      let wins = 0, draws = 0, losses = 0;
      GAME_RECORDS.forEach(g => {
        if (g.teamA.score > g.teamB.score) wins++;
        else if (g.teamA.score === g.teamB.score) draws++;
        else losses++;
      });
      const wEl = document.getElementById('gameTotalWins'); if (wEl) wEl.textContent = String(wins);
      const dEl = document.getElementById('gameTotalDraws'); if (dEl) dEl.textContent = String(draws);
      const lEl = document.getElementById('gameTotalLosses'); if (lEl) lEl.textContent = String(losses);

      // 게임 기록 카드
      const container = document.getElementById('gameRecordList');
      if (!container) return;
      container.innerHTML = '';
      GAME_RECORDS.forEach(g => {
        const aWin = g.teamA.score > g.teamB.score;
        const bWin = g.teamB.score > g.teamA.score;
        const aChips = g.teamA.members.map(n => `<div class="game-member-chip">${n}</div>`).join('');
        const bChips = g.teamB.members.map(n => `<div class="game-member-chip">${n}</div>`).join('');
        const card = document.createElement('div');
        card.className = 'game-record-card';
        card.innerHTML = `
          <div class="game-record-header">
            <div class="game-record-date">${g.date}</div>
          </div>
          <div class="game-teams-row">
            <div class="game-team-block">
              <div class="game-team-name">${g.teamA.name}</div>
              <div class="game-team-members">${aChips}</div>
            </div>
            <div>
              <div class="game-team-score ${aWin ? 'winner' : ''}">${g.teamA.score}</div>
              <div class="game-vs">vs</div>
              <div class="game-team-score ${bWin ? 'winner' : ''}">${g.teamB.score}</div>
            </div>
            <div class="game-team-block" style="text-align:right;">
              <div class="game-team-name" style="text-align:right;">${g.teamB.name}</div>
              <div class="game-team-members" style="justify-content:flex-end;">${bChips}</div>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    }

    // ===== 내정보 로드 =====
    function loadMyInfo() {
      if (!currentUser) return;
      const idx = currentUser.memberIdx;
      const m = idx >= 0 ? TEAM_MEMBERS[idx] : { name: currentUser.name, rank: 0, attend: 0, score: 0, rate: 0, avClass: 'av1' };
      const tier = getTier(m.rate);
      const initials = getInitials(m.name);

      const elName = document.getElementById('myName'); if (elName) elName.textContent = m.name;
      const elId = document.getElementById('myUserId'); if (elId) elId.textContent = '@' + currentUser.id;
      const elScore = document.getElementById('myScore'); if (elScore) elScore.textContent = String(m.score);
      const elAttend = document.getElementById('myAttend'); if (elAttend) elAttend.textContent = String(m.attend);
      const elRank = document.getElementById('myRank'); if (elRank) elRank.textContent = '#' + m.rank;
      const elPct = document.getElementById('myAttendPct'); if (elPct) elPct.textContent = m.rate + '%';

      const hexInner = document.getElementById('myHexInner');
      if (hexInner) { hexInner.className = 'hexagon-inner ' + m.avClass; hexInner.textContent = initials; }

      const tierBadgeEl = document.getElementById('myTierBadge');
      if (tierBadgeEl) { tierBadgeEl.textContent = tier; tierBadgeEl.className = 'tier-badge ' + tier.toLowerCase(); }

      const tierLabelEl = document.getElementById('myTierLabel');
      if (tierLabelEl) { tierLabelEl.textContent = tier + ' TIER'; (tierLabelEl as HTMLElement).style.color = tierColor(tier); }

      setTimeout(() => {
        const bar = document.getElementById('myAttendBar');
        if (bar) bar.style.width = m.rate + '%';
      }, 100);
    }

    // ===== 투표 UI =====
    function updateVoteUI() {
      const vac = document.getElementById('voteAttendCount'); if (vac) vac.textContent = String(votes.attend.length);
      const vabc = document.getElementById('voteAbsentCount'); if (vabc) vabc.textContent = String(votes.absent.length);
      const vpc = document.getElementById('votePendingCount'); if (vpc) vpc.textContent = String(votes.pending.length);
      const valc = document.getElementById('voteAttendListCount'); if (valc) valc.textContent = String(votes.attend.length);
      const vablc = document.getElementById('voteAbsentListCount'); if (vablc) vablc.textContent = String(votes.absent.length);
      const vplc = document.getElementById('votePendingListCount'); if (vplc) vplc.textContent = String(votes.pending.length);

      const attBtn = document.getElementById('voteAttendBtn');
      const absBtn = document.getElementById('voteAbsentBtn');
      if (currentUserVote === 'attend') {
        attBtn?.classList.add('selected'); absBtn?.classList.remove('selected');
      } else if (currentUserVote === 'absent') {
        absBtn?.classList.add('selected'); attBtn?.classList.remove('selected');
      } else {
        attBtn?.classList.remove('selected'); absBtn?.classList.remove('selected');
      }

      renderVoteList('voteAttendList', votes.attend, 'attend-item', 'g');
      renderVoteList('voteAbsentList', votes.absent, 'absent-item', 'r');
      renderVoteList('votePendingList', votes.pending, 'pending-item', 's');
    }

    function renderVoteList(containerId: string, names: string[], itemClass: string, dotClass: string) {
      const el = document.getElementById(containerId);
      if (!el) return;
      if (!names.length) { el.innerHTML = `<div style="color:var(--sub);font-size:12px;padding:8px 12px;">없음</div>`; return; }
      el.innerHTML = names.map(n => {
        const member = TEAM_MEMBERS.find(m => m.name === n);
        const avClass = member ? member.avClass : 'av1';
        const initials = getInitials(n);
        return `
          <div class="vote-member-item ${itemClass}">
            <div class="vote-dot ${dotClass}"></div>
            <div class="member-avatar ${avClass}" style="width:30px;height:30px;font-size:12px;flex-shrink:0;">${initials}</div>
            <div class="vote-member-name">${n}</div>
          </div>`;
      }).join('');
    }

    // ===== 탭 전환 =====
    function switchTab(tab: string) {
      // 탭 목록에 game 추가
      const tabs =   ['home', 'members', 'match', 'game', 'myinfo'];
      const ids =    ['tabHome', 'tabMembers', 'tabMatch', 'tabGame', 'tabMyInfo'];
      const navIds = ['nav-home', 'nav-members', 'nav-match', 'nav-game', 'nav-myinfo'];

      tabs.forEach((t, i) => {
        const el = document.getElementById(ids[i]);
        if (el) el.style.display = (t === tab) ? 'flex' : 'none';
        const navEl = document.getElementById(navIds[i]);
        if (navEl) {
          navEl.classList.toggle('active', t === tab);
          navEl.querySelectorAll('path,rect,circle,polyline,line').forEach((p: Element) => {
            (p as SVGElement).style.stroke = (t === tab) ? 'var(--gold)' : '#888';
          });
          // fill된 circle 처리
          navEl.querySelectorAll('circle[fill]').forEach((p: Element) => {
            (p as SVGElement).style.fill = (t === tab) ? 'var(--gold)' : '#888';
            (p as SVGElement).style.stroke = 'none';
          });
        }
      });
    }

    // ===== 로그인/회원가입 탭 전환 =====
    function switchLoginTab(tab: string) {
      document.querySelectorAll('.login-tab').forEach((t, i) => {
        t.classList.toggle('active', (i === 0 && tab === 'login') || (i === 1 && tab === 'signup'));
      });
      const lf = document.getElementById('loginForm'); if (lf) lf.style.display = tab === 'login' ? 'flex' : 'none';
      const sf = document.getElementById('signupForm'); if (sf) sf.style.display = tab === 'signup' ? 'flex' : 'none';
    }

    // ===== 앱 진입 =====
    function enterApp() {
      document.getElementById('loginScreen')?.classList.add('hidden');
      document.getElementById('mainScreen')?.classList.remove('hidden');
      loadMyInfo();
      showToast(`환영합니다, ${currentUser!.name}님!`);
    }

    // ===== 로그인 =====
    function doLogin() {
      const id = (document.getElementById('loginId') as HTMLInputElement).value.trim();
      const pw = (document.getElementById('loginPw') as HTMLInputElement).value;
      if (!id || !pw) { showToast('아이디와 비밀번호를 입력해주세요'); return; }
      const acc = accounts.find(a => a.id === id && a.pw === pw);
      if (!acc) { showToast('아이디 또는 비밀번호가 틀렸습니다'); return; }
      currentUser = { ...acc };
      enterApp();
    }

    // ===== 회원가입 =====
    function doSignup() {
      const last  = (document.getElementById('signupLast') as HTMLInputElement).value.trim();
      const first = (document.getElementById('signupFirst') as HTMLInputElement).value.trim();
      const id    = (document.getElementById('signupId') as HTMLInputElement).value.trim();
      const pw    = (document.getElementById('signupPw') as HTMLInputElement).value;
      const pw2   = (document.getElementById('signupPw2') as HTMLInputElement).value;
      if (!last || !first) { showToast('성과 이름은 필수 입력입니다'); return; }
      if (!id) { showToast('아이디를 입력해주세요'); return; }
      if (pw.length < 4) { showToast('비밀번호는 4자 이상이어야 합니다'); return; }
      if (pw !== pw2) { showToast('비밀번호가 일치하지 않습니다'); return; }
      if (accounts.find(a => a.id === id)) { showToast('이미 사용 중인 아이디입니다'); return; }
      const fullName = last + first;
      const matchedMember = TEAM_MEMBERS.findIndex(m => m.name === fullName);
      accounts.push({ id, pw, name: fullName, memberIdx: matchedMember >= 0 ? matchedMember : -1 });
      showToast('가입 완료! 로그인해주세요');
      switchLoginTab('login');
      (document.getElementById('loginId') as HTMLInputElement).value = id;
    }

    // ===== 카카오 로그인 =====
    function kakaoLogin() {
      showToast('데모 모드: 카카오 로그인');
      currentUser = { id: 'kakao_demo', name: '홍강현', memberIdx: 0 };
      enterApp();
    }

    // ===== 로그아웃 =====
    function doLogout() {
      currentUser = null;
      currentUserVote = null;
      votes = { attend: [], absent: [], pending: [...TEAM_MEMBERS.map(m => m.name)] };
      updateVoteUI();
      document.getElementById('loginScreen')?.classList.remove('hidden');
      document.getElementById('mainScreen')?.classList.add('hidden');
      switchTab('home');
      showToast('로그아웃되었습니다');
    }

    // ===== 투표 모달 =====
    function openVoteModal() {
      document.getElementById('voteModal')?.classList.remove('hidden');
      const info = document.getElementById('voteMatchInfo');
      const dateEl = document.getElementById('homeMatchDate');
      if (info && dateEl) info.textContent = '정기 풋살 매치 · ' + dateEl.textContent;
      updateVoteUI();
    }

    function closeVoteModalOutside(e: Event) {
      if (e.target === document.getElementById('voteModal')) {
        document.getElementById('voteModal')?.classList.add('hidden');
      }
    }

    // ===== 투표 =====
    function castVote(type: string) {
      if (!currentUser) { showToast('로그인이 필요합니다'); return; }
      const userName = currentUser.name;
      votes.attend  = votes.attend.filter(n => n !== userName);
      votes.absent  = votes.absent.filter(n => n !== userName);
      votes.pending = votes.pending.filter(n => n !== userName);
      if (currentUserVote === type) {
        currentUserVote = null;
        votes.pending.unshift(userName);
        showToast('투표가 취소되었습니다');
      } else {
        currentUserVote = type;
        if (type === 'attend') { votes.attend.unshift(userName); showToast('출석으로 투표했습니다!'); }
        else { votes.absent.unshift(userName); showToast('불참으로 투표했습니다'); }
      }
      updateVoteUI();
    }

    // ===== 이벤트 바인딩 =====
    document.querySelectorAll('.login-tab').forEach((btn, i) => {
      btn.addEventListener('click', () => switchLoginTab(i === 0 ? 'login' : 'signup'));
    });

    document.getElementById('loginForm')?.querySelector('.btn-gold')?.addEventListener('click', doLogin);
    document.getElementById('signupForm')?.querySelector('.btn-gold')?.addEventListener('click', doSignup);
    document.querySelector('.btn-kakao')?.addEventListener('click', kakaoLogin);
    document.querySelector('.logout-btn')?.addEventListener('click', doLogout);
    document.querySelector('.btn-check')?.addEventListener('click', openVoteModal);
    document.getElementById('voteModal')?.addEventListener('click', closeVoteModalOutside);
    document.getElementById('voteAttendBtn')?.addEventListener('click', () => castVote('attend'));
    document.getElementById('voteAbsentBtn')?.addEventListener('click', () => castVote('absent'));

    // 네비게이션 버튼
    document.getElementById('nav-home')?.addEventListener('click', () => switchTab('home'));
    document.getElementById('nav-members')?.addEventListener('click', () => switchTab('members'));
    document.getElementById('nav-match')?.addEventListener('click', () => switchTab('match'));
    document.getElementById('nav-game')?.addEventListener('click', () => switchTab('game'));     // NEW
    document.getElementById('nav-myinfo')?.addEventListener('click', () => switchTab('myinfo'));

  }, []);

  return (
    <>
      <div id="app">
        {/* 로그인 화면 */}
        <LoginScreen />

        {/* 메인 화면 */}
        <div className="screen hidden" id="mainScreen">
          <TabHome />
          <TabMembers />
          <TabMatch />
          <TabGame />
          <TabMyInfo />
          <BottomNav />
        </div>
      </div>

      {/* 출석 투표 모달 */}
      <VoteModal />

      {/* 토스트 알림 */}
      <div className="toast" id="toast"></div>
    </>
  );
}
