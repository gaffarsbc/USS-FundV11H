import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "USS Fundraising | Serve Today. Build Tomorrow.",
  description: "Support United Social Services Inc. (USS) essential services today and help develop future housing pathways, Campus infrastructure and long-term capacity.",
  openGraph: {
    title: "USS Fundraising | Serve Today. Build Tomorrow.",
    description: "Fund USS Today. Build USS Tomorrow. Support essential services, future housing pathways and long-term capacity.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "USS Fundraising | Serve Today. Build Tomorrow.",
    description: "Fund USS Today. Build USS Tomorrow.",
  },
  icons: {
    icon: "/uss-monogram.svg",
    shortcut: "/uss-monogram.svg",
    apple: "/uss-primary-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
