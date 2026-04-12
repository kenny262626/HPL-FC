'use client';

import { useEffect, useRef, useState } from 'react';
import Toast, { ToastHandle } from '@/components/Toast';
import AuthScreen from '@/components/AuthScreen';
import HomeScreen from '@/components/HomeScreen';
import VoteScreen from '@/components/VoteScreen';
import TeamScreen from '@/components/TeamScreen';
import AdminScreen from '@/components/AdminScreen';

type Screen = 'auth' | 'home' | 'vote' | 'team' | 'admin';

export default function Page() {
  const [screen, setScreen] = useState<Screen | null>(null);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const toastRef = useRef<ToastHandle>(null);

  useEffect(() => {
    // 세션 복원 (localStorage에 저장된 로그인 정보 확인)
    const savedId = localStorage.getItem('hplfc_uid');
    const savedName = localStorage.getItem('hplfc_uname');
    if (savedId && savedName) {
      setUserId(savedId);
      setUserName(savedName);
      setScreen('home');
    } else {
      setScreen('auth');
    }
  }, []);

  function showToast(msg: string) {
    toastRef.current?.show(msg);
  }

  function handleLogin(id: string, name: string) {
    localStorage.setItem('hplfc_uid', id);
    localStorage.setItem('hplfc_uname', name);
    setUserId(id);
    setUserName(name);
    setScreen('home');
  }

  function doLogout() {
    localStorage.removeItem('hplfc_uid');
    localStorage.removeItem('hplfc_uname');
    setUserId('');
    setUserName('');
    setScreen('auth');
  }

  function goScreen(s: Screen) {
    setScreen(s);
  }

  if (screen === null) return null;

  return (
    <div id="app">
      <Toast ref={toastRef} />
      {screen === 'auth' && (
        <AuthScreen onLogin={handleLogin} showToast={showToast} />
      )}
      {screen === 'home' && (
        <HomeScreen userId={userId} userName={userName} onNavigate={(s) => goScreen(s as Screen)} />
      )}
      {screen === 'vote' && (
        <VoteScreen userName={userName} onNavigate={(s) => goScreen(s as Screen)} showToast={showToast} />
      )}
      {screen === 'team' && (
        <TeamScreen onNavigate={(s) => goScreen(s as Screen)} />
      )}
      {screen === 'admin' && (
        <AdminScreen userId={userId} onNavigate={(s) => goScreen(s as Screen)} onLogout={doLogout} showToast={showToast} />
      )}
    </div>
  );
}
