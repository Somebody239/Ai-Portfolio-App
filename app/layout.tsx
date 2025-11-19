import type { Metadata } from 'next'
import '../styles/global.css'

export const metadata: Metadata = {
  title: 'UniPlanner.ai - Portfolio Management',
  description: 'AI-powered university application portfolio management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}

