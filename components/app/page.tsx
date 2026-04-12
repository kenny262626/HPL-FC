'use client';

import { useEffect, useRef, useState } from 'react';
import { MEMBERS, ADMIN_MEMBER_NAME } from '@/lib/data';
import Toast, { ToastHandle } from '@/components/Toast';
import AuthScreen from '@/components/AuthScreen';
import HomeScreen from '@/components/HomeScreen';
import VoteScreen from '@/components/VoteScreen';
import TeamScreen from '@/components/TeamScreen';
import MatchScreen from '@/components/MatchScreen';
import AdminScreen from '@/components/AdminScreen';

type Screen = 'auth' | 'home' | 'vote' | 'team' | 'match' | 'admin';

export default function Page() {
  const [screen, setScreen] = useState<Screen | null>(null);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('member');
  const [memberName, setMemberName] = useState(''); // 실제 데이터와 연결된 이름
  const toastRef = useRef<ToastHandle>(null);

  useEffect(() => {
    const id = localStorage.getItem('hplfc_uid');
    const name = localStorage.getItem('hplfc_uname');
    const role = localStorage.getItem('hplfc_role') || 'member';
    const mapped = localStorage.getItem('hplfc_mapped') || '';
    if (id && name) {
      setUserId(id); setUserName(name); setUserRole(role);
      // memberName: 매핑된 이름 > 이름이 MEMBERS에 있으면 그대로 > admin이면 ADMIN_MEMBER_NAME
      const resolved = mapped || (MEMBERS.includes(name) ? name : (role === 'admin' ? ADMIN_MEMBER_NAME : ''));
      setMemberName(resolved);
      setScreen('home');
    } else { setScreen('auth'); }
  }, []);

  function showToast(msg: string) { toastRef.current?.show(msg); }

  function handleLogin(id: string, name: string, role: string, mappedMember: string | null) {
    localStorage.setItem('hplfc_uid', id);
    localStorage.setItem('hplfc_uname', name);
    localStorage.setItem('hplfc_role', role);
    localStorage.setItem('hplfc_mapped', mappedMember || '');
    setUserId(id); setUserName(name); setUserRole(role);
    const resolved = mappedMember || (MEMBERS.includes(name) ? name : (role === 'admin' ? ADMIN_MEMBER_NAME : ''));
    setMemberName(resolved);
    setScreen('home');
  }

  function doLogout() {
    ['hplfc_uid','hplfc_uname','hplfc_role','hplfc_mapped'].forEach(k => localStorage.removeItem(k));
    setUserId(''); setUserName(''); setUserRole('member'); setMemberName('');
    setScreen('auth');
  }

  const canEdit = userRole === 'admin' || userRole === 'coach';

  if (screen === null) return null;

  return (
    <div id="app">
      <Toast ref={toastRef}/>
      {screen === 'auth' && <AuthScreen onLogin={handleLogin} showToast={showToast}/>}
      {screen === 'home' && <HomeScreen userId={userId} userName={userName} memberName={memberName} onNavigate={s => setScreen(s as Screen)}/>}
      {screen === 'vote' && <VoteScreen memberName={memberName} onNavigate={s => setScreen(s as Screen)} showToast={showToast}/>}
      {screen === 'team' && <TeamScreen isAdmin={userRole==='admin'} onNavigate={s => setScreen(s as Screen)} showToast={showToast}/>}
      {screen === 'match' && <MatchScreen canEdit={canEdit} onNavigate={s => setScreen(s as Screen)} showToast={showToast}/>}
      {screen === 'admin' && <AdminScreen userId={userId} userName={userName} memberName={memberName} role={userRole} onNavigate={s => setScreen(s as Screen)} onLogout={doLogout} showToast={showToast}/>}
    </div>
  );
}
