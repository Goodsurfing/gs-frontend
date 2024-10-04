import cn from "classnames";
import { memo } from "react";

import { SidebarContentProps } from "../../model/types/sidebar";
import { SidebarArrow } from "../SidebarArrow/SidebarArrow";
import { useSidebarContext } from "../SidebarContext/SidebarContext";
import { SidebarLinks } from "../SidebarLinks/SidebarLinks";
import styles from "./Sidebar.module.scss";
import { MobileSidebar } from "../MobileSidebar/MobileSidebar";

export interface SidebarProps {
    content: SidebarContentProps[];
}

export const Sidebar = memo(({ content }: SidebarProps) => {
    const { isOpen } = useSidebarContext();

    return (
        <>
            <nav className={cn(styles.sidebar, { [styles.open]: isOpen })}>
                <SidebarLinks content={content} />
                <SidebarArrow />
            </nav>
            <MobileSidebar content={content} className={styles.mobileSidebar} />
        </>
    );
});
