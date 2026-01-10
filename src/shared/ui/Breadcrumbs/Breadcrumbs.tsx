import React, { FC } from "react";
import cn from "classnames";

import CustomLink from "../Link/Link";
import styles from "./Breadcrumbs.module.scss";

export interface IBreadcrumbItem {
    label: string;
    to?: string;
}

export interface IBreadcrumbsProps {
    items: IBreadcrumbItem[];
    className?: string;
}

export const Breadcrumbs: FC<IBreadcrumbsProps> = ({ items = [], className }) => {
    if (!items || items.length === 0) return null;

    return (
        <nav className={cn(styles.breadcrumbs, className)} aria-label="breadcrumbs">
            <ol className={styles.list}>
                {items.map((item, idx) => {
                    const isLast = idx === items.length - 1;
                    return (
                        <li
                            key={idx}
                            className={cn(styles.item, { [styles.current]: isLast })}
                        >
                            {item.to && !isLast ? (
                                <CustomLink to={item.to} className={styles.link} variant="DEFAULT">
                                    {item.label}
                                </CustomLink>
                            ) : (
                                <span className={styles.label}>{item.label}</span>
                            )}

                            {!isLast && <span className={styles.sep}>/</span>}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};
