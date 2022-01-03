import { values } from '@lib/notion/rpc'
import Slugger from 'github-slugger'
import queryCollection from '@lib/notion/queryCollection'
import { normalizeSlug } from '@lib/blog-helpers'
import log from '@lib/logger'

export async function getTableData(collectionBlock: any, isPosts = false) {
  const locale = process.env.LOCALE || 'en-US';
  const slugger = new Slugger()

  const { value } = collectionBlock
  let table: any = {}
  const col = await queryCollection({
    collectionId: value.collection_id,
    collectionViewId: value.view_ids[0],
  })
  const entries = values(col.recordMap.block)
    .filter((block: any) =>
      block.value && (block.value.parent_id === value.collection_id)
    )

  const colId = Object.keys(col.recordMap.collection)[0]
  const schema = col.recordMap.collection[colId].value.schema
  const schemaKeys = Object.keys(schema)

  for (const entry of entries) {
    const { id, properties: props, format = {}, created_time, last_edited_time } = entry.value;
    if (!props) continue;
    const row: any = { id, format: format || {}, created_time: created_time || null, last_edited_time: last_edited_time || null };

    schemaKeys.forEach(key => {
      // might be undefined
      let val = props[key] && props[key][0][0]

      // authors and blocks are centralized
      if (val && props[key][0][1]) {
        const type: any = props[key][0][1][0]

        switch (type[0]) {
          // anchor (link)
          case 'a':
            val = type[1];
            break;
          // user
          case 'u':
            val = props[key]
              .filter((arr: any[]) => arr.length > 1)
              .map((arr: any[]) => arr[1][0][1])
            break;
          // page (block)
          case 'p':
            const page = col.recordMap.block[type[1]];
            row.id = page.value.id;
            if (!row.id) break;
            val = page.value.properties.title[0][0];
            break;
          // date
          case 'd':
            let { start_date, start_time, time_zone: timeZone } = type[1];
            if (!start_date) break;

            val = Date.parse(
              new Date(start_date+' '+start_time)
                .toLocaleString(locale, { timeZone })
            );
            break;
          // otherwise...
          default:
            log.warn('unknown type', type[0], type)
          break;
        }
      }

      if (typeof (val) === 'string') {
        val = val.trim()
      }
      row[schema[key].name] = val || null
    })

    // auto-generate slug from title
    let key: string = row.Slug = normalizeSlug(row.Slug || slugger.slug(row.Page || ''))
    if (isPosts && !key) continue;

    if (key) {
      table[key] = row;
    } else {
      if (!Array.isArray(table)) table = []
      table.push(row)
    }
  }
  return table
}

export default getTableData;