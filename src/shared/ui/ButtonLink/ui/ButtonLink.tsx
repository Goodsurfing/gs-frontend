import cn from "classnames";
import React, { FC, PropsWithChildren } from "react";

import LocaleLink from "shared/ui/LocaleLink";

import styles from "./ButtonLink.module.scss";

export interface IButtonProps {
  type: "primary" | "secondary" | "outlined";
  path: string;
  className?: string;
}


export const ButtonLink: FC<PropsWithChildren<IButtonProps>> = ({
  type,
  path,
  className,
  children,
}) => (
    <LocaleLink
        to={path}
        className={cn(
          styles.btn,
          {
            [styles.primary]: type === "primary",
            [styles.secondary]: type === "secondary",
            [styles.outlined]: type === "outlined",
          },
          className,
        )}
    >
        {children}
    </LocaleLink>
);
