import { randomUUID } from 'node:crypto'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import type { InferInsertModel } from 'drizzle-orm'

export async function makeLink(
  overrides?: Partial<InferInsertModel<typeof schema.links>>
) {
  const shortUrl = `link-${randomUUID().slice(0, 8)}`

  const result = await db
    .insert(schema.links)
    .values({
      originalUrl: `https://example.com/${shortUrl}`,
      shortUrl,
      ...overrides,
    })
    .returning()

  return result[0]
}
