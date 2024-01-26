import React, {
    useEffect, useState, FC, useCallback,
} from "react";
import cn from "classnames";
import styles from "./SideMenu.module.scss";

interface SideMenuProps {
    items: any[]
}

const SideMenu: FC<SideMenuProps> = (props: SideMenuProps) => {
    const { items } = props;
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
        <div className={styles.sideMenu}>
            {items.map((item) => (
                <a
                    href={`#${item.id}`}
                    key={item.id}
                    className={cn({ [styles.active]: item.id === activeItem })}
                >
                    {item.name}
                </a>
            ))}
        </div>
    );
};

export default SideMenu;
