"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // ===== DATA =====
    const TEAM_MEMBERS = [
      { rank:1,  name:'홍강현', attend:12, score:30, rate:92.3, avClass:'av1' },
      { rank:2,  name:'오승엽', attend:28, score:70, rate:87.5, avClass:'av2' },
      { rank:3,  name:'김연호', attend:13, score:28, rate:86.7, avClass:'av3' },
      { rank:4,  name:'유승한', attend:26, score:64, rate:83.9, avClass:'av4' },
      { rank:5,  name:'강태훈', attend:18, score:43, rate:81.8, avClass:'av5' },
      { rank:6,  name:'진대철', attend:25, score:54, rate:78.1, avClass:'av6' },
      { rank:7,  name:'오승영', attend:15, score:26, rate:75.0, avClass:'av7' },
      { rank:8,  name:'최상원', attend:8,  score:12, rate:72.7, avClass:'av8' },
      { rank:9,  name:'김성진', attend:22, score:44, rate:71.0, avClass:'av9' },
      { rank:9,  name:'이도훈', attend:22, score:45, rate:71.0, avClass:'av10' },
      { rank:11, name:'박재현', attend:17, score:28, rate:68.0, avClass:'av11' },
      { rank:12, name:'김종원', attend:21, score:46, rate:65.6, avClass:'av12' },
    ];

    const MATCH_HISTORY = [
      {
        id:1, date:'2025년 3월 22일 (토)', title:'정기 풋살 매치',
        result:'win', score:'7 : 4',
        members:['홍강현','오승엽','김연호','유승한','강태훈','진대철','오승영','최상원','김성진','이도훈'],
        hasPhoto: true,
      },
      {
        id:2, date:'2025년 3월 15일 (토)',        result:'draw', score:'5 : 5',
        members:['홍강현','오승엽','유승한','강태훈','진대철','오승영','박재현','김종원','이도훈','김성진'],
        hasPhoto: false,
      },
      {
        id:3, date:'2025년 3월 8일 (토)', title:'정기 풋살 매치',
        result:'lose', score:'3 : 6',
        members:['홍강현','김연호','유승한','강태훈','진대철','오승영','최상원','박재현','김종원'],
        hasPhoto: true,
      },
      {
        id:4, date:'2025년 3월 1일 (토)', title:'정기 풋살 매치',
        result:'win', score:'8 : 3',
        members:['오승엽','김연호','유승한','강태훈','진대철','오승영','최상원','김성진','이도훈','박재현','김종원'],
        hasPhoto: false,
      },
    ];

    let votes: { attend: string[]; absent: string[]; pending: string[] } = {
      attend: [],
      absent: [],
      pending: [...TEAM_MEMBERS.map(m => m.name)],
    };
    let currentUser: { id: string; pw?: string; name: string; memberIdx: number } | null = null;
    let currentUserVote: string | null = null;

    const accounts = [
      { id:'demo', pw:'1234', name:'홍강현', memberIdx: 0 },
      { id:'hong', pw:'1234', name:'홍강현', memberIdx: 0 },
      { id:'oh',   pw:'1234', name:'오승엽', memberIdx: 1 },
    ];

    // ===== HELPERS =====
    function getTier(rate: number) {
      if (rate >= 85) return 'GOLD';
      if (rate >= 70) return 'SILVER';
      return 'BRONZE';
    }
    function tierColor(tier: string) {
      if (tier === 'GOLD') return 'var(--gold)';
      if (tier === 'SILVER') return 'var(--silver)';
      return 'var(--bronze)';
    }

    function showToast(msg: string) {
      const t = document.getElementById('toast')!;
      t.textContent = msg;
      t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 2500);
    }

    // ===== NEXT MATCH DATE =====
    function setNextMatchDate() {
      const now = new Date();
      const day = now.getDay();
      const diff = (6 - day + 7) % 7 || 7;
      const next = new Date(now);
      next.setDate(now.getDate() + diff);
      const days = ['일','월','화','수','목','금','토'];
      const months = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
      const el = document.getElementById('homeMatchDate');
      if (el) el.textContent = `${next.getFullYear()}년 ${months[next.getMonth()]} ${next.getDate()}일 (${days[next.getDay()]})`;
    }

    // ===== MEMBER RANK LIST =====
    function renderMemberRankList() {
      const container = document.getElementById('memberRankList');
      if (!container) return;
      container.innerHTML = '';
      TEAM_MEMBERS.forEach((m) => {
        const initials = m.name.length >= 2 ? m.name[1] : m.name[0];
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

    // ===== MATCH LIST =====
    function renderMatchList() {
      const container = document.getElementById('matchList');
      if (!container) return;
      container.innerHTML = '';
      MATCH_HISTORY.forEach(match => {
        const resultLabel = match.result === 'win' ? '승리' : match.result === 'lose' ? '패배' : '무승부';
        const resultClass = match.result === 'win' ? 'win' : match.result === 'lose' ? 'lose' : 'draw';
        const memberChips = match.members.map(n => `<div class="member-chip">${n}</div>`).join('');
        const photoSection = match.hasPhoto
          ? `<div class="match-photo" style="background:linear-gradient(135deg,#1c1800,#0a0a0a);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
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
              <div class="match-list-title">${match.title}</div>
            </div>
            <div class="match-result-badge ${resultClass}">${resultLabel}</div>
          </div>
          <div class="match-score">${match.score}</div>
          <div class="match-members-wrap">${memberChips}</div>
        `;
        container.appendChild(card);
      });
    }

    // ===== MY INFO =====
    function loadMyInfo() {
      if (!currentUser) return;
      const idx = currentUser.memberIdx;
      const m = idx >= 0 ? TEAM_MEMBERS[idx] : { name: currentUser.name, rank: 0, attend: 0, score: 0, rate: 0, avClass: 'av1' };
      const tier = getTier(m.rate);
      const initials = m.name.length >= 2 ? m.name[1] : m.name[0];

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

    // ===== VOTE =====
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
        const initials = n.length >= 2 ? n[1] : n[0];
        return `
          <div class="vote-member-item ${itemClass}">
            <div class="vote-dot ${dotClass}"></div>
            <div class="member-avatar ${avClass}" style="width:30px;height:30px;font-size:12px;flex-shrink:0;">${initials}</div>
            <div class="vote-member-name">${n}</div>
          </div>`;
      }).join('');
    }

    // ===== TAB SWITCHING =====
    function switchTab(tab: string) {
      const tabs = ['home','members','match','myinfo'];
      const ids = ['tabHome','tabMembers','tabMatch','tabMyInfo'];
      const navIds = ['nav-home','nav-members','nav-match','nav-myinfo'];
      tabs.forEach((t, i) => {
        const el = document.getElementById(ids[i]);
        if (el) el.style.display = (t === tab) ? 'flex' : 'none';
        const navEl = document.getElementById(navIds[i]);
        if (navEl) {
          navEl.classList.toggle('active', t === tab);
          navEl.querySelectorAll('path,rect,circle,polyline,line').forEach((p: Element) => {
            (p as SVGElement).style.stroke = (t === tab) ? 'var(--gold)' : '#888';
          });
        }
      });
    }

    // ===== LOGIN / SIGNUP =====
    function switchLoginTab(tab: string) {
      document.querySelectorAll('.login-tab').forEach((t, i) => {
        t.classList.toggle('active', (i === 0 && tab === 'login') || (i === 1 && tab === 'signup'));
      });
      const lf = document.getElementById('loginForm'); if (lf) lf.style.display = tab === 'login' ? 'flex' : 'none';
      const sf = document.getElementById('signupForm'); if (sf) sf.style.display = tab === 'signup' ? 'flex' : 'none';
    }

    function enterApp() {
      document.getElementById('loginScreen')?.classList.add('hidden');
      document.getElementById('mainScreen')?.classList.remove('hidden');
      loadMyInfo();
      showToast(`환영합니다, ${currentUser!.name}님!`);
    }

    function doLogin() {
      const id = (document.getElementById('loginId') as HTMLInputElement).value.trim();
      const pw = (document.getElementById('loginPw') as HTMLInputElement).value;
      if (!id || !pw) { showToast('아이디와 비밀번호를 입력해주세요'); return; }
      const acc = accounts.find(a => a.id === id && a.pw === pw);
      if (!acc) { showToast('아이디 또는 비밀번호가 틀렸습니다'); return; }
      currentUser = { ...acc };
      enterApp();
    }

    function doSignup() {
      const last = (document.getElementById('signupLast') as HTMLInputElement).value.trim();
      const first = (document.getElementById('signupFirst') as HTMLInputElement).value.trim();
      const id = (document.getElementById('signupId') as HTMLInputElement).value.trim();
      const pw = (document.getElementById('signupPw') as HTMLInputElement).value;
      const pw2 = (document.getElementById('signupPw2') as HTMLInputElement).value;
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

    function kakaoLogin() {
      showToast('데모 모드: 카카오 로그인');
      currentUser = { id: 'kakao_demo', name: '홍강현', memberIdx: 0 };
      enterApp();
    }

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

    function castVote(type: string) {
      if (!currentUser) { showToast('로그인이 필요합니다'); return; }
      const userName = currentUser.name;
      votes.attend = votes.attend.filter(n => n !== userName);
      votes.absent = votes.absent.filter(n => n !== userName);
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

    // ===== BIND EVENTS =====
    setNextMatchDate();
    renderMemberRankList();
    renderMatchList();

    // Login tab buttons
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

    // Nav buttons
    document.getElementById('nav-home')?.addEventListener('click', () => switchTab('home'));
    document.getElementById('nav-members')?.addEventListener('click', () => switchTab('members'));
    document.getElementById('nav-match')?.addEventListener('click', () => switchTab('match'));
    document.getElementById('nav-myinfo')?.addEventListener('click', () => switchTab('myinfo'));

  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap');
        :root {
          --gold: #F5C842; --gold2: #e6b800; --dark: #0a0a0a; --dark2: #111111;
          --dark3: #1a1a1a; --dark4: #242424; --card: #181818;
          --border: rgba(245,200,66,0.15); --text: #ffffff; --sub: #888888;
          --green: #4ade80; --red: #f87171; --blue: #60a5fa;
          --silver: #C0C0C0; --bronze: #CD7F32;
        }
        * { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
        html, body { height:100%; background:var(--dark); color:var(--text); font-family:'Noto Sans KR', sans-serif; overflow:hidden; }
        #app { width:100%; max-width:430px; height:100dvh; margin:0 auto; position:relative; overflow:hidden; background:var(--dark); display:flex; flex-direction:column; }
        .screen { position:absolute; inset:0; display:flex; flex-direction:column; transition:opacity 0.3s, transform 0.3s; }
        .screen.hidden { opacity:0; pointer-events:none; transform:translateY(20px); }
        .scroll-area { flex:1; overflow-y:auto; overflow-x:hidden; -webkit-overflow-scrolling:touch; padding-bottom:90px; }
        .scroll-area::-webkit-scrollbar { display:none; }
        .bottom-nav { position:absolute; bottom:0; left:0; right:0; height:70px; background:rgba(15,15,15,0.97); border-top:1px solid var(--border); display:flex; align-items:center; justify-content:space-around; padding-bottom:env(safe-area-inset-bottom); backdrop-filter:blur(20px); z-index:100; }
        .nav-btn { display:flex; flex-direction:column; align-items:center; gap:4px; background:none; border:none; color:var(--sub); font-size:10px; font-family:'Noto Sans KR',sans-serif; cursor:pointer; padding:8px 12px; transition:color 0.2s; }
        .nav-btn.active { color:var(--gold); }
        .nav-btn svg { width:22px; height:22px; }
        .nav-btn.active svg path,.nav-btn.active svg rect,.nav-btn.active svg circle,.nav-btn.active svg polygon { stroke:var(--gold); }
        #loginScreen { background:var(--dark); justify-content:flex-end; }
        .login-bg { position:absolute; inset:0; background: radial-gradient(ellipse at 50% 30%, rgba(245,200,66,0.12) 0%, transparent 65%); }
        .login-top { position:absolute; top:0; left:0; right:0; height:55%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; }
        .emblem-wrap { position:relative; }
        .emblem-main { width:140px; height:140px; background: linear-gradient(145deg, #2a2a00, #1a1a00); border:3px solid var(--gold); border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 0 60px rgba(245,200,66,0.35), inset 0 0 30px rgba(245,200,66,0.08); position:relative; overflow:hidden; }
        .emblem-main::before { content:''; position:absolute; inset:0; background: linear-gradient(135deg, rgba(245,200,66,0.15) 0%, transparent 50%); }
        .emblem-text-top { font-family:'Black Han Sans',sans-serif; font-size:9px; color:var(--gold); letter-spacing:3px; opacity:0.8; }
        .emblem-ball { font-size:42px; line-height:1; }
        .emblem-text-bot { font-family:'Black Han Sans',sans-serif; font-size:8px; color:var(--gold); letter-spacing:2px; opacity:0.7; }
        .emblem-reflection { width:130px; height:50px; margin-top:-10px; background: linear-gradient(to bottom, rgba(245,200,66,0.08), transparent); filter:blur(8px); transform:scaleY(-0.4); }
        .login-title { font-family:'Black Han Sans',sans-serif; font-size:26px; color:var(--gold); letter-spacing:2px; text-shadow:0 0 30px rgba(245,200,66,0.5); }
        .login-sub { font-size:12px; color:var(--sub); letter-spacing:1px; }
        .login-card { position:relative; z-index:2; background: linear-gradient(to bottom, #141414, #0f0f0f); border-radius:28px 28px 0 0; border-top:1px solid var(--border); padding:32px 24px 40px; display:flex; flex-direction:column; gap:16px; }
        .login-tab-row { display:flex; background:var(--dark3); border-radius:12px; padding:3px; margin-bottom:4px; }
        .login-tab { flex:1; padding:10px; text-align:center; font-size:13px; font-weight:500; border-radius:10px; background:none; border:none; color:var(--sub); cursor:pointer; transition:all 0.2s; font-family:'Noto Sans KR',sans-serif; }
        .login-tab.active { background:var(--gold); color:#000; font-weight:700; }
        .input-group { display:flex; flex-direction:column; gap:8px; }
        .input-row { display:flex; gap:8px; }
        .input-field { width:100%; padding:14px 16px; background:var(--dark3); border:1px solid rgba(255,255,255,0.08); border-radius:12px; color:var(--text); font-size:15px; font-family:'Noto Sans KR',sans-serif; outline:none; transition:border-color 0.2s; }
        .input-field:focus { border-color:var(--gold); }
        .input-field::placeholder { color:var(--sub); }
        .btn-gold { width:100%; padding:16px; font-size:16px; font-weight:700; background: linear-gradient(135deg, var(--gold), var(--gold2)); color:#000; border:none; border-radius:14px; cursor:pointer; font-family:'Black Han Sans',sans-serif; letter-spacing:1px; box-shadow:0 4px 20px rgba(245,200,66,0.3); transition:transform 0.15s, box-shadow 0.15s; }
        .btn-gold:active { transform:scale(0.97); box-shadow:0 2px 10px rgba(245,200,66,0.2); }
        .divider-or { display:flex; align-items:center; gap:12px; color:var(--sub); font-size:12px; }
        .divider-or::before,.divider-or::after { content:''; flex:1; height:1px; background:rgba(255,255,255,0.08); }
        .btn-kakao { width:100%; padding:15px; font-size:15px; font-weight:700; background:#FEE500; color:#000; border:none; border-radius:14px; cursor:pointer; font-family:'Noto Sans KR',sans-serif; display:flex; align-items:center; justify-content:center; gap:8px; transition:transform 0.15s; }
        .btn-kakao:active { transform:scale(0.97); }
        .top-header { padding:16px 20px 0; padding-top:calc(16px + env(safe-area-inset-top)); display:flex; align-items:center; justify-content:space-between; flex-shrink:0; }
        .header-logo { font-family:'Black Han Sans',sans-serif; font-size:20px; color:var(--gold); letter-spacing:1px; }
        .header-right { display:flex; gap:10px; align-items:center; }
        .icon-btn { width:38px; height:38px; background:var(--dark3); border:1px solid var(--border); border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; }
        .section { padding:16px 20px; }
        .section-title { font-size:12px; font-weight:700; color:var(--sub); letter-spacing:2px; text-transform:uppercase; margin-bottom:12px; }
        .next-match-card { background: linear-gradient(135deg, #1c1800, #0f0f00); border:1px solid var(--gold); border-radius:20px; padding:20px; position:relative; overflow:hidden; box-shadow:0 4px 30px rgba(245,200,66,0.15); }
        .next-match-card::before { content:''; position:absolute; top:-30px; right:-30px; width:120px; height:120px; background:radial-gradient(circle, rgba(245,200,66,0.1) 0%, transparent 70%); border-radius:50%; }
        .match-badge { display:inline-flex; align-items:center; gap:6px; background:rgba(245,200,66,0.15); border:1px solid rgba(245,200,66,0.3); border-radius:20px; padding:4px 10px; margin-bottom:12px; }
        .match-badge-dot { width:6px; height:6px; background:var(--gold); border-radius:50%; animation:pulse 1.5s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
        .match-badge-text { font-size:11px; color:var(--gold); font-weight:700; letter-spacing:1px; }
        .match-title { font-family:'Black Han Sans',sans-serif; font-size:22px; color:var(--text); margin-bottom:4px; }
        .match-date { font-size:13px; color:var(--sub); margin-bottom:16px; }
        .match-info-row { display:flex; gap:12px; margin-bottom:16px; }
        .match-info-item { flex:1; background:rgba(255,255,255,0.04); border-radius:10px; padding:10px; text-align:center; }
        .match-info-label { font-size:10px; color:var(--sub); margin-bottom:4px; }
        .match-info-val { font-size:14px; font-weight:700; color:var(--gold); }
        .vote-status-row { display:flex; gap:8px; margin-bottom:16px; }
        .vote-chip { flex:1; border-radius:10px; padding:10px 6px; text-align:center; }
        .vote-chip.attend { background:rgba(74,222,128,0.1); border:1px solid rgba(74,222,128,0.2); }
        .vote-chip.absent { background:rgba(248,113,113,0.1); border:1px solid rgba(248,113,113,0.2); }
        .vote-chip.pending { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); }
        .vote-chip-num { font-size:20px; font-weight:900; }
        .vote-chip.attend .vote-chip-num { color:var(--green); }
        .vote-chip.absent .vote-chip-num { color:var(--red); }
        .vote-chip.pending .vote-chip-num { color:var(--sub); }
        .vote-chip-label { font-size:10px; color:var(--sub); margin-top:2px; }
        .btn-check { width:100%; padding:14px; background:linear-gradient(135deg,var(--gold),var(--gold2)); color:#000; border:none; border-radius:12px; font-size:15px; font-weight:700; cursor:pointer; font-family:'Black Han Sans',sans-serif; letter-spacing:1px; }
        .rules-card { background:var(--card); border:1px solid var(--border); border-radius:16px; padding:16px; }
        .rule-row { display:flex; align-items:center; justify-content:space-between; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.04); }
        .rule-row:last-child { border-bottom:none; }
        .rule-name { font-size:13px; color:var(--text); }
        .rule-score { font-size:14px; font-weight:700; }
        .rule-score.pos { color:var(--green); }
        .rule-score.neg { color:var(--red); }
        .rank-card { background:var(--card); border:1px solid var(--border); border-radius:16px; margin-bottom:10px; padding:14px 16px; display:flex; align-items:center; gap:12px; }
        .rank-num { font-family:'Black Han Sans',sans-serif; font-size:18px; width:28px; text-align:center; }
        .rank-1 { color:var(--gold); }
        .rank-2 { color:var(--silver); }
        .rank-3 { color:var(--bronze); }
        .rank-other { color:var(--sub); }
        .member-avatar { width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Black Han Sans',sans-serif; font-size:15px; font-weight:900; flex-shrink:0; }
        .member-info { flex:1; min-width:0; }
        .member-name { font-size:15px; font-weight:700; margin-bottom:2px; }
        .member-stats { display:flex; gap:8px; }
        .member-stat { font-size:11px; color:var(--sub); }
        .member-stat span { color:var(--text); font-weight:600; }
        .member-score-badge { background:rgba(245,200,66,0.12); border:1px solid rgba(245,200,66,0.25); border-radius:8px; padding:6px 10px; text-align:center; flex-shrink:0; }
        .member-score-val { font-size:18px; font-weight:900; color:var(--gold); display:block; }
        .member-score-label { font-size:9px; color:var(--sub); }
        .attend-bar-wrap { height:4px; background:rgba(255,255,255,0.06); border-radius:2px; margin-top:6px; }
        .attend-bar { height:4px; border-radius:2px; background:linear-gradient(to right,var(--gold),var(--gold2)); }
        .myinfo-header { padding:20px; padding-top:calc(20px + env(safe-area-inset-top)); background:linear-gradient(to bottom, #1c1800, var(--dark)); position:relative; overflow:hidden; flex-shrink:0; }
        .myinfo-header::before { content:''; position:absolute; top:-60px; right:-60px; width:200px; height:200px; background:radial-gradient(circle,rgba(245,200,66,0.08),transparent 70%); border-radius:50%; }
        .myinfo-top-row { display:flex; align-items:flex-start; gap:16px; }
        .hexagon-wrap { position:relative; flex-shrink:0; }
        .hexagon { width:72px; height:72px; position:relative; display:flex; align-items:center; justify-content:center; font-family:'Black Han Sans',sans-serif; font-size:24px; }
        .hexagon::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg, var(--gold), var(--gold2)); clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }
        .hexagon-inner { position:relative; z-index:1; width:64px; height:64px; background:var(--dark2); clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); display:flex; align-items:center; justify-content:center; font-size:26px; }
        .tier-badge { position:absolute; bottom:-4px; right:-4px; background:var(--gold); color:#000; font-size:8px; font-weight:900; padding:2px 6px; border-radius:10px; font-family:'Black Han Sans',sans-serif; }
        .tier-badge.silver { background:var(--silver); }
        .tier-badge.bronze { background:var(--bronze); color:#fff; }
        .myinfo-name-wrap { flex:1; }
        .myinfo-name { font-family:'Black Han Sans',sans-serif; font-size:24px; color:var(--text); margin-bottom:2px; }
        .myinfo-id { font-size:12px; color:var(--sub); margin-bottom:8px; }
        .myinfo-tier-row { display:flex; align-items:center; gap:8px; }
        .tier-label { font-size:12px; color:var(--gold); font-weight:700; }
        .myinfo-stats-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-top:20px; }
        .myinfo-stat-box { background:rgba(255,255,255,0.04); border:1px solid var(--border); border-radius:12px; padding:12px; text-align:center; }
        .myinfo-stat-val { font-family:'Black Han Sans',sans-serif; font-size:22px; color:var(--gold); }
        .myinfo-stat-label { font-size:10px; color:var(--sub); margin-top:2px; }
        .attend-section { padding:16px 20px; }
        .attend-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
        .attend-title { font-size:13px; font-weight:700; color:var(--text); }
        .attend-pct { font-size:18px; font-weight:900; color:var(--gold); }
        .big-bar-wrap { height:8px; background:rgba(255,255,255,0.06); border-radius:4px; overflow:hidden; }
        .big-bar { height:8px; border-radius:4px; background:linear-gradient(to right,var(--gold),#ff9500); transition:width 1s ease; }
        .menu-list { padding:0 20px; display:flex; flex-direction:column; gap:2px; }
        .menu-item { display:flex; align-items:center; justify-content:space-between; padding:16px; background:var(--card); border-radius:14px; cursor:pointer; margin-bottom:4px; }
        .menu-item-left { display:flex; align-items:center; gap:12px; }
        .menu-icon { width:36px; height:36px; border-radius:10px; background:rgba(245,200,66,0.12); display:flex; align-items:center; justify-content:center; }
        .menu-label { font-size:14px; font-weight:500; }
        .menu-arrow { color:var(--sub); font-size:18px; }
        .logout-btn { margin:20px; padding:14px; background:rgba(248,113,113,0.1); border:1px solid rgba(248,113,113,0.2); border-radius:14px; color:var(--red); font-size:14px; font-weight:700; cursor:pointer; font-family:'Noto Sans KR',sans-serif; width:calc(100% - 40px); }
        .match-list-card { background:var(--card); border:1px solid var(--border); border-radius:16px; margin-bottom:12px; overflow:hidden; }
        .match-list-header { padding:14px 16px; display:flex; align-items:center; justify-content:space-between; }
        .match-list-date { font-size:13px; color:var(--sub); }
        .match-list-title { font-size:15px; font-weight:700; }
        .match-result-badge { padding:4px 10px; border-radius:20px; font-size:12px; font-weight:700; }
        .win { background:rgba(74,222,128,0.15); color:var(--green); }
        .lose { background:rgba(248,113,113,0.15); color:var(--red); }
        .draw { background:rgba(255,255,255,0.08); color:var(--sub); }
        .match-score { font-family:'Black Han Sans',sans-serif; font-size:22px; text-align:center; color:var(--gold); padding:4px 16px 12px; }
        .match-members-wrap { padding:0 16px 14px; display:flex; flex-wrap:wrap; gap:6px; }
        .member-chip { background:rgba(255,255,255,0.06); border-radius:20px; padding:4px 10px; font-size:12px; color:var(--text); }
        .match-photo { width:100%; height:140px; object-fit:cover; background:var(--dark3); display:flex; align-items:center; justify-content:center; color:var(--sub); font-size:12px; }
        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.7); z-index:200; display:flex; align-items:flex-end; backdrop-filter:blur(4px); }
        .modal-overlay.hidden { display:none; }
        .modal-sheet { width:100%; max-width:430px; margin:0 auto; background:var(--dark2); border-radius:24px 24px 0 0; border-top:1px solid var(--border); padding:0 0 env(safe-area-inset-bottom); max-height:90dvh; overflow-y:auto; }
        .modal-sheet::-webkit-scrollbar { display:none; }
        .modal-handle { width:40px; height:4px; background:rgba(255,255,255,0.15); border-radius:2px; margin:12px auto; }
        .modal-title { font-family:'Black Han Sans',sans-serif; font-size:18px; color:var(--gold); text-align:center; padding:0 20px 16px; }
        .vote-btn-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:0 20px 20px; }
        .vote-btn { padding:16px; border-radius:14px; border:2px solid; font-size:16px; font-weight:700; cursor:pointer; font-family:'Black Han Sans',sans-serif; transition:all 0.2s; }
        .vote-btn.attend-btn { background:rgba(74,222,128,0.1); border-color:rgba(74,222,128,0.3); color:var(--green); }
        .vote-btn.attend-btn.selected { background:rgba(74,222,128,0.25); border-color:var(--green); box-shadow:0 0 20px rgba(74,222,128,0.2); }
        .vote-btn.absent-btn { background:rgba(248,113,113,0.1); border-color:rgba(248,113,113,0.3); color:var(--red); }
        .vote-btn.absent-btn.selected { background:rgba(248,113,113,0.25); border-color:var(--red); box-shadow:0 0 20px rgba(248,113,113,0.2); }
        .vote-section { padding:0 20px 16px; }
        .vote-section-title { font-size:12px; color:var(--sub); font-weight:700; letter-spacing:1.5px; margin-bottom:10px; }
        .vote-member-list { display:flex; flex-direction:column; gap:6px; }
        .vote-member-item { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:10px; }
        .vote-member-item.attend-item { background:rgba(74,222,128,0.06); }
        .vote-member-item.absent-item { background:rgba(248,113,113,0.06); }
        .vote-member-item.pending-item { background:rgba(255,255,255,0.03); }
        .vote-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
        .vote-dot.g { background:var(--green); }
        .vote-dot.r { background:var(--red); }
        .vote-dot.s { background:var(--sub); }
        .vote-member-name { font-size:14px; flex:1; }
        .toast { position:fixed; top:60px; left:50%; transform:translateX(-50%) translateY(-80px); background:#222; border:1px solid var(--border); border-radius:12px; padding:12px 20px; font-size:14px; font-weight:500; color:var(--text); z-index:999; transition:transform 0.3s; white-space:nowrap; }
        .toast.show { transform:translateX(-50%) translateY(0); }
        .av1{background:linear-gradient(135deg,#F5C842,#e6b800);color:#000;}
        .av2{background:linear-gradient(135deg,#4ade80,#16a34a);color:#000;}
        .av3{background:linear-gradient(135deg,#60a5fa,#2563eb);color:#fff;}
        .av4{background:linear-gradient(135deg,#f472b6,#be185d);color:#fff;}
        .av5{background:linear-gradient(135deg,#a78bfa,#7c3aed);color:#fff;}
        .av6{background:linear-gradient(135deg,#fb923c,#ea580c);color:#fff;}
        .av7{background:linear-gradient(135deg,#34d399,#059669);color:#000;}
        .av8{background:linear-gradient(135deg,#e879f9,#a21caf);color:#fff;}
        .av9{background:linear-gradient(135deg,#fbbf24,#d97706);color:#000;}
        .av10{background:linear-gradient(135deg,#38bdf8,#0284c7);color:#fff;}
        .av11{background:linear-gradient(135deg,#f87171,#dc2626);color:#fff;}
        .av12{background:linear-gradient(135deg,#a3e635,#65a30d);color:#000;}
      `}</style>

      <div id="app">
        {/* LOGIN SCREEN */}
        <div className="screen" id="loginScreen">
          <div className="login-bg"></div>
          <div className="login-top">
            <div className="emblem-wrap">
              <div className="emblem-main">
                <div className="emblem-text-top">HAPPY LIFE</div>
                <div className="emblem-ball">&#9917;</div>
                <div className="emblem-text-bot">FOOTBALL CLUB</div>
              </div>
            </div>
            <div className="emblem-reflection"></div>
            <div className="login-title">HLFC</div>
            <div className="login-sub">Happy Life Football Club</div>
          </div>
          <div className="login-card">
            <div className="login-tab-row">
              <button className="login-tab active">로그인</button>
              <button className="login-tab">회원가입</button>
            </div>
            <div id="loginForm" className="input-group">
              <input className="input-field" id="loginId" type="text" placeholder="아이디" />
              <input className="input-field" id="loginPw" type="password" placeholder="비밀번호" />
              <button className="btn-gold">로그인</button>
              <div className="divider-or">또는</div>
              <button className="btn-kakao">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#000"><path d="M12 3C7.03 3 3 6.26 3 10.3c0 2.55 1.6 4.8 4.04 6.12l-1.03 3.8a.3.3 0 0 0 .46.33L10.8 18a10.4 10.4 0 0 0 1.2.07C16.97 18.07 21 14.8 21 10.3 21 6.26 16.97 3 12 3z"/></svg>
                카카오 로그인
              </button>
            </div>
            <div id="signupForm" className="input-group" style={{display:'none'}}>
              <div className="input-row">
                <input className="input-field" id="signupLast" type="text" placeholder="성" style={{flex:'0 0 80px'}} />
                <input className="input-field" id="signupFirst" type="text" placeholder="이름" />
              </div>
              <input className="input-field" id="signupId" type="text" placeholder="아이디" />
              <input className="input-field" id="signupPw" type="password" placeholder="비밀번호" />
              <input className="input-field" id="signupPw2" type="password" placeholder="비밀번호 확인" />
              <button className="btn-gold">가입하기</button>
            </div>
          </div>
        </div>

        {/* MAIN SCREEN */}
        <div className="screen hidden" id="mainScreen">

          {/* HOME TAB */}
          <div id="tabHome" style={{flex:1,display:'flex',flexDirection:'column'}}>
            <div className="top-header">
              <div className="header-logo">HLFC</div>
              <div className="header-right">
                <div className="icon-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                </div>
              </div>
            </div>
            <div className="scroll-area">
              <div className="section">
                <div className="section-title">NEXT MATCH</div>
                <div className="next-match-card">
                  <div className="match-badge"><div className="match-badge-dot"></div><div className="match-badge-text">UPCOMING</div></div>
                  <div className="match-title">정기 풋살 매치</div>
                  <div className="match-date" id="homeMatchDate"></div>
                  <div className="match-info-row">
                    <div className="match-info-item"><div className="match-info-label">장소</div><div className="match-info-val">월드컵 풋살장</div></div>
                    <div className="match-info-item"><div className="match-info-label">시간</div><div className="match-info-val">20:00</div></div>
                    <div className="match-info-item"><div className="match-info-label">방식</div><div className="match-info-val">6vs6</div></div>
                  </div>
                  <div className="vote-status-row">
                    <div className="vote-chip attend"><div className="vote-chip-num" id="voteAttendCount">0</div><div className="vote-chip-label">출석</div></div>
                    <div className="vote-chip absent"><div className="vote-chip-num" id="voteAbsentCount">0</div><div className="vote-chip-label">불참</div></div>
                    <div className="vote-chip pending"><div className="vote-chip-num" id="votePendingCount">12</div><div className="vote-chip-label">미투표</div></div>
                  </div>
                  <button className="btn-check">출석 확인하기</button>
                </div>
              </div>
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

          {/* MEMBERS TAB */}
          <div id="tabMembers" style={{flex:1,display:'none',flexDirection:'column'}}>
            <div className="top-header"><div className="header-logo">팀원</div></div>
            <div className="scroll-area" style={{padding:'16px 20px'}}>
              <div id="memberRankList"></div>
            </div>
          </div>

          {/* MATCH TAB */}
          <div id="tabMatch" style={{flex:1,display:'none',flexDirection:'column'}}>
            <div className="top-header"><div className="header-logo">매치</div></div>
            <div className="scroll-area" style={{padding:'16px 20px'}}>
              <div id="matchList"></div>
            </div>
          </div>

          {/* MY INFO TAB */}
          <div id="tabMyInfo" style={{flex:1,display:'none',flexDirection:'column',overflowY:'auto',WebkitOverflowScrolling:'touch',paddingBottom:'90px'}}>
            <div className="myinfo-header">
              <div className="myinfo-top-row">
                <div className="hexagon-wrap">
                  <div className="hexagon">
                    <div className="hexagon-inner" id="myHexInner"></div>
                  </div>
                  <div className="tier-badge" id="myTierBadge">GOLD</div>
                </div>
                <div className="myinfo-name-wrap">
                  <div className="myinfo-name" id="myName">홍강현</div>
                  <div className="myinfo-id" id="myUserId">@demo</div>
                  <div className="myinfo-tier-row">
                    <div className="tier-label" id="myTierLabel">GOLD TIER</div>
                  </div>
                </div>
              </div>
              <div className="myinfo-stats-grid">
                <div className="myinfo-stat-box"><div className="myinfo-stat-val" id="myScore">30</div><div className="myinfo-stat-label">누적 점수</div></div>
                <div className="myinfo-stat-box"><div className="myinfo-stat-val" id="myAttend">12</div><div className="myinfo-stat-label">총 출석일</div></div>
                <div className="myinfo-stat-box"><div className="myinfo-stat-val" id="myRank">#1</div><div className="myinfo-stat-label">팀 내 순위</div></div>
              </div>
            </div>
            <div className="attend-section">
              <div className="attend-header">
                <div className="attend-title">출석률</div>
                <div className="attend-pct" id="myAttendPct">92.3%</div>
              </div>
              <div className="big-bar-wrap">
                <div className="big-bar" id="myAttendBar" style={{width:'0%'}}></div>
              </div>
            </div>
            <div className="menu-list">
              <div className="menu-item">
                <div className="menu-item-left">
                  <div className="menu-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5C842" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                  <div className="menu-label">내 정보 수정</div>
                </div>
                <div className="menu-arrow">&rsaquo;</div>
              </div>
              <div className="menu-item">
                <div className="menu-item-left">
                  <div className="menu-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5C842" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg></div>
                  <div className="menu-label">출석 기록</div>
                </div>
                <div className="menu-arrow">&rsaquo;</div>
              </div>
              <div className="menu-item">
                <div className="menu-item-left">
                  <div className="menu-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5C842" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg></div>
                  <div className="menu-label">회비 내역</div>
                </div>
                <div className="menu-arrow">&rsaquo;</div>
              </div>
              <div className="menu-item">
                <div className="menu-item-left">
                  <div className="menu-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5C842" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                  <div className="menu-label">문의하기</div>
                </div>
                <div className="menu-arrow">&rsaquo;</div>
              </div>
            </div>
            <button className="logout-btn">로그아웃</button>
          </div>

          {/* BOTTOM NAV */}
          <div className="bottom-nav">
            <button className="nav-btn active" id="nav-home">
              <svg viewBox="0 0 24 24" fill="none" stroke="#F5C842" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
              홈
            </button>
            <button className="nav-btn" id="nav-members">
              <svg viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              팀원
            </button>
            <button className="nav-btn" id="nav-match">
              <svg viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              매치
            </button>
            <button className="nav-btn" id="nav-myinfo">
              <svg viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              내정보
            </button>
          </div>
        </div>
      </div>

      {/* VOTE MODAL */}
      <div className="modal-overlay hidden" id="voteModal">
        <div className="modal-sheet">
          <div className="modal-handle"></div>
          <div className="modal-title">출석 투표</div>
          <div style={{textAlign:'center',color:'var(--sub)',fontSize:'12px',margin:'-10px 0 16px',padding:'0 20px'}} id="voteMatchInfo"></div>
          <div className="vote-btn-row">
            <button className="vote-btn attend-btn" id="voteAttendBtn">
              <div style={{fontSize:'22px',marginBottom:'4px'}}>O</div>
              출석
            </button>
            <button className="vote-btn absent-btn" id="voteAbsentBtn">
              <div style={{fontSize:'22px',marginBottom:'4px'}}>X</div>
              불참
            </button>
          </div>
          <div className="vote-section">
            <div className="vote-section-title">출석 (<span id="voteAttendListCount">0</span>명)</div>
            <div className="vote-member-list" id="voteAttendList"></div>
          </div>
          <div className="vote-section">
            <div className="vote-section-title">불참 (<span id="voteAbsentListCount">0</span>명)</div>
            <div className="vote-member-list" id="voteAbsentList"></div>
          </div>
          <div className="vote-section">
            <div className="vote-section-title">미투표 (<span id="votePendingListCount">12</span>명)</div>
            <div className="vote-member-list" id="votePendingList"></div>
          </div>
        </div>
      </div>

      <div className="toast" id="toast"></div>
    </>
  );
}
