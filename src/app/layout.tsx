'use client'

import { Analytics } from '@vercel/analytics/react'
import clsx from 'clsx'
import Head from 'next/head'
import './globals.css'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import SkipNav from '@/components/skip-nav'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { ThemeProvider } from '@/components/theme-provider'
import { NAV_ITEMS } from '@/lib/constants'
import { NavRefsProps } from '@/lib/types'
import { Inter } from 'next/font/google'
import { useRef } from 'react'
import { NavContext } from '@/hooks/use-nav-context'
import JumpToTop from '@/components/jump-to-top'
import localFont from 'next/font/local'

const jetBrainsMono = localFont({
  src: [
    {
      path: '../../public/fonts/jetbrains-mono/JetBrainsMono-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/jetbrains-mono/JetBrainsMono-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/jetbrains-mono/JetBrainsMono-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/jetbrains-mono/JetBrainsMono-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-jetbrains-mono',
  preload: true,
})

const monolisa = localFont({
  src: [
    {
      path: '../../public/fonts/monolisa/MonoLisaSeanStyle-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/monolisa/MonoLisaSeanStyle-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/monolisa/MonoLisaSeanStyle-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-monolisa',
  preload: true,
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

/**
 * Root layout component
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navRefs: NavRefsProps = NAV_ITEMS.reduce((acc: any, item) => {
    acc[item.name] = useRef(null)
    return acc
  }, {})

  return (
    <html
      lang='en'
      className={clsx(
        'text-slate-800 bg-slate-300 dark:text-slate-200 dark:bg-slate-700 bg-gradient-to-b bg-no-repeat dark:from-slate-900 dark:to-slate-700 from-slate-100 to-slate-300',
        monolisa.variable,
        jetBrainsMono.variable,
        inter.className
      )}
    >
      <Head>
        <title>Sean Oliver</title>
        <meta property='og:title' content='Sean Oliver' key='title' />
        <link
          rel='alternate'
          type='application/rss+xml'
          title='Sean Oliver RSS Feed'
          href='https://seanoliver.dev/feed.xml'
        />
      </Head>
      <body className={`font-sans flex flex-col min-h-screen`}>
        <SkipNav />
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <NavContext.Provider value={navRefs}>
            <div className='container flex flex-col justify-center items-center xl:max-w-[850px] lg:max-w-[850px] md:max-w-3/4 sm:max-w-4/5 max-w-5/6 mx-auto'>
              <Header className='w-full flex flex-col mt-5' />
              <main id='main-content' className='w-full'>
                {children}
              </main>
              <Footer />
            </div>
          </NavContext.Provider>
        </ThemeProvider>
        <Analytics />
        <JumpToTop />
        <TailwindIndicator />
      </body>
    </html>
  )
}
