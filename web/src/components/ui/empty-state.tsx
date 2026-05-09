import type { ComponentType, SVGProps } from "react";

import { Link2 } from "lucide-react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: IconComponent;
    imageSrc?: string;
}

export function EmptyState({
    title,
    description,
    icon: Icon = Link2,
    imageSrc = "/empty-link-icon.png",
}: EmptyStateProps) {
    return (
        <div className="flex min-h-52 flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex items-center justify-center text-gray-400">
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt=""
                        aria-hidden="true"
                        className="h-5 w-auto"
                    />
                ) : (
                    <Icon className="size-5" strokeWidth={1.75} />
                )}
            </div>

            <strong className="mt-4 text-[10px] font-normal uppercase tracking-[0.12em] text-gray-400">
                {title}
            </strong>

            {description ? (
                <p className="mt-2 max-w-xs text-sm leading-6 text-gray-400">
                    {description}
                </p>
            ) : null}
        </div>
    );
}
