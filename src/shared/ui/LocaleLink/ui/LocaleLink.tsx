import i18n from "i18next";
import React, { FC, PropsWithChildren } from "react";
import { Link } from "react-router-dom";

interface LocaleLinkProps {
    to: string;
    className?: string;
}

export const LocaleLink: FC<PropsWithChildren<LocaleLinkProps>> = ({
  to,
  className,
  children,
}) => {
  const adaptiveLink = (link: string) => {
    if (link === "") {
      return "";
    }

    return link;
  };
  return (
      <Link
          className={className}
          to={`/${i18n.language}/${adaptiveLink(to)}`}
          replace
      >
          {children}
      </Link>
  );
};
