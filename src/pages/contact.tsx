import Header from '@components/header'
import ExtLink from '@components/ext-link'
import Image from 'next/image'
import sharedStyles from './shared.module.css'
import contactStyles from './contact.module.css'
import { GitHub, Twitter, Envelope, Unsplash } from '@components/svgs';

const contacts = [
  {
    Comp: Envelope,
    alt: 'Email',
    link: 'mailto:nick@berlette.com?subject=Next.js+Notion+Blog',
  },
  {
    Comp: GitHub,
    alt: 'GitHub',
    link: 'https://github.com/nberlette',
  },
  {
    Comp: Twitter,
    alt: 'Twitter',
    link: 'https://twitter.com/nberlette',
  },
  {
    Comp: Unsplash,
    alt: 'Unsplash',
    link: 'https://unsplash.com/@nberlette',
  }
]

export default function Contact() {
  return (
    <>
      <Header titlePre="Contact" />
      <div className={sharedStyles.layout}>
        <div className={contactStyles.avatar}>
          <Image src="https://github.com/nberlette.png" alt="@nberlette's github avatar" height={96}
            className="avatar-image" />
          <style jsx>{`.avatar-image { border-radius: 10em }`}</style>
        </div>

        <h1 style={{ margin: '1em 0 0.3em 0' }}>Nicholas Berlette</h1>

        <div className={contactStyles.name} style={{ marginBottom: '5em' }}>
          Full-stack Developer
        </div>

        <div className={contactStyles.links}>
          {contacts.map(({ Comp, link, alt }) => {
            return (
              <ExtLink key={link} href={link} aria-label={alt}>
                <Comp height={48} />
              </ExtLink>
            )
          })}
        </div>
      </div>
    </>
  )
}
