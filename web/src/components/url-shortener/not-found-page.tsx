import { Link } from "react-router-dom";
import { Card } from "../ui/card";
import { NotFoundIllustration } from "./not-found-illustration";

export function NotFoundPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-200 px-4 py-8">
            <Card className="flex w-full max-w-[36.25rem] flex-col items-center gap-6 px-12 py-16 text-center">
                <NotFoundIllustration />

                <div className="space-y-6">
                    <h1 className="text-[22px] font-bold leading-none text-gray-600">
                        Link não encontrado
                    </h1>
                    <p className="text-sm leading-6 text-gray-500">
                        O link que você esta tentando acessar não existe, foi
                        removido ou é uma URL inválida. Saiba mais em{" "}
                        <Link
                            to="/"
                            className="font-semibold text-blue-base underline-offset-2 hover:underline"
                        >
                            brev.ly
                        </Link>
                        .
                    </p>
                </div>
            </Card>
        </main>
    );
}
