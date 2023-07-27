import { HandySvg, Props } from "@handy-ones/handy-svg";
import { memo } from "react";

interface IconProps extends Omit<Props, "icon"> {
    icon: string;
    alt?: string;
    className?: string;
}

const IconComponent = memo(({
    icon, alt, className, ...restHandyProps
}: IconProps) => (
    <HandySvg
        src={icon}
        alt={alt}
        className={className}
        {...restHandyProps}
    />
));

export default IconComponent;
