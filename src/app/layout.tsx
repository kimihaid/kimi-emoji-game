import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:3000'),
  title: '🎵 Emoji Sound Designer - Create Fun Sounds for Any Emoji!',
  description: 'Generate cartoon-like sound effects for any emoji! Click emojis to hear their sounds, download WAV files, and compete with users worldwide. Built with Web Audio API.',
  keywords: 'emoji, sound effects, cartoon sounds, web audio, sound generator, WAV download, emoji sounds',
  authors: [{ name: 'Emoji Sound Designer' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: '🎵 Emoji Sound Designer',
    description: 'Generate cartoon-like sound effects for any emoji!',
    type: 'website',
    url: '/',
    siteName: 'Emoji Sound Designer',
  },
  twitter: {
    card: 'summary_large_image',
    title: '🎵 Emoji Sound Designer',
    description: 'Generate cartoon-like sound effects for any emoji!',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}