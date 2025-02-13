import cn from "classnames";
import React, { FC } from "react";
import { Link } from "react-router-dom";

import { ILinkProps } from "./Link.interface";
import styles from "./Link.module.scss";

const CustomLink: FC<ILinkProps> = ({
    variant,
    to,
    children,
    className,
    ...restLinkProps
}) => (
    <Link
        className={cn(className, styles.link, {
            [styles.blue]: variant === "BLUE",
            [styles.default]: variant === "DEFAULT",
        })}
        to={to}
        {...restLinkProps}
    >
        {children}
    </Link>
);

export default CustomLink;
