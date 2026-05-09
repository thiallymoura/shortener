interface LoadingStateProps {
    title?: string;
    description?: string;
}

export function LoadingState({
    title = "Carregando...",
    description = "Aguarde enquanto preparamos a proxima tela.",
}: LoadingStateProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-5 text-center">
            <div className="relative flex size-16 items-center justify-center">
                <span className="absolute inset-0 rounded-full border-4 border-blue-base/15" />
                <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-base animate-spin" />
                <span className="size-4 rounded-full bg-blue-base" />
            </div>

            <div className="space-y-2">
                <strong className="block text-lg font-bold text-gray-600">
                    {title}
                </strong>
                <p className="max-w-xs text-sm leading-6 text-gray-400">
                    {description}
                </p>
            </div>
        </div>
    );
}
