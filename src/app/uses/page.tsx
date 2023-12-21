'use client'

import Section from '@/components/Section'

const myApps = [
  'VSCode',
  'Arc',
  'Raycast',
  '1Password',
  'Warp',
  'Spark',
  'Typefully',
  'Notion',
  'Slack',
  'Figma',
  'Discord',
]

const myGear = [
  'MacBook Pro M1 Max 16',
  'iPhone 14 Pro Max',
  'Apple Watch Series 7',
  'Apple AirPods Pro',
]

const myAI = [
  'Smol Menubar',
  'Chat GPT',
  'Claude 2',
  'Bing',
  'Phind',
  'Perplexity',
  'GitHub Copilot',
  'MidJourney',
  'Typefully Vesper AI',
  'chadCommit',
  'Tana',
]

const myDevTools = [
  'Insomnia',
  'Supabase',
  'Vercel',
  'Next.js',
  'Warp',
  'VS Code',
  'Raycast',
  'TailwindCSS',
  'TypeScript',
]

function ListItem(item: string): JSX.Element {
  return <li className='leading-7'>{item}</li>
}

export default function Home(): JSX.Element {
  return (
    <>
      <Section title='Home'>
        <h4 className='font-medium'>Uses</h4>
        <p className='text-muted-foreground'>
          I have an additiction and her name is &quot;gear.&quot;
        </p>
      </Section>
      <Section title='Apps'>
        <ul>{myApps.map((i) => ListItem(i))}</ul>
      </Section>
      <Section title='Gear'>
        <ul>{myGear.map((i) => ListItem(i))}</ul>
      </Section>
      <Section title='AI Tools'>
        <ul>{myAI.map((i) => ListItem(i))}</ul>
      </Section>
      <Section title='Dev Tools'>
        <ul>{myDevTools.map((i) => ListItem(i))}</ul>
      </Section>
    </>
  )
}
