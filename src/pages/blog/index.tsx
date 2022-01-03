import Link from 'next/link'
import Image from 'next/image'
import Header from '@components/header'

import blogStyles from './blog.module.css'
import sharedStyles from '../shared.module.css'

import {
  getBlogLink,
  getDateStr,
  postIsPublished,
} from '@lib/blog-helpers';

import { textBlock } from '@lib/notion/renderers'
import getNotionUsers from '@lib/notion/getNotionUsers'
import getBlogIndex from '@lib/notion/getBlogIndex'

export async function getStaticProps({ preview }) {
  const postsTable = await getBlogIndex()

  const authorsList: Set<string> = new Set()
  const posts: any[] = Object.entries(postsTable)
    .map(([slug, post]: [string, any]) => {
      // remove draft posts in production
      if (!preview && !postIsPublished(post)) {
        return null
      }
      post.Authors = (post.Authors || []).map((author: string) => (authorsList.add(author), author))
      
      return post || null
    })
    .filter(Boolean)

  const { users } = await getNotionUsers([...authorsList])
  posts.map((post) => {
    post.Authors = users[post.Authors] || null;
  })

  return {
    props: {
      preview: preview || false,
      posts,
    },
    revalidate: 10,
  }
}

const Index = ({ posts = [], preview }) => {
  return (
    <>
      <Header titlePre="Blog" />
      {preview && (
        <div className={blogStyles.previewAlertContainer}>
          <div className={blogStyles.previewAlert}>
            <strong>Note</strong>
            {` `}Viewing in preview mode{' '}
            <Link href={`/api/clear-preview`} passHref>
              <button className={blogStyles.escapePreview}>Exit Preview</button>
            </Link>
          </div>
        </div>
      )}
      <div className={`${sharedStyles.layout} ${blogStyles.blogIndex}`}>
        <h1>My Notion Blog</h1>
        {posts.length === 0 && (
          <p className={blogStyles.noPosts}>There are no posts yet</p>
        )}
        {posts.map((post) => {
          return (
            <div className={blogStyles.postPreview} key={post.Slug}>
              <h3>
                <span className={blogStyles.titleContainer}>
                  {!post.Published && (
                    <span className={blogStyles.draftBadge}>Draft</span>
                  )}
                  <Link href="/blog/[slug]" as={getBlogLink(post.Slug)}>
                    <a>{post.Page}</a>
                  </Link>
                </span>
              </h3>
              {post.Date && (
                <div className="posted" style={{ margin: '0.8em auto', width: 'auto' }}>
                  <time itemProp="created_time">{getDateStr(post.Date)}</time>
                </div>
              )}
              <p>
                {(!post.preview || post.preview.length === 0) &&
                  'No preview available'}
                {(post.preview || []).slice(0, 3).map((block, idx) =>
                  textBlock(block, false, `${post.Slug}${idx}`)
                )}
              </p>
              <div className="authors" style={{ display: 'grid', marginBottom: '1em' }}>
                {post.Authors?.name && (
                    <div className={blogStyles.author} style={{ display: 'flex', flex: '0 1 auto', gap: '1rem', marginBottom: '1em' }}>
                      {post.Authors.photo && (
                        <Image src={post.Authors.photo} alt={post.Authors.name + "'s photo"} className="profile-photo" />
                      )}
                      <span itemProp="author" className="author-name">
                        {post.Authors.name || post.Authors.full_name}
                      </span>
                      <style jsx>{`
                        img.profile-photo {
                          width: 48px;
                          border-radius: 10em;
                          margin: 0;
                          display: flex;
                        }
                        .author-name {
                          font-size: 1.2em
                          display: flex;
                          margin: 0.5em 0 0 0;
                        }
                      `}</style>
                  </div>
              )}
                </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Index
