import { useEffect, useId } from "react";

import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface DeleteLinkConfirmationModalProps {
    isOpen: boolean;
    isConfirming?: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export function DeleteLinkConfirmationModal({
    isOpen,
    isConfirming = false,
    onCancel,
    onConfirm,
}: DeleteLinkConfirmationModalProps) {
    const titleId = useId();
    const descriptionId = useId();

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape" && !isConfirming) {
                onCancel();
            }
        }

        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isConfirming, isOpen, onCancel]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/40 px-4 py-6">
            <div
                className="absolute inset-0"
                aria-hidden="true"
                onClick={isConfirming ? undefined : onCancel}
            />

            <Card
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                className="relative z-10 w-full max-w-[30rem] space-y-6 px-5 py-5 md:px-6"
            >
                <div className="space-y-3">
                    <h3
                        id={titleId}
                        className="text-xl font-bold leading-8 text-gray-600"
                    >
                        Confirmação
                    </h3>
                    <p
                        id={descriptionId}
                        className="text-sm leading-6 text-gray-500"
                    >
                        Tem certeza que deseja excluir este link?
                    </p>
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button
                        variant="secondary"
                        onClick={onCancel}
                        disabled={isConfirming}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="danger"
                        onClick={onConfirm}
                        disabled={isConfirming}
                    >
                        {isConfirming
                            ? "Excluindo..."
                            : "Confirmar exclusão"}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
