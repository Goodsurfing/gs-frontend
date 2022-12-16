import React, { FC } from "react";

import SidebarLink, {
    SidebarLinkProps,
} from "@/components/Sidebar/SidebarNavigation/SidebarLink/SidebarLink";

import styles from "./SidebarNavigation.module.scss";

interface SidebarNavigationProps {
    navigationLinks: SidebarLinkProps[];
}

const SidebarNavigation: FC<SidebarNavigationProps> = ({ navigationLinks }) => {
    return (
        <nav className={styles.menu}>
            {navigationLinks.map((link, index) => (
                <SidebarLink key={index} icon={link.icon} text={link.text} />
            ))}
        </nav>
    );
};

export default SidebarNavigation;
