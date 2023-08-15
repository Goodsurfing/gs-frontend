import { memo } from "react";

import cn from "classnames";

import { SubmenuItem } from "../model/types/submenu";

import styles from "./Submenu.module.scss";

interface SubmenuProps {
    items: SubmenuItem[];
    className?: string;
}

export const Submenu = memo((props: SubmenuProps) => {
    const { items, className } = props;
    return (
        <nav className={cn(styles.wrapper, className)}>
            <ul className={styles.innerWrapper}>
                {items.map((item) => (
                    <li key={item.id} className={styles.navItem}>
                        {item.text}
                    </li>
                ))}
            </ul>
        </nav>
    );
});
