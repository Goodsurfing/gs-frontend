import React, { FC, PropsWithChildren } from "react";

import { SidebarLinkProps } from "@/components/Sidebar/SidebarNavigation/SidebarLink/SidebarLink";
import SidebarNavigation from "@/components/Sidebar/SidebarNavigation/SidebarNavigation";
import SupportWidget from "@/components/SupportWidget/SupportWidget";

import styles from "./SidebarContent.module.scss";

interface SidebarContentProps {
    navigationLink: SidebarLinkProps[];
    withSupportWidget?: boolean;
}

const SidebarContent: FC<PropsWithChildren<SidebarContentProps>> = ({
    navigationLink,
    withSupportWidget = true,
}) => {
    return (
        <div className={styles.wrapper}>
            <SidebarNavigation navigationLinks={navigationLink} />
            {withSupportWidget && <SupportWidget />}
        </div>
    );
};

export default SidebarContent;
