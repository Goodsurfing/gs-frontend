import React, { FC } from "react";

import LocaleLink from "@/components/LocaleLink/LocaleLink";

import styles from "./SidebarLink.module.scss";

export interface SidebarLinkProps {
    icon: React.ReactNode;
    text: string;
}

const SidebarLink: FC<SidebarLinkProps> = ({ icon, text }) => {
    return (
        <LocaleLink to={"/"} className={styles.menuLink}>
            {icon}
            <p className={styles.text}>{text}</p>
        </LocaleLink>
    );
};

export default SidebarLink;
