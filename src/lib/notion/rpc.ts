import fetch, { Response } from "node-fetch";
import { API_ENDPOINT, BLOG_INDEX_ID, NOTION_TOKEN } from "@lib/server-constants";
import { toJson, fromJson } from "@lib/utils";
import logger from "@lib/logger";
import { v4 as uuid } from "uuid";

export default async function rpc(fnName: string, body: any) {
  if (!NOTION_TOKEN) {
    throw new Error("NOTION_TOKEN is not set in env");
  }
  const res = await fetch(`${API_ENDPOINT}/${fnName}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: `token_v2=${NOTION_TOKEN}`,
    },
    body: toJson(body),
  });

  if (res.ok) {
    return res.json();
  } else {
    throw new Error(await getError(res));
  }
}

export async function getError(res: Response) {
  return `Notion API error (${res.status}) \n${getJSONHeaders(res)}\n ${await getBodyOrNull(res)}`;
}

export function getJSONHeaders(res: Response) {
  return JSON.stringify(res.headers.raw());
}

export function getBodyOrNull(res: Response) {
  try {
    return res.text();
  } catch (err) {
    return null;
  }
}

export function values(obj: any) {
  const vals: any = [];

  Object.keys(obj).forEach(key => {
    vals.push(obj[key]);
  });
  return vals;
}

export async function getExistingBlockId(pageId = BLOG_INDEX_ID, limit = 25) {
  const data = await rpc("loadPageChunk", {
    pageId,
    limit,
    cursor: { stack: [] },
    chunkNumber: 0,
    verticalColumns: false,
  });

  if (!data) {
    throw logger.error("failed to retrieve block id from notion");
  }
  const id = Object.keys(data ? data.recordMap.block : {}).find(id => id !== pageId);
  return id || uuid();
}

export async function getUserId() {
  const data = await rpc("loadUserContent", {});

  if (!data) {
    throw logger.error("failed to retrieve user id from notion");
  }
  return Object.keys(data.recordMap.notion_user)[0];
}
