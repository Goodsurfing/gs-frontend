import i18n from "i18next";
import React, { FC, PropsWithChildren } from "react";
import { Link } from "react-router-dom";

interface LocaleLinkProps {
    to: string;
    className?: string;
}

const LocaleLink: FC<PropsWithChildren<LocaleLinkProps>> = ({
    to,
    className,
    children,
}) => {
    if (to === "/") {
        to = "";
    }
    return (
        <Link className={className} to={`/${i18n.language}/${to}`} replace>
            {children}
        </Link>
    );
};

export default LocaleLink;
