import { memo } from "react";
import { ReactSVG } from "react-svg";

interface IconProps extends Omit<any, "icon"> {
    icon: string;
    alt?: string;
    id?: string;
    className?: string;
}

const IconComponent = memo(({
    icon, alt, className, id, ...restHandyProps
}: IconProps) => (
    <ReactSVG
        src={icon}
        id={id}
        className={className}
        {...restHandyProps}
    />
));

export default IconComponent;
