import { NextApiRequest, NextApiResponse } from 'next';
import log from '@lib/logger';

export function setHeaders(req: NextApiRequest, res: NextApiResponse): boolean {
  // set SPR/CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader('Access-Control-Allow-Headers', 'pragma')

  if (req.method === 'OPTIONS') {
    res.status(200)
    res.end()
    return true
  }
  return false
}

export async function handleData(res: NextApiResponse, data: any) {
  data = data || { status: 'error', message: 'unhandled request' }
  res.status(data.status !== 'error' ? 200 : 500)
  res.json(data)
}

export function handleError(res: NextApiResponse, error: string | Error) {
  log.error(error)
  res.status(500).json({
    status: 'error',
    message: 'an error occurred processing request',
  })
}

export { default as logger } from './logger';

export function toJson(data: any, space?: string | number): string {
  try {
    return JSON.stringify(data, (k: string, v: any) => {
      if (['undefined', 'function'].includes(typeof (v))) return;
      return v;
    }, space)
  } catch {
    return data.toString();
  }
}

export function fromJson(text: string, reviver?: any): any {
  try {
    return JSON.parse(text, reviver)
  } catch {
    return {}
  }
}