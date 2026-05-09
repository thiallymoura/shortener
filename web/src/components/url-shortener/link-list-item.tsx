import { Copy, Trash2 } from "lucide-react";

import { IconButton } from "../ui/icon-button";
import type { SavedLink } from "./link-view-model";

interface LinkListItemProps {
    link: SavedLink;
    isCopied?: boolean;
    isDeleting?: boolean;
    isDisabled?: boolean;
    onCopy?: () => void;
    onDelete?: () => void;
}

export function LinkListItem({
    link,
    isCopied = false,
    isDeleting = false,
    isDisabled = false,
    onCopy,
    onDelete,
}: LinkListItemProps) {
    const shortUrlPath = link.shortUrl.split("/").filter(Boolean).pop() || "";
    const displayedShortUrl = `brev.ly/${shortUrlPath}`;
    const accessCountLabel =
        link.accessCount === 1 ? "1 acesso" : `${link.accessCount} acessos`;

    return (
        <article className="flex flex-col gap-3 border-t border-gray-200 py-3 first:border-t-0 first:pt-0 last:pb-0 md:grid md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center md:gap-4">
            <div className="min-w-0">
                <a
                    href={isDisabled ? undefined : link.shortUrl}
                    target={isDisabled ? undefined : "_blank"}
                    rel={isDisabled ? undefined : "noreferrer"}
                    aria-disabled={isDisabled}
                    tabIndex={isDisabled ? -1 : undefined}
                    onClick={
                        isDisabled
                            ? (event) => {
                                  event.preventDefault();
                              }
                            : undefined
                    }
                    className={`block truncate text-sm font-semibold text-blue-base ${
                        isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                    }`}
                >
                    {displayedShortUrl}
                </a>
                <p className="mt-1 truncate text-xs text-gray-500">
                    {link.originalUrl}
                </p>
            </div>

            <div className="text-xs text-gray-500 md:justify-self-end md:text-right">
                <span className="block">{accessCountLabel}</span>
                <span className="mt-1 block">{link.createdAt}</span>
            </div>

            <div className="flex items-center gap-1 self-end md:self-center md:justify-self-end">
                <IconButton
                    variant={isCopied ? "primary" : "secondary"}
                    size="icon-sm"
                    aria-label={isCopied ? "Link copiado" : "Copiar link"}
                    className="rounded-md"
                    onClick={onCopy}
                    disabled={isDisabled}
                    title={isCopied ? "Link copiado" : "Copiar link"}
                >
                    <Copy className="size-3.5" strokeWidth={1.8} />
                </IconButton>
                <IconButton
                    variant="danger"
                    size="icon-sm"
                    aria-label={isDeleting ? "Deletando link" : "Deletar link"}
                    className="rounded-md"
                    onClick={onDelete}
                    disabled={isDisabled}
                    title={isDeleting ? "Deletando link" : "Deletar link"}
                >
                    <Trash2 className="size-3.5" strokeWidth={1.8} />
                </IconButton>
            </div>
        </article>
    );
}
