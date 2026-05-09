import { AxiosError } from "axios";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type FormEvent,
} from "react";

import { Download } from "lucide-react";

import { env } from "../../env";
import {
    createLink,
    deleteLink,
    exportLinks,
    getLinks,
    type LinkDto,
} from "../../http/links";
import { downloadUrl } from "../../utils/download-url";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { EmptyState } from "../ui/empty-state";
import { Input } from "../ui/input";
import { LoadingState } from "../ui/loading-state";
import { Toast } from "../ui/toast";
import { DeleteLinkConfirmationModal } from "./delete-link-confirmation-modal";
import { LinkListItem } from "./link-list-item";
import type { SavedLink } from "./link-view-model";
import { UrlShortenerLogo } from "./logo";

const frontendBaseUrl = env.frontendUrl || "https://brev.ly";
const displayedShortLinkPrefix = "brev.ly";

function formatDisplayDate(value: string) {
    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
    }).format(parsedDate);
}

function formatShortLink(shortUrl: string) {
    return `${frontendBaseUrl}/${shortUrl}`;
}

function mapLinkToViewModel(link: LinkDto): SavedLink {
    return {
        ...link,
        shortCode: link.shortUrl,
        shortUrl: formatShortLink(link.shortUrl),
        createdAt: formatDisplayDate(link.createdAt),
    };
}

function getErrorMessage(error: unknown, fallbackMessage: string) {
    if (error instanceof AxiosError) {
        return error.response?.data?.message || fallbackMessage;
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return fallbackMessage;
}

type ToastState = {
    message: string;
    type: "success" | "error" | "info";
};

type ValidationFeedback = {
    field: "originalUrl" | "shortUrl";
    message: string;
};

function getValidationFeedback(error: unknown): ValidationFeedback | null {
    if (!(error instanceof AxiosError)) {
        return null;
    }

    const message = error.response?.data?.message;
    const status = error.response?.status;

    if (
        typeof message === "string" &&
        message &&
        (status === 400 || status === 422)
    ) {
        if (message.toLowerCase().includes("original")) {
            return {
                field: "originalUrl",
                message,
            };
        }

        return {
            field: "shortUrl",
            message,
        };
    }

    return null;
}

export function HomePage() {
    const [savedLinks, setSavedLinks] = useState<SavedLink[]>([]);
    const [originalUrl, setOriginalUrl] = useState("");
    const [shortLinkSuffix, setShortLinkSuffix] = useState("");
    const [originalUrlError, setOriginalUrlError] = useState<string | null>(null);
    const [shortLinkError, setShortLinkError] = useState<string | null>(null);
    const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
    const [isExportingCsv, setIsExportingCsv] = useState(false);
    const [isLoadingLinks, setIsLoadingLinks] = useState(true);
    const [isCreatingLink, setIsCreatingLink] = useState(false);
    const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);
    const [linkToDelete, setLinkToDelete] = useState<SavedLink | null>(null);
    const [toast, setToast] = useState<ToastState | null>(null);
    const isEmpty = savedLinks.length === 0;
    const isBusy = isCreatingLink || isExportingCsv || Boolean(deletingLinkId);
    const originalUrlInputRef = useRef<HTMLInputElement>(null);
    const shortLinkInputRef = useRef<HTMLInputElement>(null);
    const lastRevalidationAtRef = useRef(0);

    const loadLinks = useCallback(async (showLoadingState = true) => {
        try {
            if (showLoadingState) {
                setIsLoadingLinks(true);
            }

            const response = await getLinks();

            setSavedLinks(response.links.map(mapLinkToViewModel));
        } catch (error) {
            setToast({
                type: "error",
                message: getErrorMessage(
                    error,
                    "Não foi possível carregar os links."
                ),
            });
        } finally {
            if (showLoadingState) {
                setIsLoadingLinks(false);
            }
        }
    }, []);

    useEffect(() => {
        loadLinks();
    }, [loadLinks]);

    useEffect(() => {
        function revalidateLinks() {
            const now = Date.now();

            if (now - lastRevalidationAtRef.current < 300) {
                return;
            }

            lastRevalidationAtRef.current = now;
            void loadLinks(false);
        }

        function handleVisibilityChange() {
            if (document.visibilityState === "visible") {
                revalidateLinks();
            }
        }

        window.addEventListener("focus", revalidateLinks);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.removeEventListener("focus", revalidateLinks);
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, [loadLinks]);

    useEffect(() => {
        if (!copiedLinkId) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setCopiedLinkId(null);
        }, 2000);

        return () => window.clearTimeout(timeoutId);
    }, [copiedLinkId]);

    useEffect(() => {
        if (!toast) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setToast(null);
        }, 3000);

        return () => window.clearTimeout(timeoutId);
    }, [toast]);

    function handleShortLinkChange(value: string) {
        if (shortLinkError) {
            setShortLinkError(null);
        }

        setShortLinkSuffix(value);
    }

    function handleOriginalUrlChange(value: string) {
        if (originalUrlError) {
            setOriginalUrlError(null);
        }

        setOriginalUrl(value);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedOriginalUrl = originalUrl.trim();
        const trimmedShortLink = shortLinkSuffix.trim();

        if (!trimmedOriginalUrl || !trimmedShortLink) {
            return;
        }

        try {
            setIsCreatingLink(true);
            setToast(null);
            setOriginalUrlError(null);
            setShortLinkError(null);

            const createdLink = await createLink({
                originalUrl: trimmedOriginalUrl,
                shortUrl: trimmedShortLink,
            });

            setSavedLinks((currentLinks) => [
                mapLinkToViewModel(createdLink),
                ...currentLinks,
            ]);
            setOriginalUrl("");
            setShortLinkSuffix("");
            setToast({
                type: "success",
                message: "Link salvo com sucesso.",
            });
        } catch (error) {
            const validationFeedback = getValidationFeedback(error);

            if (validationFeedback) {
                if (validationFeedback.field === "originalUrl") {
                    setOriginalUrlError(validationFeedback.message);
                    originalUrlInputRef.current?.focus();
                    return;
                }

                setShortLinkError(validationFeedback.message);
                shortLinkInputRef.current?.focus();
                return;
            }

            setToast({
                type: "error",
                message: getErrorMessage(error, "Não foi possível salvar o link."),
            });
        } finally {
            setIsCreatingLink(false);
        }
    }

    async function handleCopyLink(link: SavedLink) {
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(link.shortUrl);
            } else {
                console.log("Copiar link:", link.shortUrl);
            }
        } catch {
            console.log("Copiar link:", link.shortUrl);
        }

        setCopiedLinkId(link.id);
    }

    async function handleDeleteLink(link: SavedLink) {
        try {
            setDeletingLinkId(link.id);
            setToast(null);

            await deleteLink(link.shortCode);
            setSavedLinks((currentLinks) =>
                currentLinks.filter((currentLink) => currentLink.id !== link.id)
            );
            setLinkToDelete(null);
            setToast({
                type: "success",
                message: "Link removido com sucesso.",
            });
        } catch (error) {
            setToast({
                type: "error",
                message: getErrorMessage(error, "Não foi possivel remover o link."),
            });
        } finally {
            setDeletingLinkId(null);
        }
    }

    async function handleExportCsv() {
        if (isEmpty) {
            return;
        }

        try {
            setIsExportingCsv(true);
            setToast(null);

            const { reportUrl } = await exportLinks();

            await downloadUrl(reportUrl);
            setToast({
                type: "success",
                message: "CSV gerado com sucesso.",
            });
        } catch (error) {
            setToast({
                type: "error",
                message: getErrorMessage(
                    error,
                    "Não foi possível exportar o CSV."
                ),
            });
        } finally {
            setIsExportingCsv(false);
        }
    }

    const isSubmitDisabled =
        originalUrl.trim().length === 0 ||
        shortLinkSuffix.trim().length === 0 ||
        isBusy;

    return (
        <>
            <main className="min-h-screen bg-gray-200 px-4 py-8 md:px-6 md:py-12">
                <div className="mx-auto flex w-full max-w-[920px] flex-col gap-6 md:gap-7">
                    <header className="flex items-center justify-center md:justify-start">
                        <UrlShortenerLogo />
                    </header>

                    <section className="grid gap-4 md:gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
                        <Card className="space-y-6 px-5 py-4 md:px-5 md:py-4">
                            <h1 className="text-[18px] font-bold leading-8 text-gray-600">
                                Novo link
                            </h1>

                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <label className="block space-y-2">
                                    <span className="text-[10px] font-normal uppercase  text-gray-500">
                                        Link original
                                    </span>
                                    <Input
                                        aria-describedby={
                                            originalUrlError
                                                ? "original-url-error"
                                                : undefined
                                        }
                                        aria-invalid={Boolean(originalUrlError)}
                                        placeholder="www.exemplo.com.br"
                                        error={Boolean(originalUrlError)}
                                        ref={originalUrlInputRef}
                                        value={originalUrl}
                                        disabled={isBusy}
                                        onChange={(event) =>
                                            handleOriginalUrlChange(
                                                event.target.value
                                            )
                                        }
                                    />
                                    {originalUrlError ? (
                                        <p
                                            id="original-url-error"
                                            className="text-sm leading-5 text-danger"
                                        >
                                            {originalUrlError}
                                        </p>
                                    ) : null}
                                </label>

                                <label className="block space-y-2">
                                    <span className="text-[10px] font-normal uppercase  text-gray-500">
                                        Link encurtado
                                    </span>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3.5 text-sm">
                                            <span className="text-gray-400">
                                                {displayedShortLinkPrefix}/
                                            </span>
                                        </div>
                                        <Input
                                            aria-label="Link encurtado"
                                            aria-describedby={
                                                shortLinkError
                                                    ? "short-link-error"
                                                    : undefined
                                            }
                                            aria-invalid={Boolean(shortLinkError)}
                                            className="pl-[3.9rem]"
                                            disabled={isBusy}
                                            error={Boolean(shortLinkError)}
                                            ref={shortLinkInputRef}
                                            value={shortLinkSuffix}
                                            onChange={(event) =>
                                                handleShortLinkChange(event.target.value)
                                            }
                                        />
                                    </div>
                                    {shortLinkError ? (
                                        <p
                                            id="short-link-error"
                                            className="text-sm leading-5 text-danger"
                                        >
                                            {shortLinkError}
                                        </p>
                                    ) : null}
                                </label>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="mt-1.5 w-full"
                                    disabled={isSubmitDisabled}
                                >
                                    {isCreatingLink ? "Salvando..." : "Salvar link"}
                                </Button>
                            </form>
                        </Card>

                        <Card className="px-5 py-4 md:px-6 md:py-4">
                            <div className="flex items-center justify-between gap-4">
                                <h2 className="text-[18px] font-bold text-gray-600">
                                    Meus links
                                </h2>

                                <Button
                                    variant="secondary"
                                    size="sm"
                                    disabled={
                                        isEmpty ||
                                        isLoadingLinks ||
                                        isBusy
                                    }
                                    onClick={handleExportCsv}
                                >
                                    <Download className="size-3.5" strokeWidth={1.9} />
                                    {isExportingCsv ? "Gerando CSV..." : "Baixar CSV"}
                                </Button>
                            </div>

                            <div className="mt-4 border-t border-gray-200" />

                            {isLoadingLinks ? (
                                <div className="py-8">
                                    <LoadingState
                                        title="Carregando links..."
                                        description="Estamos buscando os links cadastrados."
                                    />
                                </div>
                            ) : isEmpty ? (
                                <EmptyState
                                    title="AINDA NÃO EXISTEM LINKS CADASTRADOS"
                                />
                            ) : (
                                <div className="mt-1">
                                    {savedLinks.map((link) => (
                                        <LinkListItem
                                            key={link.id}
                                            link={link}
                                            isCopied={copiedLinkId === link.id}
                                            isDeleting={deletingLinkId === link.id}
                                            isDisabled={isBusy}
                                            onCopy={() => handleCopyLink(link)}
                                            onDelete={() => setLinkToDelete(link)}
                                        />
                                    ))}
                                </div>
                            )}
                        </Card>
                    </section>
                </div>
            </main>

            <DeleteLinkConfirmationModal
                isOpen={Boolean(linkToDelete)}
                isConfirming={
                    Boolean(linkToDelete) &&
                    deletingLinkId === linkToDelete?.id
                }
                onCancel={() => setLinkToDelete(null)}
                onConfirm={() => {
                    if (linkToDelete) {
                        void handleDeleteLink(linkToDelete);
                    }
                }}
            />

            <Toast
                open={Boolean(toast)}
                message={toast?.message ?? ""}
                variant={toast?.type}
                onClose={() => setToast(null)}
            />
        </>
    );
}
