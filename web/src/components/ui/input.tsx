import { forwardRef, type ComponentProps } from "react";

type InputProps = ComponentProps<"input"> & {
    error?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    { className = "", error = false, ...props },
    ref
) {
    const stateClassName = error
        ? "border-danger text-gray-600 placeholder:text-danger/70 focus:border-danger focus:ring-1 focus:ring-danger"
        : "border-gray-300 text-gray-600 placeholder:text-gray-400 hover:border-blue-base/45 focus:border-blue-base focus:ring-1 focus:ring-blue-base";

    return (
        <input
            ref={ref}
            className={`h-10 w-full rounded-lg border bg-white px-3.5 text-sm font-normal outline-none transition-colors ${stateClassName} disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 ${className}`}
            {...props}
        />
    );
});
