"use client";
import { useState } from "react";
import VoteModal from "./VoteModal";

interface Props { userName: string; }

export default function TabHome({ userName }: Props) {
  const [voted, setVoted] = useState<null | "attend" | "absent">(null);
  const [showModal, setShowModal] = useState(false);

  const match = { date: "2026-04-12", time: "10:00", place: "상암 풋살파크", method: "5vs5" };

  return (
    <div style={{ padding: "24px 16px 100px" }}>
      <div style={{ marginBottom: 24 }}>
        <p style={{ color: "#888", fontSize: 12, letterSpacing: 2 }}>WELCOME BACK</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#FFD700" }}>{userName}</h2>
      </div>

      {/* Upcoming Card */}
      <div style={{ background: "#141414", border: "1px solid #2a2a2a", borderRadius: 16, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ background: "linear-gradient(135deg, #1a1a00, #2a1a00)", padding: "14px 18px", borderBottom: "1px solid #FFD70033" }}>
          <span style={{ color: "#FFD700", fontSize: 11, letterSpacing: 3, fontWeight: 700 }}>UPCOMING MATCH</span>
        </div>
        <div style={{ padding: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "날짜", value: match.date },
              { label: "시간", value: match.time },
              { label: "장소", value: match.place },
              { label: "방식", value: match.method },
            ].map(r => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#888", fontSize: 13 }}>{r.label}</span>
                <span style={{ color: "#f0f0f0", fontSize: 13, fontWeight: 500 }}>{r.value}</span>
              </div>
            ))}
          </div>

          {!voted ? (
            <button onClick={() => setShowModal(true)} style={{ marginTop: 18, width: "100%", background: "linear-gradient(135deg, #FFD700, #FFA500)", border: "none", borderRadius: 10, color: "#1a0a00", padding: "13px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "Noto Sans KR, sans-serif" }}>
              출석 투표하기
            </button>
          ) : (
            <div style={{ marginTop: 18, textAlign: "center", padding: "12px", background: voted === "attend" ? "#0f01" : "#f001", border: `1px solid ${voted === "attend" ? "#0f0" : "#f00"}`, borderRadius: 10 }}>
              <span style={{ color: voted === "attend" ? "#0f0" : "#f66", fontWeight: 700 }}>
                {voted === "attend" ? "출석 투표 완료!" : "불참 투표 완료!"}
              </span>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <VoteModal onClose={() => setShowModal(false)} onVote={(v) => { setVoted(v); setShowModal(false); }} />
      )}
    </div>
  );
}
