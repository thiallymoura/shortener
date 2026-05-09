import { createLink } from '@/app/functions/create-link'
import { InvalidOriginalUrl } from '@/app/functions/errors/invalid-original-url'
import { InvalidShortUrlFormat } from '@/app/functions/errors/invalid-short-url-format'
import { ShortUrlAlreadyExists } from '@/app/functions/errors/short-url-already-exists'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'

describe('create link', () => {
  it('should be able to create a link', async () => {
    const shortUrl = `github-project-${randomUUID().slice(0, 8)}`

    const sut = await createLink({
      originalUrl: 'https://www.example.com/my-page',
      shortUrl,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual(
      expect.objectContaining({
        originalUrl: 'https://www.example.com/my-page',
        shortUrl,
        accessCount: 0,
      })
    )

    const result = await db
      .select()
      .from(schema.links)
      .where(eq(schema.links.shortUrl, shortUrl))

    expect(result).toHaveLength(1)
  })

  it('should not be able to create a link with an invalid original URL', async () => {
    const sut = await createLink({
      originalUrl: 'invalid-url',
      shortUrl: 'github-project',
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(InvalidOriginalUrl)
  })

  it('should not be able to create a link with an invalid short URL format', async () => {
    const sut = await createLink({
      originalUrl: 'https://www.example.com/my-page',
      shortUrl: 'meu link',
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(InvalidShortUrlFormat)
  })

  it('should not be able to create a duplicated short URL', async () => {
    const shortUrl = `github-project-${randomUUID().slice(0, 8)}`

    await createLink({
      originalUrl: 'https://www.example.com/first-page',
      shortUrl,
    })

    const sut = await createLink({
      originalUrl: 'https://www.example.com/second-page',
      shortUrl: shortUrl.toUpperCase(),
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(ShortUrlAlreadyExists)
  })
})
