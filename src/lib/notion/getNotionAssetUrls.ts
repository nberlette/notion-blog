import rpc from '@lib/notion/rpc'
import { NextApiResponse } from 'next'

export default async function getNotionAsset(
  res: NextApiResponse,
  assetUrl: string,
  blockId: string
): Promise<{
  signedUrls: string[]
}> {
  return await rpc('getSignedFileUrls', {
      urls: [
        {
          url: assetUrl,
          permissionRecord: {
            table: 'block',
            id: blockId,
          },
        },
      ],
  })
}
