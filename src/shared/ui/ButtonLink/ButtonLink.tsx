import { IButtonProps } from "shared/ui/ButtonLink/ButtonLink.interface";
import cn from "classnames";
import React, { FC, PropsWithChildren } from "react";

import LocaleLink from "shared/ui/LocaleLink/LocaleLink";

import styles from "./ButtonLink.module.scss";

const ButtonLink: FC<PropsWithChildren<IButtonProps>> = ({
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

export default ButtonLink;
