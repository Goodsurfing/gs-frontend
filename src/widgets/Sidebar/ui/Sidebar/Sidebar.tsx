import cn from "classnames";
import { memo } from "react";
import { SidebarContentProps } from "../../model/types/sidebar";

import { useSidebarContext } from "../SidebarContext/SidebarContext";
import { SidebarLinks } from "../SidebarLinks/SidebarLinks";
import { SidebarArrow } from "../SidebarArrow/SidebarArrow";

import styles from "./Sidebar.module.scss";

export interface SidebarProps {
    content: SidebarContentProps[];
}

export const Sidebar = memo(({ content }: SidebarProps) => {
    const { isOpen } = useSidebarContext();

    return (
        <nav className={cn(styles.sidebar, { [styles.open]: isOpen })}>
            <SidebarLinks content={content} />
            <SidebarArrow />
        </nav>
    );
});
