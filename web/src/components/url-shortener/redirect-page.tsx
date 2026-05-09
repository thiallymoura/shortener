import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getOriginalUrl } from "../../http/links";
import { Card } from "../ui/card";
import { LoadingState } from "../ui/loading-state";

const pendingOriginalUrlRequests = new Map<
    string,
    Promise<{ originalUrl: string }>
>();

function getOriginalUrlOnce(shortUrl: string) {
    const pendingRequest = pendingOriginalUrlRequests.get(shortUrl);

    if (pendingRequest) {
        return pendingRequest;
    }

    const request = getOriginalUrl(shortUrl).finally(() => {
        pendingOriginalUrlRequests.delete(shortUrl);
    });

    pendingOriginalUrlRequests.set(shortUrl, request);

    return request;
}

interface RedirectPageProps {
    shortUrl: string;
}

export function RedirectPage({ shortUrl }: RedirectPageProps) {
    const navigate = useNavigate();

    useEffect(() => {
        let isActive = true;

        async function resolveShortUrl() {
            try {
                const { originalUrl } = await getOriginalUrlOnce(shortUrl);

                if (isActive) {
                    window.location.replace(originalUrl);
                }
            } catch {
                if (isActive) {
                    navigate("/404", { replace: true });
                }
            }
        }

        resolveShortUrl();

        return () => {
            isActive = false;
        };
    }, [navigate, shortUrl]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-200 px-4 py-8">
            <Card className="flex w-full max-w-[36.25rem] flex-col items-center gap-6 px-12 py-[5.25rem] text-center">
                <img
                    src="/redirect-logo-icon.png"
                    alt=""
                    aria-hidden="true"
                    className="h-10 w-auto"
                />

                <LoadingState
                    title="Redirecionando..."
                    description="O link será aberto automaticamente em alguns instantes."
                />
            </Card>
        </main>
    );
}
