import { SOCIAL_LINKS } from '@/lib/constants'
import styles from './portfolio.module.css'

export default function PortfolioIntro() {
  return (
    <section className={styles.intro} aria-labelledby='portfolio-heading'>
      <p className={styles.name}>Sean Oliver</p>
      <h1 id='portfolio-heading' className={styles.headline}>
        Software engineer with a background in growth.
      </h1>
      <p className={styles.description}>
        I build products from the first idea through launch and iteration. My
        experience in engineering and marketing shapes how I choose problems,
        build solutions, and help people discover them.
      </p>
      <p className={styles.current}>
        Growth Engineer at Supabase. Previously engineering at Gamma and Smol
        AI.
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
