'use client'

import { Analytics } from '@vercel/analytics/react';
import clsx from 'clsx';
import Head from 'next/head';
import './globals.css';

/** Inter Font */

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import { ThemeProvider } from '@/components/theme-provider';
import { NAV_ITEMS } from '@/lib/constants';
import { NavRefsProps } from '@/lib/types';
import { Inter } from 'next/font/google';
import { useRef } from 'react';
import { NavContext } from '@/hooks/use-nav-context';
import JumpToTop from '@/components/jump-to-top';


const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

/**
 * Root layout component
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {

  const navRefs: NavRefsProps = NAV_ITEMS.reduce((acc: any, item) => {
    acc[item.name] = useRef(null)
    return acc
  }, {})

  return (
    <html
      lang="en"
      className={clsx(
        'text-slate-800 bg-slate-300 dark:text-slate-200 dark:bg-slate-700 bg-gradient-to-b bg-no-repeat dark:from-slate-900 dark:to-slate-700 from-slate-100 to-slate-300',
        inter.className.toString()
      )}
    >
      <Head>
        <title>Sean Oliver</title>
        <meta property="og:title" content="Sean Oliver" key="title" />
      </Head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NavContext.Provider value={navRefs}>
            <div className="container flex flex-col justify-center items-center xl:max-w-[700px] lg:max-w-[600px] md:max-w-3/4 sm:max-w-4/5 max-w-5/6 mx-auto">
              <Header className="w-full flex flex-col mt-5" />
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
