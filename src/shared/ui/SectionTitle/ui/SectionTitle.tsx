import cn from "classnames";
import React, { FC, PropsWithChildren } from "react";

import styles from "./SectionTitle.module.scss";

interface SectionTitleProps {
    classNames?: string;
}

export const SectionTitle: FC<PropsWithChildren<SectionTitleProps>> = ({
  classNames,
  children,
}) => <h2 className={cn(styles.title, classNames)}>{children}</h2>;
