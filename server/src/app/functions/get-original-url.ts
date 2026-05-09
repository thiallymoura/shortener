import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { InvalidShortUrlFormat } from './errors/invalid-short-url-format'
import { LinkNotFound } from './errors/link-not-found'
import { isValidShortUrl, normalizeShortUrl } from './link-validation'

const getOriginalUrlInput = z.object({
  shortUrl: z.string(),
})

type GetOriginalUrlInput = z.input<typeof getOriginalUrlInput>

type GetOriginalUrlOutput = {
  originalUrl: string
}

export async function getOriginalUrl(
  input: GetOriginalUrlInput
): Promise<Either<InvalidShortUrlFormat | LinkNotFound, GetOriginalUrlOutput>> {
  const { shortUrl } = getOriginalUrlInput.parse(input)
  const normalizedShortUrl = normalizeShortUrl(shortUrl)

  if (!isValidShortUrl(normalizedShortUrl)) {
    return makeLeft(new InvalidShortUrlFormat())
  }

  const [link] = await db
    .update(schema.links)
    .set({
      accessCount: sql`${schema.links.accessCount} + 1`,
    })
    .where(eq(schema.links.shortUrl, normalizedShortUrl))
    .returning({
      originalUrl: schema.links.originalUrl,
    })

  if (!link) {
    return makeLeft(new LinkNotFound())
  }

  return makeRight(link)
}
