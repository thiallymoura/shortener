import type { ComponentProps } from "react";

type CardProps = ComponentProps<"section"> & {
    surface?: "default" | "muted";
};

export function Card({
    surface = "default",
    className = "",
    ...props
}: CardProps) {
    const surfaceClassName =
        surface === "muted"
            ? "bg-gray-100 border-gray-200"
            : "bg-white border-gray-200";

    return (
        <section
            className={`rounded-xl border p-5 shadow-none md:p-6 ${surfaceClassName} ${className}`}
            {...props}
        />
    );
}
