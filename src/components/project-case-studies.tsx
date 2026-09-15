import Image from 'next/image'
import Link from 'next/link'
import Section from './Section'
import styles from './portfolio.module.css'

export default function ProjectCaseStudies() {
  return (
    <Section title='Selected work' className={styles.workSection}>
      <article className={styles.project} aria-labelledby='theragpt-title'>
        <div className={styles.projectHeader}>
          <h2 id='theragpt-title' className={styles.projectTitle}>
            TheraGPT
          </h2>
          <span className={styles.projectMeta}>Independent project</span>
        </div>
        <p className={styles.summary}>
          TheraGPT is an AI journal for reflecting on difficult thoughts. Try it
          without an account, then save and revisit your entries.
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
        <p className={styles.stack}>Next.js, TypeScript, OpenAI, Supabase</p>
        <details className={styles.disclosure}>
          <summary>TheraGPT: engineering and product decisions</summary>
          <div className={styles.study}>
            <h4>Product problem</h4>
            <p>
              TheraGPT focuses on a specific task: write down a difficult
              thought, examine it, and consider a different perspective. The
              interface starts with a journal input and offers prompts for
              people who need help getting started.
            </p>
            <h4>Application architecture</h4>
            <p>
              The Next.js web app lives in a Turborepo monorepo. Shared packages
              separate AI integration, prompt templates, and core logic from the
              application UI. The repository also includes an Expo app in
              development.
            </p>
            <p>
              Journal history uses local storage by default, with optional
              Supabase persistence. That gives the product an account-free entry
              point while supporting saved entries for people who want cloud
              storage.
            </p>
            <h4>Adoption and engineering</h4>
            <p>
              Letting someone try the journal before signing up connects an
              onboarding decision to the storage architecture. The first session
              can focus on writing a thought and reviewing the response.
            </p>
          </div>
        </details>
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
            View TheraGPT source
          </a>
        </div>
      </article>
      <article className={styles.project} aria-labelledby='audioflare-title'>
        <div className={styles.projectHeader}>
          <h2 id='audioflare-title' className={styles.projectTitle}>
            Audioflare
          </h2>
          <span className={styles.projectMeta}>2023 experiment</span>
        </div>
        <p className={styles.summary}>
          Audioflare processes an audio file through transcription,
          summarization, sentiment analysis, and translation.
        </p>
        <Image
          src='/projects/audioflare.png'
          width={1876}
          height={974}
          alt='Audioflare interface with an audio upload area and three sample recordings'
          className={styles.preview}
          sizes='(max-width: 767px) 90vw, 590px'
        />
        <p className={styles.stack}>
          Next.js, TypeScript, Cloudflare Workers AI
        </p>
        <details className={styles.disclosure}>
          <summary>Audioflare: engineering and product decisions</summary>
          <div className={styles.study}>
            <h4>Project purpose</h4>
            <p>
              I built Audioflare while exploring Cloudflare Workers AI at Smol
              AI. It gives developers a working example they can try and inspect
              in source.
            </p>
            <h4>Processing pipeline</h4>
            <p>
              The app transcribes an audio file with Whisper. The transcript
              becomes the input for separate summarization, sentiment analysis,
              and translation tasks. It displays request timings so someone can
              compare how long each operation takes.
            </p>
            <p>
              The project uses Cloudflare AI Gateway for monitoring and
              documents the constraints of the original models, including a
              30-second audio limit and difficulty summarizing longer prompts.
            </p>
            <h4>Developer adoption</h4>
            <p>
              Sample recordings let visitors try the workflow without finding a
              file to upload. The source and documentation give them a starting
              point for building their own integration.
            </p>
            <h4>Scope</h4>
            <p>
              This was a 2023 experiment with the models available at the time.
              The repository records both the implementation and its
              limitations.
            </p>
          </div>
        </details>
        <div className={styles.links}>
          <a
            className={styles.link}
            href='https://github.com/seanoliver/audioflare'
            target='_blank'
            rel='noopener noreferrer'
          >
            View Audioflare source
          </a>
        </div>
      </article>
      <div className={styles.links}>
        <Link className={styles.link} href='/projects'>
          All projects
        </Link>
      </div>
    </Section>
  )
}
