import i18n from "i18next";
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
}) => {
    const adaptiveLink = (link: string) => {
        if (link === "/") {
            return "";
        }

        return link;
    };
    return (
        <Link
            replace={replace}
            className={className}
            to={`/${i18n.language}/${adaptiveLink(to)}`}
        >
            {children}
        </Link>
    );
};

export default LocaleLink;
