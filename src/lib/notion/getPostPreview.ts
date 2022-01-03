import { loadPageChunk } from '@lib/notion/getPageData'
import { values } from '@lib/notion/rpc'

const nonPreviewTypes = new Set(['editor', 'page', 'collection_view'])

export async function getPostPreview (pageId: string) {
  const data = await loadPageChunk({ pageId, limit: 10 })
  let blocks: any[] = values(data.recordMap.block)
  const dividerIndex = blocks.indexOf((block: any) => block.value.type === 'divider')

  blocks = (dividerIndex > -1 ? blocks.slice(0, dividerIndex) : blocks)
  return blocks
      .filter(({ value }) => !nonPreviewTypes.has(value.type) && value.properties)
      .map((block: any) => block.value.properties.title)
      .filter(value => typeof (value) !== 'undefined')
}
