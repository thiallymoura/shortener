import { z } from 'zod'

const originalUrlSchema = z.string().trim().url()
const shortUrlPattern = /^[a-z0-9-]{3,50}$/

export function normalizeShortUrl(shortUrl: string) {
  return shortUrl.trim().toLowerCase()
}

export function isValidOriginalUrl(originalUrl: string) {
  return originalUrlSchema.safeParse(originalUrl).success
}

export function isValidShortUrl(shortUrl: string) {
  return shortUrlPattern.test(normalizeShortUrl(shortUrl))
}
