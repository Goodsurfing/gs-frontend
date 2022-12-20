import React, { FC } from "react";

import LocaleLink from "@/components/LocaleLink/LocaleLink";

import styles from "./SidebarLink.module.scss";

export interface SidebarLinkProps {
    icon: React.ReactNode;
    text: string;
    to: string;
}

const SidebarLink: FC<SidebarLinkProps> = ({ icon, to, text }) => {
    return (
        <LocaleLink to={to} className={styles.menuLink}>
            {icon}
            <p className={styles.text}>{text}</p>
        </LocaleLink>
    );
};

export default SidebarLink;
