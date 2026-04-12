"use client";
import { useState } from "react";

interface Props {
  onLogin: (name: string, id: string) => void;
}

export default function LoginScreen({ onLogin }: Props) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [signName, setSignName] = useState("");
  const [signId, setSignId] = useState("");
  const [signPw, setSignPw] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"ok" | "err">("err");

  function showMsg(text: string, type: "ok" | "err") {
    setMsg(text); setMsgType(type);
    setTimeout(() => setMsg(""), 3000);
  }

  function doLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!loginId || !loginPw) return showMsg("아이디와 비밀번호를 입력하세요.", "err");
    if (loginId === "admin" && loginPw === "admin1234") return onLogin("관리자", "admin");
    const stored = localStorage.getItem(`hlfc_user_${loginId}`);
    if (!stored) return showMsg("존재하지 않는 아이디입니다.", "err");
    const user = JSON.parse(stored);
    if (user.pw !== loginPw) return showMsg("비밀번호가 틀렸습니다.", "err");
    onLogin(user.name, loginId);
  }

  function doSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!signName.trim()) return showMsg("이름을 입력하세요.", "err");
    if (signId.length < 3) return showMsg("아이디는 3자 이상이어야 합니다.", "err");
    if (signPw.length < 4) return showMsg("비밀번호는 4자 이상이어야 합니다.", "err");
    if (localStorage.getItem(`hlfc_user_${signId}`)) return showMsg("이미 사용 중인 아이디입니다.", "err");
    localStorage.setItem(`hlfc_user_${signId}`, JSON.stringify({ name: signName.trim(), pw: signPw, createdAt: Date.now() }));
    showMsg("회원가입 완료! 로그인 하세요.", "ok");
    setSignName(""); setSignId(""); setSignPw("");
    setTab("login");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      {/* Logo */}
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="38" fill="#1a1a1a" stroke="#FFD700" strokeWidth="2" />
          <text x="40" y="34" textAnchor="middle" fill="#FFD700" fontSize="13" fontFamily="Bebas Neue, sans-serif" letterSpacing="2">HAPPY</text>
          <text x="40" y="50" textAnchor="middle" fill="#ffffff" fontSize="11" fontFamily="Bebas Neue, sans-serif" letterSpacing="1">LIFE FC</text>
        </svg>
        <p style={{ color: "#888", fontSize: 12, marginTop: 8, letterSpacing: 2 }}>FOOTBALL CLUB</p>
      </div>

      {/* Card */}
      <div style={{ width: "100%", maxWidth: 360, background: "#141414", border: "1px solid #FFD700", borderRadius: 16, overflow: "hidden" }}>
        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #2a2a2a" }}>
          {(["login", "signup"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "14px", background: "none", border: "none", color: tab === t ? "#FFD700" : "#555", fontFamily: "Noto Sans KR, sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer", borderBottom: tab === t ? "2px solid #FFD700" : "2px solid transparent", transition: "all 0.2s" }}>
              {t === "login" ? "Log in" : "Sign up"}
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{ padding: 24 }}>
          {msg && (
            <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 8, background: msgType === "ok" ? "#0f2" + "1" : "#f001", border: `1px solid ${msgType === "ok" ? "#0f0" : "#f00"}`, color: msgType === "ok" ? "#0f0" : "#f66", fontSize: 13 }}>
              {msg}
            </div>
          )}

          {tab === "login" ? (
            <form onSubmit={doLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input value={loginId} onChange={e => setLoginId(e.target.value)} placeholder="ID" style={inputStyle} />
              <input value={loginPw} onChange={e => setLoginPw(e.target.value)} type="password" placeholder="Password" style={inputStyle} />
              <button type="submit" style={btnStyle}>Log in</button>
            </form>
          ) : (
            <form onSubmit={doSignup} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input value={signName} onChange={e => setSignName(e.target.value)} placeholder="Name" style={inputStyle} />
              <input value={signId} onChange={e => setSignId(e.target.value)} placeholder="ID (3자 이상)" style={inputStyle} />
              <input value={signPw} onChange={e => setSignPw(e.target.value)} type="password" placeholder="Password (4자 이상)" style={inputStyle} />
              <button type="submit" style={btnStyle}>Sign up</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "#0a0a0a", border: "1px solid #333", borderRadius: 8,
  color: "#f0f0f0", padding: "12px 14px", fontSize: 14,
  fontFamily: "Noto Sans KR, sans-serif", outline: "none", width: "100%",
};
const btnStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #FFD700, #FFA500)", border: "none",
  borderRadius: 8, color: "#1a0a00", padding: "13px", fontSize: 15,
  fontWeight: 700, fontFamily: "Noto Sans KR, sans-serif", cursor: "pointer",
};
