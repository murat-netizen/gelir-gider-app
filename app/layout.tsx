import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GelirGider - Finansal Takip Uygulaması',
  description: 'Gelir ve giderlerinizi kolayca takip edin. Çoklu para birimi desteği, düzenli ödemeler ve detaylı raporlar.',
  keywords: ['gelir gider', 'finans', 'bütçe', 'para takip', 'muhasebe'],
  authors: [{ name: 'GelirGider' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#4f46e5',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className="antialiased">{children}</body>
    </html>
  )
}
