/* eslint-disable @next/next/no-img-element */
import Header from '@components/header'
import ExtLink from '@components/ext-link'
import Features from '@components/features'
import sharedStyles from './shared.module.css'

export default function Index() {
  return (
    <>
      <Header titlePre="Home" />
      <div className={sharedStyles.layout}>
        <h1>My Notion Blog</h1>
        <h2>
          Blazing Fast Notion Blog with Next.js{"' "}
          <ExtLink
            href="https://github.com/vercel/next.js/issues/9524"
            className="dotted"
            style={{ color: 'inherit' }}
          >
            SSG
          </ExtLink>
        </h2>

        <p>
          <img
            src="/vercel-and-notion.png"
            height="170"
            width="500"
            alt="Vercel + Notion"
          />
        </p>


        <div className="explanation">
          <p>
            This is a statically generated{' '}
            <ExtLink href="https://nextjs.org">Next.js</ExtLink> site with a{' '}
            <ExtLink href="https://notion.so">Notion</ExtLink> powered blog that
            is deployed with <ExtLink href="https://vercel.com">Vercel</ExtLink>
            . It leverages some upcoming features in Next.js like{' '}
            <ExtLink href="https://github.com/vercel/next.js/issues/9524">
              SSG support
            </ExtLink>{' '}
            and{' '}
            <ExtLink href="https://github.com/vercel/next.js/issues/8626">
              built-in CSS support
            </ExtLink>{' '}
            which allow us to achieve all of the benefits listed above including
            blazing fast speeds, great local editing experience, and always
            being available!
          </p>
        </div>
        
        <Features />
        
        <div className="explanation">
          <p>
            Get started by creating a new page in Notion and clicking the deploy
            button below. After you supply your token and the blog index id (the
            page{"'"}s id in Notion) we will automatically create the table for you!
            See{' '}
            <ExtLink href="https://github.com/ijjk/notion-blog#getting-blog-index-and-token">
              here in the readme
            </ExtLink>{' '}
            for finding the new page{"'"}s id. To get your token from Notion, login
            and look for a cookie under www.notion.so with the name `token_v2`.
            After finding your token and your blog{"'"}s page id you should be good
            to go!
          </p>
        </div>
      </div>
      <footer style={{ margin: '2em 0' }}>
        <ExtLink href="https://vercel.com/new/git/external?repository-url=https://github.com/nberlette/notion-blog/tree/main&project-name=notion-blog&repository-name=notion-blog">
          <img
            src="https://vercel.com/button"
            width={200}
            alt="Deploy to Vercel button"
          />
        </ExtLink>
        <span>
          {' '}
          <ExtLink href="https://github.com/nberlette/notion-blog">
            View Source on GitHub
          </ExtLink>
        </span>
      </footer>
    </>
  )
}
