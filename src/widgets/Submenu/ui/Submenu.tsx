import cn from "classnames";
import {
    memo, useState, useEffect, ReactNode,
} from "react";

import { SubmenuItem } from "../model/types/submenu";
import styles from "./Submenu.module.scss";

interface SubmenuProps {
    items: SubmenuItem[];
    className?: string;
    buttons?: ReactNode;
}

export const Submenu = memo((props: SubmenuProps) => {
    const { items, className, buttons } = props;
    const [showButtons, setShowButtons] = useState<boolean>(false);

    const handleScroll = () => {
        const currentScrollPos = window.scrollY;
        const visible = currentScrollPos > 500;

        setShowButtons(visible);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <nav className={cn(styles.wrapper, className)}>
            <ul className={styles.innerWrapper}>
                {items.map((item) => (
                    <li key={item.id} className={styles.navItem}>
                        {item.text}
                    </li>
                ))}
            </ul>
            <div className={cn(styles.buttons, { [styles.show]: showButtons })}>
                {buttons}
            </div>
        </nav>
    );
});
