import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { SITE_INFO } from "@/constants/info";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { NotificationProvider } from "@/components/providers/NotificationProvider";
import { BProgressProvider } from "@/components/providers/b-progress-provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: SITE_INFO.title,
    template: `%s | ${SITE_INFO.name}`,
  },
  description: SITE_INFO.description,
  keywords: [...SITE_INFO.keywords],
  authors: [
    {
      name: SITE_INFO.author.name,
      url: SITE_INFO.author.url,
    },
  ],
  creator: SITE_INFO.author.name,
  icons: {
    icon: [
      { url: '/logo.svg' }, // 默认 favicon
    ],
  },
  openGraph: {
    type: "website",
    locale: SITE_INFO.locale,
    url: SITE_INFO.url,
    title: SITE_INFO.title,
    description: SITE_INFO.description,
    siteName: SITE_INFO.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_INFO.title,
    description: SITE_INFO.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={SITE_INFO.locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} flex flex-col min-h-screen`}>
        <ThemeProvider>
          <BProgressProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </BProgressProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
