import Image from 'next/image'
import Section from './Section'
import styles from './portfolio.module.css'

export default function FeaturedProject() {
  return (
    <Section title='Selected work' className={styles.workSection}>
      <article aria-labelledby='theragpt-title'>
        <div className={styles.projectHeader}>
          <h2 id='theragpt-title' className={styles.projectTitle}>
            TheraGPT
          </h2>
          <span className={styles.projectMeta}>Independent project</span>
        </div>
        <p className={styles.summary}>
          TheraGPT is an AI journal for reflecting on difficult thoughts.
        </p>
        <Image
          src='/projects/theragpt-new.png'
          loading='eager'
          width={1492}
          height={639}
          alt='TheraGPT interface with a journal input and an Analyze Thought action'
          className={styles.preview}
          sizes='(max-width: 767px) 90vw, 590px'
        />
        <dl className={styles.facts}>
          <div className={styles.fact}>
            <dt>Problem</dt>
            <dd>
              Make it easier to write down a difficult thought and consider
              another perspective.
            </dd>
          </div>
          <div className={styles.fact}>
            <dt>Engineering</dt>
            <dd>
              The Next.js app uses shared packages for prompts and AI logic.
              Journal entries can stay on the device, with optional Supabase
              storage.
            </dd>
          </div>
          <div className={styles.fact}>
            <dt>Product</dt>
            <dd>
              People can try the journal without creating an account. Suggested
              prompts help them start writing.
            </dd>
          </div>
        </dl>
        <div className={styles.links}>
          <a
            className={styles.link}
            href='https://theragpt.ai/'
            target='_blank'
            rel='noopener noreferrer'
          >
            Visit TheraGPT
          </a>
          <a
            className={styles.link}
            href='https://github.com/seanoliver/theragpt-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            View source
          </a>
        </div>
      </article>
    </Section>
  )
}
