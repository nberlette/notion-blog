import rpc, { values } from '@lib/notion/rpc'

export default async function getPageData(pageId: string) {
  // a *more* reasonable size limit for the largest blog post (10MB),
  // as one chunk is about 10KB. better name too ;)
  const maxChunkNumber = 1000

  try {
    var chunkNumber = 0
    var data = await loadPageChunk({ pageId, chunkNumber })
    var blocks = data.recordMap.block

    while (data.cursor.stack.length !== 0 && chunkNumber < maxChunkNumber) {
      chunkNumber = chunkNumber + 1
      data = await loadPageChunk({ pageId, chunkNumber, cursor: data.cursor })
      blocks = Object.assign(blocks, data.recordMap.block)
    }
    const blockArray = values(blocks)
    if (blockArray[0] && blockArray[0].value.content) {
      // remove table blocks
      blockArray.splice(0, 3)
    }
    return { blocks: blockArray }
  } catch (err) {
    console.error(`Failed to load pageData for ${pageId}`, err)
    return { blocks: [] }
  }
}

export function loadPageChunk({
  pageId,
  limit = 30,
  cursor = { stack: [] },
  chunkNumber = 0,
  verticalColumns = false,
}: any) {
  return rpc('loadPageChunk', {
    pageId,
    limit,
    cursor,
    chunkNumber,
    verticalColumns,
  })
}
