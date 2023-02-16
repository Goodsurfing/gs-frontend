import { FC } from "react";

import { ISideMenuNavbar } from "../types/SideMenuNavbar.interface";
import SideMenuItem from "./SideMenuItem/SideMenuItem";
import styles from "./SideMenuNavbar.module.scss";

const SideMenuNavbar: FC<ISideMenuNavbar> = ({ theme, content, opened }) => {
    return (
        <ul className={styles.navbarNav}>
            {content.map((item, index) => (
                <SideMenuItem
                    key={index}
                    opened={opened}
                    theme={theme}
                    text={item.text}
                    route={item.route}
                    icon={item.icon}
                />
            ))}
        </ul>
    );
};

export default SideMenuNavbar;
