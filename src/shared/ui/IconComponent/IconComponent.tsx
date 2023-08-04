import { HandySvg, Props } from "@handy-ones/handy-svg";
import { memo } from "react";

interface IconProps extends Omit<Props, "icon"> {
    icon: string;
    alt?: string;
    id?: string;
    className?: string;
}

const IconComponent = memo(({
    icon, alt, className, id, ...restHandyProps
}: IconProps) => (
    <HandySvg
        src={icon}
        alt={alt}
        id={id}
        className={className}
        {...restHandyProps}
    />
));

export default IconComponent;
