import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

type ToastVariant = "success" | "error" | "info";

type ToastProps = {
    open: boolean;
    message: string;
    variant?: ToastVariant;
    onClose?: () => void;
};

const toastStyles: Record<
    ToastVariant,
    {
        container: string;
        icon: typeof CheckCircle2;
        iconClassName: string;
        liveRegion: "assertive" | "polite";
        role: "alert" | "status";
    }
> = {
    success: {
        container:
            "border-blue-base/12 bg-white text-gray-600 shadow-[0_18px_48px_rgba(31,32,37,0.16)]",
        icon: CheckCircle2,
        iconClassName: "text-blue-base",
        liveRegion: "polite",
        role: "status",
    },
    error: {
        container:
            "border-danger/15 bg-white text-gray-600 shadow-[0_18px_48px_rgba(177,44,77,0.14)]",
        icon: AlertCircle,
        iconClassName: "text-danger",
        liveRegion: "assertive",
        role: "alert",
    },
    info: {
        container:
            "border-gray-300 bg-white text-gray-600 shadow-[0_18px_48px_rgba(31,32,37,0.14)]",
        icon: Info,
        iconClassName: "text-gray-500",
        liveRegion: "polite",
        role: "status",
    },
};

export function Toast({
    open,
    message,
    variant = "info",
    onClose,
}: ToastProps) {
    const {
        container,
        icon: Icon,
        iconClassName,
        liveRegion,
        role,
    } = toastStyles[variant];

    return (
        <AnimatePresence>
            {open ? (
                <motion.div
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex justify-center"
                >
                    <div
                        role={role}
                        aria-live={liveRegion}
                        className={`pointer-events-auto flex w-full max-w-[24rem] items-start gap-3 rounded-xl border px-4 py-3 ${container}`}
                    >
                        <Icon className={`mt-0.5 size-5 shrink-0 ${iconClassName}`} />

                        <p className="min-w-0 flex-1 text-sm leading-6">{message}</p>

                        {onClose ? (
                            <button
                                type="button"
                                aria-label="Fechar notificacao"
                                className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-base/15"
                                onClick={onClose}
                            >
                                <X className="size-4" />
                            </button>
                        ) : null}
                    </div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}
