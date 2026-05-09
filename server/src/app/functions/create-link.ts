import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { z } from 'zod'
import { InvalidOriginalUrl } from './errors/invalid-original-url'
import { InvalidShortUrlFormat } from './errors/invalid-short-url-format'
import { ShortUrlAlreadyExists } from './errors/short-url-already-exists'
import { isValidOriginalUrl, isValidShortUrl, normalizeShortUrl } from './link-validation'

const createLinkInput = z.object({
  originalUrl: z.string(),
  shortUrl: z.string(),
})

type CreateLinkInput = z.input<typeof createLinkInput>

type CreateLinkOutput = {
  id: string
  originalUrl: string
  shortUrl: string
  accessCount: number
  createdAt: Date
}

export async function createLink(
  input: CreateLinkInput
): Promise<
  Either<
    InvalidOriginalUrl | InvalidShortUrlFormat | ShortUrlAlreadyExists,
    CreateLinkOutput
  >
> {
  const { originalUrl, shortUrl } = createLinkInput.parse(input)

  if (!isValidOriginalUrl(originalUrl)) {
    return makeLeft(new InvalidOriginalUrl())
  }

  const normalizedShortUrl = normalizeShortUrl(shortUrl)

  if (!isValidShortUrl(normalizedShortUrl)) {
    return makeLeft(new InvalidShortUrlFormat())
  }

  const [createdLink] = await db
    .insert(schema.links)
    .values({
      originalUrl: originalUrl.trim(),
      shortUrl: normalizedShortUrl,
    })
    .onConflictDoNothing({ target: schema.links.shortUrl })
    .returning({
      id: schema.links.id,
      originalUrl: schema.links.originalUrl,
      shortUrl: schema.links.shortUrl,
      accessCount: schema.links.accessCount,
      createdAt: schema.links.createdAt,
    })

  if (!createdLink) {
    return makeLeft(new ShortUrlAlreadyExists())
  }

  return makeRight(createdLink)
}
