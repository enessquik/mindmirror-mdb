import './globals.css'
import type { Metadata } from 'next'
import { AuthProvider } from '@/context/AuthContext'

export const metadata: Metadata = {
  title: 'MindMirror - Watch Movies & Series Online',
  description: 'Stream your favorite movies and TV series online',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Film İzle" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
