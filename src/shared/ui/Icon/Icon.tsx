import { HandySvg } from "handy-svg";

import { memo } from "react";

interface IconProps {
    icon: string;
    alt?: string;
    className?: string;
}

export const Icon = memo(({ icon, alt, className }: IconProps) => (
    <HandySvg
        src={icon}
        alt={alt}
        className={className}
    />
));
