import { deleteLink } from '@/app/functions/delete-link'
import { LinkNotFound } from '@/app/functions/errors/link-not-found'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'

describe('delete link', () => {
  it('should be able to delete a link by short URL', async () => {
    const shortUrl = `github-project-${randomUUID().slice(0, 8)}`

    const link = await makeLink({
      shortUrl,
    })

    const sut = await deleteLink({
      shortUrl: shortUrl.toUpperCase(),
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({})

    const result = await db
      .select()
      .from(schema.links)
      .where(eq(schema.links.id, link.id))

    expect(result).toHaveLength(0)
  })

  it('should return an error when deleting a missing link', async () => {
    const sut = await deleteLink({
      shortUrl: 'missing-link',
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(LinkNotFound)
  })
})
