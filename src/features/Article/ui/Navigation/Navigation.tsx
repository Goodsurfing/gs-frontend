import React, { FC } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import styles from "./Navigation.module.scss";

interface BreadcrumbItem {
    name: string;
    link?: string;
}

interface NavigationProps {
    breadcrumbs: BreadcrumbItem[];
    className?: string;
}

export const Navigation: FC<NavigationProps> = (props) => {
    const {
        className, breadcrumbs,
    } = props;
    return (
        <div className={cn(className, styles.wrapper)}>
            <span className={styles.navigation}>
                {breadcrumbs.map((item, index) => (
                    <span key={index}>
                        {item.link ? (
                            <Link to={item.link}>{item.name}</Link>
                        ) : (
                            <span>{item.name}</span>
                        )}
                        {index < breadcrumbs.length - 1 && (
                            <>
                                {" "}
                                /
                                {" "}
                            </>
                        )}
                    </span>
                ))}
            </span>
        </div>
    );
};
