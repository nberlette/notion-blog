import rpc from '@lib/notion/rpc'

export default async function getNotionUsers(ids: string[]) {
  const { results = [] } = await rpc('getRecordValues', {
    requests: ids.map((id: string) => ({ id, table: 'notion_user' })),
  })

  const users: any = {}

  for (const result of results) {
    const {
      id,
      name,
      family_name,
      profile_photo: photo,
      email
    } = result.value;

    let full_name = name;
    if (family_name) {
      full_name += ` ${family_name}`;
    }
    users[id] = { uuid: id, name, full_name, photo, email }
  }

  return {
    users
  }
}
