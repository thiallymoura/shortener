import { randomUUID } from 'node:crypto'
import { getLinks } from '@/app/functions/get-links'
import { isRight, unwrapEither } from '@/infra/shared/either'
import { makeLink } from '@/test/factories/make-link'
import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'

describe('get links', () => {
  it('should be able to get the links', async () => {
    const searchQuery = randomUUID()

    const link1 = await makeLink({ shortUrl: `${searchQuery}-1` })
    const link2 = await makeLink({ shortUrl: `${searchQuery}-2` })
    const link3 = await makeLink({ shortUrl: `${searchQuery}-3` })
    const link4 = await makeLink({ shortUrl: `${searchQuery}-4` })
    const link5 = await makeLink({ shortUrl: `${searchQuery}-5` })

    const sut = await getLinks({ searchQuery })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link5.id }),
      expect.objectContaining({ id: link4.id }),
      expect.objectContaining({ id: link3.id }),
      expect.objectContaining({ id: link2.id }),
      expect.objectContaining({ id: link1.id }),
    ])
  })

  it('should be able to get paginated links', async () => {
    const searchQuery = randomUUID()

    const link1 = await makeLink({ shortUrl: `${searchQuery}-1` })
    const link2 = await makeLink({ shortUrl: `${searchQuery}-2` })
    const link3 = await makeLink({ shortUrl: `${searchQuery}-3` })
    const link4 = await makeLink({ shortUrl: `${searchQuery}-4` })
    const link5 = await makeLink({ shortUrl: `${searchQuery}-5` })

    let sut = await getLinks({
      searchQuery,
      page: 1,
      pageSize: 3,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link5.id }),
      expect.objectContaining({ id: link4.id }),
      expect.objectContaining({ id: link3.id }),
    ])

    sut = await getLinks({
      searchQuery,
      page: 2,
      pageSize: 3,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link2.id }),
      expect.objectContaining({ id: link1.id }),
    ])
  })

  it('should be able to get sorted links', async () => {
    const searchQuery = randomUUID()

    const link1 = await makeLink({
      shortUrl: `${searchQuery}-1`,
      createdAt: new Date(),
    })

    const link2 = await makeLink({
      shortUrl: `${searchQuery}-2`,
      createdAt: dayjs().subtract(1, 'day').toDate(),
    })

    const link3 = await makeLink({
      shortUrl: `${searchQuery}-3`,
      createdAt: dayjs().subtract(2, 'day').toDate(),
    })

    const link4 = await makeLink({
      shortUrl: `${searchQuery}-4`,
      createdAt: dayjs().subtract(3, 'day').toDate(),
    })

    const link5 = await makeLink({
      shortUrl: `${searchQuery}-5`,
      createdAt: dayjs().subtract(4, 'day').toDate(),
    })

    let sut = await getLinks({
      searchQuery,
      sortBy: 'createdAt',
      sortDirection: 'desc',
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link1.id }),
      expect.objectContaining({ id: link2.id }),
      expect.objectContaining({ id: link3.id }),
      expect.objectContaining({ id: link4.id }),
      expect.objectContaining({ id: link5.id }),
    ])

    sut = await getLinks({
      searchQuery,
      sortBy: 'createdAt',
      sortDirection: 'asc',
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link5.id }),
      expect.objectContaining({ id: link4.id }),
      expect.objectContaining({ id: link3.id }),
      expect.objectContaining({ id: link2.id }),
      expect.objectContaining({ id: link1.id }),
    ])
  })
})
