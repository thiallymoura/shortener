import { api } from "./client";

export interface LinkDto {
    id: string;
    originalUrl: string;
    shortUrl: string;
    accessCount: number;
    createdAt: string;
}

interface GetLinksResponse {
    links: LinkDto[];
    total: number;
}

interface ExportLinksResponse {
    reportUrl: string;
}

interface GetOriginalUrlResponse {
    originalUrl: string;
}

export async function getLinks() {
    const response = await api.get<GetLinksResponse>("/links");

    return response.data;
}

export async function createLink(data: {
    originalUrl: string;
    shortUrl: string;
}) {
    const response = await api.post<LinkDto>("/links", data);

    return response.data;
}

export async function deleteLink(shortUrl: string) {
    await api.delete(`/links/${encodeURIComponent(shortUrl)}`);
}

export async function exportLinks() {
    const response = await api.get<ExportLinksResponse>("/links/export");

    return response.data;
}

export async function getOriginalUrl(shortUrl: string) {
    const response = await api.get<GetOriginalUrlResponse>(
        `/links/${encodeURIComponent(shortUrl)}`
    );

    return response.data;
}
