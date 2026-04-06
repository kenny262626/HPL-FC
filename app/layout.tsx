// src/app/layout.tsx
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {

  description: "Happy Life Football Club",
};

// 이게 핵심! 모바일 화면 꽉 채우기
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",   // 아이폰 노치/다이나믹 아일랜드까지 꽉 채움
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
