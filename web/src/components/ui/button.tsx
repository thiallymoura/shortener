import { Slot } from "@radix-ui/react-slot";

import { forwardRef, type ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
    base: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border text-sm font-semibold transition-colors outline-none disabled:pointer-events-none disabled:cursor-not-allowed aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed focus-visible:ring-4 focus-visible:ring-blue-base/15",

    variants: {
        variant: {
            ghost: "border-transparent text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 disabled:opacity-50 aria-disabled:opacity-50",
            primary:
                "border-blue-base bg-blue-base text-white shadow-none hover:border-blue-dark hover:bg-blue-dark active:bg-blue-dark disabled:border-gray-300 disabled:bg-gray-300 disabled:text-white/80 aria-disabled:border-gray-300 aria-disabled:bg-gray-300 aria-disabled:text-white/80",
            secondary:
                "border-gray-300 bg-gray-100 text-gray-500 hover:border-gray-300 hover:bg-white hover:text-gray-600 active:bg-gray-100 disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 aria-disabled:border-gray-300 aria-disabled:bg-gray-100 aria-disabled:text-gray-400",
            danger:
                "border-gray-300 bg-gray-100 text-gray-500 hover:border-gray-300 hover:bg-white hover:text-danger active:bg-gray-100 disabled:text-gray-400 aria-disabled:text-gray-400",
        },
        size: {
            default: "h-11 px-5",
            sm: "h-8 px-3 text-xs",
            icon: "size-11 p-0",
            "icon-sm": "size-8 p-0",
        },
    },

    defaultVariants: {
        variant: "ghost",
        size: "default",
    },
});

type ButtonProps = ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    { size, variant, className, asChild, ...props },
    ref
) {
    const Component = asChild ? Slot : "button";

    return (
        <Component
            ref={ref}
            className={buttonVariants({ variant, size, className })}
            {...props}
        />
    );
});
