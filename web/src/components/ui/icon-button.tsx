import { forwardRef, type ComponentProps } from "react";

import { Button } from "./button";

type IconButtonProps = Omit<ComponentProps<typeof Button>, "size"> & {
    size?: "icon" | "icon-sm";
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    function IconButton({ size = "icon", className, ...props }, ref) {
        return (
            <Button
                ref={ref}
                size={size}
                className={className}
                {...props}
            />
        );
    }
);
