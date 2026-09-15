import { SOCIAL_LINKS } from '@/lib/constants'
import styles from './portfolio.module.css'

export default function PortfolioIntro() {
  return (
    <section className={styles.intro} aria-labelledby='portfolio-heading'>
      <p className={styles.name}>Sean Oliver</p>
      <h1 id='portfolio-heading' className={styles.headline}>
        I build software and help it grow.
      </h1>
      <p className={styles.description}>
        I’m a software engineer at Supabase. My background in growth and product
        marketing informs the problems I choose and the products I build.
      </p>
      <p className={styles.current}>
        Previously engineering at Gamma and Smol AI. Growth and marketing at
        Microsoft, LinkedIn, Lyft, and Block.
      </p>
      <div className={styles.links}>
        {SOCIAL_LINKS.slice(0, 3).map((link) => (
          <a
            key={link.name}
            href={link.url}
            className={styles.link}
            target='_blank'
            rel='noopener noreferrer'
          >
            {link.name}
          </a>
        ))}
      </div>
    </section>
  )
}
