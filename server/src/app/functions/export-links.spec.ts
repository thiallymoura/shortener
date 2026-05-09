import { randomUUID } from 'node:crypto'
import { exportLinks } from '@/app/functions/export-links'
import * as upload from '@/infra/storage/upload-file-to-storage'
import { isRight, unwrapEither } from '@/infra/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { describe, expect, it, vi } from 'vitest'

describe('export links', () => {
  it('should be able to export links', async () => {
    const uploadStub = vi
      .spyOn(upload, 'uploadFileToStorage')
      .mockImplementationOnce(async () => {
        return {
          key: `${randomUUID()}.csv`,
          url: 'http://example.com/file.csv',
        }
      })

    const searchQuery = randomUUID()

    const link1 = await makeLink({ shortUrl: `${searchQuery}-1` })
    const link2 = await makeLink({ shortUrl: `${searchQuery}-2` })
    const link3 = await makeLink({ shortUrl: `${searchQuery}-3` })
    const link4 = await makeLink({ shortUrl: `${searchQuery}-4` })
    const link5 = await makeLink({ shortUrl: `${searchQuery}-5` })

    const sut = await exportLinks({
      searchQuery,
    })

    const generatedCSVStream = uploadStub.mock.calls[0][0].contentStream
    const fileName = uploadStub.mock.calls[0][0].fileName
    const csvAsString = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = []

      generatedCSVStream.on('data', (chunk: Buffer) => {
        chunks.push(chunk)
      })

      generatedCSVStream.on('end', () => {
        resolve(Buffer.concat(chunks).toString('utf-8'))
      })

      generatedCSVStream.on('error', err => {
        reject(err)
      })
    })

    expect(csvAsString.startsWith('\uFEFF')).toBe(true)

    const csvAsArray = csvAsString
      .slice(1)
      .trim()
      .split('\r\n')
      .map(row => row.split(';'))

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).reportUrl).toBe('http://example.com/file.csv')
    expect(fileName).toMatch(
      /^links-\d+-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.csv$/
    )
    expect(csvAsArray).toEqual([
      ['ID', 'Original URL', 'Short URL', 'Access Count', 'Created At'],
      [link1.id, link1.originalUrl, link1.shortUrl, String(link1.accessCount), expect.any(String)],
      [link2.id, link2.originalUrl, link2.shortUrl, String(link2.accessCount), expect.any(String)],
      [link3.id, link3.originalUrl, link3.shortUrl, String(link3.accessCount), expect.any(String)],
      [link4.id, link4.originalUrl, link4.shortUrl, String(link4.accessCount), expect.any(String)],
      [link5.id, link5.originalUrl, link5.shortUrl, String(link5.accessCount), expect.any(String)],
    ])
  })
})
