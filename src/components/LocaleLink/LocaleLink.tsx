import React, { FC, PropsWithChildren } from "react";
import { Link } from "react-router-dom";

interface LocaleLinkProps {
    to: string;
    className?: string;
    replace?: boolean;
}

const LocaleLink: FC<PropsWithChildren<LocaleLinkProps>> = ({
    to,
    replace,
    className,
    children,
}) => (
    <Link
        replace={replace}
        className={className}
        to={to}
    >
        {children}
    </Link>
);

export default LocaleLink;
