import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { InvalidShortUrlFormat } from './errors/invalid-short-url-format'
import { LinkNotFound } from './errors/link-not-found'
import { isValidShortUrl, normalizeShortUrl } from './link-validation'

const deleteLinkInput = z.object({
  shortUrl: z.string(),
})

type DeleteLinkInput = z.input<typeof deleteLinkInput>

export async function deleteLink(
  input: DeleteLinkInput
): Promise<Either<InvalidShortUrlFormat | LinkNotFound, Record<string, never>>> {
  const { shortUrl } = deleteLinkInput.parse(input)
  const normalizedShortUrl = normalizeShortUrl(shortUrl)

  if (!isValidShortUrl(normalizedShortUrl)) {
    return makeLeft(new InvalidShortUrlFormat())
  }

  const [deletedLink] = await db
    .delete(schema.links)
    .where(eq(schema.links.shortUrl, normalizedShortUrl))
    .returning({ id: schema.links.id })

  if (!deletedLink) {
    return makeLeft(new LinkNotFound())
  }

  return makeRight({})
}
