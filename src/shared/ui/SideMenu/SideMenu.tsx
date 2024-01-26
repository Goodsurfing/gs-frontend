import cn from "classnames";
import React, {
    FC, useCallback, useEffect, useState,
} from "react";

import { Link } from "react-router-dom";
import styles from "./SideMenu.module.scss";
import { Anchor } from "../Anchor/Anchor";

interface SideMenuProps {
    items: any[];
    className?: string;
}

const SideMenu: FC<SideMenuProps> = (props: SideMenuProps) => {
    const { items, className } = props;
    const [activeItem, setActiveItem] = useState(items[0].id);

    const handleScroll = useCallback(() => {
        items.some((item) => {
            const element = document.getElementById(item.id);
            if (element && element.getBoundingClientRect().top <= 0) {
                setActiveItem(item.id);
                return true;
            }
            return false;
        });
    }, [items]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    return (
        <nav className={cn(className, styles.sideMenu)}>
            <div className={styles.innerWrapper}>
                {items.map((item) => (
                    <>
                        <Anchor
                            id={item.id}
                            key={item.id}
                            activeId={activeItem}
                            title={item.title}
                        />
                        <br />
                    </>
                ))}
            </div>
        </nav>
    );
};

export default SideMenu;
