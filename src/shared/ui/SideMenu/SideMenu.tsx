import cn from "classnames";
import React, {
    FC,
} from "react";

import { Anchor } from "../Anchor/Anchor";
import styles from "./SideMenu.module.scss";

interface SideMenuProps {
    items: any[];
    className?: string;
}

const SideMenu: FC<SideMenuProps> = (props: SideMenuProps) => {
    const { items, className } = props;

    return (
        <nav className={cn(className, styles.sideMenu)}>
            <div className={styles.innerWrapper}>
                {items.map((item) => (
                    <>
                        <Anchor
                            id={item.id}
                            key={item.id}
                            title={item.title}
                            className={styles.anchor}
                            classNameActive={styles.active}
                        />
                        <br />
                    </>
                ))}
            </div>
        </nav>
    );
};

export default SideMenu;
