import { Sema } from 'async-sema'
import rpc, { values } from '@lib/notion/rpc'
import { getTableData } from '@lib/notion/getTableData'
import { getPostPreview } from '@lib/notion/getPostPreview'
import { readJson, writeJson } from '@lib/fs-helpers'
import { BLOG_INDEX_ID, BLOG_INDEX_CACHE } from '@lib/server-constants'
import log from '@lib/logger';

export default async function getBlogIndex(previews = true, pageId = BLOG_INDEX_ID) {
  let postsTable: any = null
  const useCache = process.env.USE_CACHE === 'true'
  const cacheFile = `${BLOG_INDEX_CACHE}${previews ? '_previews' : ''}`

  if (useCache) {
    postsTable = await readJson(cacheFile, 'utf-8').catch(log.warn)
  }

  if (!postsTable) {
    try {
      const data = await rpc('loadPageChunk', {
        pageId,
        limit: 100, // TODO: figure out Notion's way of handling pagination
        cursor: { stack: [] },
        chunkNumber: 0,
        verticalColumns: false,
      })

      // Parse table with posts
      const tableBlock = values(data.recordMap.block).find(
        (block: any) => block.value.type === 'collection_view'
      )

      postsTable = await getTableData(tableBlock, true)
    } catch (err) {
      log.warn(`Failed to load Notion posts, have you run the create-table script?`)
      return {}
    }

    // only get 10 most recent post's previews
    const postsKeys = Object.keys(postsTable).splice(0, 10)

    const sema = new Sema(3, { capacity: postsKeys.length })

    if (previews) {
      await Promise.all(
        postsKeys
          .sort((a, b) => {
            const postA = postsTable[a]
            const postB = postsTable[b]
            const timeA = postA.Date
            const timeB = postB.Date
            return Math.sign(timeB - timeA)
          })
          .map(async (postKey) => {
            await sema.acquire()
            const post = postsTable[postKey]
            post.preview = post.id
              ? await getPostPreview(postsTable[postKey].id)
              : []
            sema.release()
          })
      )
    }

    if (useCache) {
      await writeJson(cacheFile, postsTable, 'utf8')
        .then(log.success).catch(log.warn)
    }
  }

  return postsTable
}
