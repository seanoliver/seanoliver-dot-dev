'use client'

import { Analytics } from '@vercel/analytics/react'
import clsx from 'clsx'
import Head from 'next/head'
import './globals.css'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
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
      path: '../../public/fonts/jetbrains-mono/JetBrainsMono-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/jetbrains-mono/JetBrainsMono-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/jetbrains-mono/JetBrainsMono-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../../public/fonts/jetbrains-mono/JetBrainsMono-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../public/fonts/jetbrains-mono/JetBrainsMono-ExtraBoldItalic.ttf',
      weight: '800',
      style: 'italic',
    },
    {
      path: '../../public/fonts/jetbrains-mono/JetBrainsMono-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/jetbrains-mono/JetBrainsMono-MediumItalic.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../public/fonts/jetbrains-mono/JetBrainsMono-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/jetbrains-mono/JetBrainsMono-SemiBoldItalic.ttf',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../../public/fonts/jetbrains-mono/JetBrainsMono-Thin.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/jetbrains-mono/JetBrainsMono-ThinItalic.ttf',
      weight: '300',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})

const monolisa = localFont({
  src: [
    {
      path: '../../public/fonts/monolisa/MonoLisaSeanStyle-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/monolisa/MonoLisaSeanStyle-RegularItalic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/monolisa/MonoLisaSeanStyle-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/monolisa/MonoLisaSeanStyle-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../../public/fonts/monolisa/MonoLisaSeanStyle-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/monolisa/MonoLisaSeanStyle-MediumItalic.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../public/fonts/monolisa/MonoLisaSeanStyle-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/monolisa/MonoLisaSeanStyle-SemiBoldItalic.ttf',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../../public/fonts/monolisa/MonoLisaSeanStyle-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/monolisa/MonoLisaSeanStyle-LightItalic.ttf',
      weight: '300',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-monolisa',
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
      </Head>
      <body className={`font-sans flex flex-col min-h-screen`}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <NavContext.Provider value={navRefs}>
            <div className='container flex flex-col justify-center items-center xl:max-w-[850px] lg:max-w-[850px] md:max-w-3/4 sm:max-w-4/5 max-w-5/6 mx-auto'>
              <Header className='w-full flex flex-col mt-5' />
              {children}
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
