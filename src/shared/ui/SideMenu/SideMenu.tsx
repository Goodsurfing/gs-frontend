import cn from "classnames";
import React, {
    FC, useCallback, useEffect, useState,
} from "react";
import { Link } from "react-router-dom";

import { Anchor } from "../Anchor/Anchor";
import styles from "./SideMenu.module.scss";

interface SideMenuProps {
    items: any[];
    className?: string;
}

const SideMenu: FC<SideMenuProps> = (props: SideMenuProps) => {
    const { items, className } = props;
    const [activeItem, setActiveItem] = useState(items[0].id);

    const handleScroll = useCallback(() => {
        for (let i = 0; i < items.length; i++) {
            const item = document.getElementById(items[i].id);
            if (item) {
                const rect = item.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    setActiveItem(items[i].id);
                    break;
                }
            }
        }
    }, [items]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        console.log(activeItem);
    }, [activeItem]);

    return (
        <nav className={cn(className, styles.sideMenu)}>
            <div className={styles.innerWrapper}>
                {items.map((item) => (
                    <>
                        <Anchor
                            // onClick={() => handleScroll()}
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
