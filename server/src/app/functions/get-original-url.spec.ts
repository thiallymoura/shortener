import { getOriginalUrl } from '@/app/functions/get-original-url'
import { LinkNotFound } from '@/app/functions/errors/link-not-found'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'

describe('get original URL', () => {
  it('should be able to resolve the original URL', async () => {
    const shortUrl = `github-project-${randomUUID().slice(0, 8)}`

    await makeLink({
      originalUrl: 'https://www.example.com/my-page',
      shortUrl,
    })

    const sut = await getOriginalUrl({
      shortUrl,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({
      originalUrl: 'https://www.example.com/my-page',
    })
  })

  it('should increment access count when resolving the original URL', async () => {
    const shortUrl = `product-${randomUUID().slice(0, 8)}`

    const link = await makeLink({
      shortUrl,
      accessCount: 0,
    })

    await getOriginalUrl({ shortUrl })
    await getOriginalUrl({ shortUrl: shortUrl.toUpperCase() })

    const [updatedLink] = await db
      .select()
      .from(schema.links)
      .where(eq(schema.links.id, link.id))

    expect(updatedLink.accessCount).toBe(2)
  })

  it('should return an error when the link does not exist', async () => {
    const sut = await getOriginalUrl({
      shortUrl: 'missing-link',
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(LinkNotFound)
  })
})
