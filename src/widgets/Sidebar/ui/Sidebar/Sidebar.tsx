import cn from "classnames";
import { memo } from "react";

import { SidebarContentProps } from "../../model/types/sidebar";
import { SidebarArrow } from "../SidebarArrow/SidebarArrow";
import { useSidebarContext } from "../SidebarContext/SidebarContext";
import { SidebarLinks } from "../SidebarLinks/SidebarLinks";
import { MobileSidebar } from "../MobileSidebar/MobileSidebar";
import styles from "./Sidebar.module.scss";

export interface SidebarProps {
    content: SidebarContentProps[];
    classNameSidebar?: string;
    classNameDropdownContainer?: string;
    classNameDropdownItem?: string;
    classNameSidebarLinks?: string;
    isSidebarDisabled?: boolean;
}

export const Sidebar = memo(({
    content,
    classNameSidebar, classNameSidebarLinks,
    classNameDropdownContainer, classNameDropdownItem,
    isSidebarDisabled = false,
}: SidebarProps) => {
    const { isOpen } = useSidebarContext();

    return (
        <>
            <nav className={cn(styles.sidebar, { [styles.open]: isOpen }, classNameSidebar)}>
                <SidebarLinks
                    content={content}
                    classNameSidebarLinks={classNameSidebarLinks}
                    classNameDropdownContainer={classNameDropdownContainer}
                    classNameDropdownItem={classNameDropdownItem}
                />
                {!isSidebarDisabled && <SidebarArrow />}
            </nav>
            <MobileSidebar content={content} className={styles.mobileSidebar} />
        </>
    );
});
