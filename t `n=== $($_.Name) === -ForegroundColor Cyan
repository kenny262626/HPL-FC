// src/components/hlfc/LoginScreen.tsx
export default function LoginScreen() {
  return (
    <div className="screen" id="loginScreen">
      <div className="login-bg"></div>

      {/* 엠블럼 + 타이틀 */}
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

      {/* 로그인 카드 */}
      <div className="login-card">
        {/* 탭 전환 버튼 */}
        <div className="login-tab-row">
          <button className="login-tab active">로그인</button>
          <button className="login-tab">회원가입</button>
        </div>

        {/* 로그인 폼 */}
        <div id="loginForm" className="input-group">
          <input className="input-field" id="loginId" type="text" placeholder="아이디" />
          <input className="input-field" id="loginPw" type="password" placeholder="비밀번호" />
          <button className="btn-gold">로그인</button>
          <div className="divider-or">또는</div>
          <button className="btn-kakao">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#000">
              <path d="M12 3C7.03 3 3 6.26 3 10.3c0 2.55 1.6 4.8 4.04 6.12l-1.03 3.8a.3.3 0 0 0 .46.33L10.8 18a10.4 10.4 0 0 0 1.2.07C16.97 18.07 21 14.8 21 10.3 21 6.26 16.97 3 12 3z"/>
            </svg>
            카카오 로그인
          </button>
        </div>

        {/* 회원가입 폼 */}
        <div id="signupForm" className="input-group" style={{ display: 'none' }}>
          <div className="input-row">
            <input className="input-field" id="signupLast" type="text" placeholder="성" style={{ flex: '0 0 80px' }} />
            <input className="input-field" id="signupFirst" type="text" placeholder="이름" />
          </div>
          <input className="input-field" id="signupId" type="text" placeholder="아이디" />
          <input className="input-field" id="signupPw" type="password" placeholder="비밀번호" />
          <input className="input-field" id="signupPw2" type="password" placeholder="비밀번호 확인" />
          <button className="btn-gold">가입하기</button>
        </div>
      </div>
    </div>
  );
}
