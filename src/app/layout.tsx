import './globals.css'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

const jetBrainsMono = localFont({
  src: '../../public/fonts/JetBrainsMono-Regular.woff2',
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

  const inter = Inter({ subsets: ['latin'] })


// Metadata for the home page
export const metadata = {
  title: 'Sean Oliver',
  description: 'Software Engineer in San Francisco, CA',
  longDescription: `After 13 years in the tech industry, I've seen it all - the ups, the
  downs, and everything in between. I started as a marketer, understanding
  what people want, what they need, and how to tell them we have it. Now, I
  build it. I live in San Francisco. I've got a family – a wife and two
  kids. When I'm not coding, we play tennis or travel. I read a lot, mostly
  through audiobooks. I'm interested in how we organize our knowledge, how
  AI is changing our world, and I love good gadgets. Professionally, I code
  in JavaScript/TypeScript and Python. React, Flask, Express, PostgreSQL,
  and Node.js are my tools. I use them to build things that make sense.
  Things that are needed. Things that work. Thanks for visiting. Have a look
  around, reach out if something catches your eye. Let's build something
  great together.`,
}

/**
 * Root layout component
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={jetBrainsMono.variable}>{children}</body>
    </html>
  )
}
