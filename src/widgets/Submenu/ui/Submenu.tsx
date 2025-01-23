import cn from "classnames";
import {
    memo, useState, useEffect, ReactNode,
} from "react";

import { SubmenuItem } from "../model/types/submenu";
import styles from "./Submenu.module.scss";
import { Anchor } from "@/shared/ui/Anchor/Anchor";

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
                        <Anchor
                            id={item.id}
                            key={item.id}
                            title={item.text}
                            topGap={300}
                        />
                    </li>
                ))}
            </ul>
            <div className={cn(styles.buttons, { [styles.show]: showButtons })}>
                {buttons}
            </div>
        </nav>
    );
});
