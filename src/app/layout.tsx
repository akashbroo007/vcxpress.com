import type {Metadata} from 'next'
import {IBM_Plex_Mono, Lexend_Deca} from 'next/font/google'

import './globals.css'
import GlobalNavbar from '@/components/GlobalNavbar'
import GlobalFooter from '@/components/GlobalFooter'
import CookieConsent from '@/components/CookieConsent'
import {ThemeProvider} from '@/components/ThemeProvider'
import { cn } from "@/lib/utils";

const ibmPlexMono = IBM_Plex_Mono({subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-mono'})
const lexendDeca = Lexend_Deca({subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-body'})

export const metadata: Metadata = {
  title: 'VCXPRESS',
  description: 'Fast, clean, and easy-to-understand VC funding news.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  icons: {
    icon: [{url: '/brand/icons/favicon.ico', type: 'image/x-icon'}],
    apple: [{url: '/brand/icons/vcx-icon-192.png'}],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(ibmPlexMono.variable, lexendDeca.variable)}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="bg-background-light text-text-main dark:bg-background-dark dark:text-white transition-colors duration-300 ease-in-out">
        <ThemeProvider>
          <GlobalNavbar />
          {children}
          <CookieConsent />
          <GlobalFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}
