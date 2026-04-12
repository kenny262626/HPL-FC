"use client";
import { computeMemberStats } from "@/lib/helpers";

export default function TabMembers() {
  const stats = computeMemberStats();

  const tierLabel = { gold: "GOLD", silver: "SILVER", bronze: "BRONZE" };
  const tierColor = {
    gold: { bg: "linear-gradient(135deg,#FFD700,#FFA500)", text: "#1a0a00", shadow: "0 0 10px rgba(255,215,0,0.5)" },
    silver: { bg: "linear-gradient(135deg,#E8E8E8,#A0A0A0)", text: "#1a1a1a", shadow: "0 0 8px rgba(192,192,192,0.4)" },
    bronze: { bg: "linear-gradient(135deg,#CD7F32,#8B4513)", text: "#fff8f0", shadow: "0 0 8px rgba(205,127,50,0.4)" },
  };

  return (
    <div style={{ padding: "24px 16px 100px" }}>
      <div style={{ marginBottom: 20 }}>
        <p style={{ color: "#888", fontSize: 11, letterSpacing: 3 }}>HAPPY LIFE FC</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#FFD700" }}>TEAM STATS</h2>
      </div>

      {/* Header */}
      <div style={{ display: "grid", gridTemplateColumns: "36px 1fr 52px 52px 40px", gap: 8, padding: "8px 12px", marginBottom: 8 }}>
        {["", "이름", "출석률", "점수", "순위"].map((h, i) => (
          <span key={i} style={{ color: "#555", fontSize: 10, letterSpacing: 1, textAlign: i > 1 ? "center" : "left" }}>{h}</span>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {stats.map((m) => {
          const tc = tierColor[m.tier];
          return (
            <div key={m.name} style={{ background: "#141414", border: "1px solid #2a2a2a", borderRadius: 12, padding: "12px", display: "grid", gridTemplateColumns: "36px 1fr 52px 52px 40px", gap: 8, alignItems: "center" }}>
              {/* Tier Badge */}
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: tc.bg, boxShadow: tc.shadow, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: tc.text, fontSize: 9, fontWeight: 800, letterSpacing: 0.5 }}>{tierLabel[m.tier]}</span>
              </div>
              <span style={{ color: "#f0f0f0", fontSize: 14, fontWeight: 500 }}>{m.name}</span>
              <span style={{ color: "#FFD700", fontSize: 13, fontWeight: 700, textAlign: "center" }}>{m.rate}%</span>
              <span style={{ color: "#aaa", fontSize: 13, textAlign: "center" }}>{m.totalScore}pt</span>
              <span style={{ color: "#555", fontSize: 12, textAlign: "center" }}>#{m.rank}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
