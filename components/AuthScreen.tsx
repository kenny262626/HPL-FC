'use client';

import { useState } from 'react';
import { apiLogin, apiSignup } from '@/lib/api';

interface Props {
  onLogin: (id: string, name: string) => void;
  showToast: (msg: string) => void;
}

export default function AuthScreen({ onLogin, showToast }: Props) {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [loginError, setLoginError] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupId, setSignupId] = useState('');
  const [signupPw, setSignupPw] = useState('');
  const [signupError, setSignupError] = useState('');

  function switchTab(t: 'login' | 'signup') {
    setTab(t);
    setLoginError('');
    setSignupError('');
  }

  async function doLogin(e: React.FormEvent) {
    e.preventDefault();
    const id = loginId.trim();
    const pw = loginPw;
    if (!id || !pw) { setLoginError('아이디와 비밀번호를 입력해주세요'); return; }
    try {
      const user = await apiLogin(id, pw);
      setLoginId('');
      setLoginPw('');
      setLoginError('');
      onLogin(user.id, user.name);
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : '로그인 실패');
    }
  }

  async function doSignup(e: React.FormEvent) {
    e.preventDefault();
    const name = signupName.trim();
    const id = signupId.trim();
    const pw = signupPw;
    if (!name) { setSignupError('이름을 입력해주세요'); return; }
    if (!id) { setSignupError('아이디를 입력해주세요'); return; }
    if (id.length < 3) { setSignupError('아이디는 3자 이상이어야 합니다'); return; }
    if (!pw) { setSignupError('비밀번호를 입력해주세요'); return; }
    if (pw.length < 4) { setSignupError('비밀번호는 4자 이상이어야 합니다'); return; }
    try {
      await apiSignup(id, name, pw);
      setSignupError('');
      setSignupName('');
      setSignupId('');
      setSignupPw('');
      showToast('회원가입 완료! 로그인해주세요');
      switchTab('login');
    } catch (err: unknown) {
      setSignupError(err instanceof Error ? err.message : '회원가입 실패');
    }
  }

  return (
    <div id="screen-auth" className="screen active">
      <div className="auth-bg" />
      <div className="auth-content">
        <div className="auth-logo-wrap">
          <div className="logo-svg-wrap">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="22" stroke="#e8c84a" strokeWidth="1.5" fill="none"/>
              <polygon points="28,10 33,23 47,23 36,31 40,44 28,36 16,44 20,31 9,23 23,23" fill="#e8c84a" opacity="0.9"/>
              <text x="28" y="32" textAnchor="middle" fontFamily="Bebas Neue,sans-serif" fontSize="11" fill="#000" fontWeight="bold" letterSpacing="1">HPLFC</text>
            </svg>
          </div>
          <div className="auth-title-text">HAPPY LIFE FC</div>
          <div className="auth-subtitle">Football Club</div>
        </div>

        <div className="auth-box">
          <div className="auth-tabs">
            <button className={`auth-tab${tab === 'login' ? ' active' : ''}`} onClick={() => switchTab('login')}>LOG IN</button>
            <button className={`auth-tab${tab === 'signup' ? ' active' : ''}`} onClick={() => switchTab('signup')}>SIGN UP</button>
          </div>

          <form className={`auth-form${tab === 'login' ? ' active' : ''}`} onSubmit={doLogin}>
            <input className="auth-input" type="text" placeholder="ID" autoComplete="username" value={loginId} onChange={e => setLoginId(e.target.value)} />
            <input className="auth-input" type="password" placeholder="Password" autoComplete="current-password" value={loginPw} onChange={e => setLoginPw(e.target.value)} />
            <div className={`auth-error${loginError ? ' show' : ''}`}>{loginError}</div>
            <button className="auth-btn" type="submit">LOG IN</button>
          </form>

          <form className={`auth-form${tab === 'signup' ? ' active' : ''}`} onSubmit={doSignup}>
            <input className="auth-input" type="text" placeholder="NAME" autoComplete="name" value={signupName} onChange={e => setSignupName(e.target.value)} />
            <input className="auth-input" type="text" placeholder="ID" autoComplete="username" value={signupId} onChange={e => setSignupId(e.target.value)} />
            <input className="auth-input" type="password" placeholder="Password" autoComplete="new-password" value={signupPw} onChange={e => setSignupPw(e.target.value)} />
            <div className={`auth-error${signupError ? ' show' : ''}`}>{signupError}</div>
            <button className="auth-btn" type="submit">SIGN UP</button>
          </form>
        </div>
      </div>
    </div>
  );
}
