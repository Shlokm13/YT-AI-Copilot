import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

// Load fonts
const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

// Metadata for SEO
export const metadata = {
  title: 'YT AI Copilot',
  description: 'AI-powered YouTube assistant for video summaries and Q&A',
  generator: 'v0.app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark bg-background">
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
