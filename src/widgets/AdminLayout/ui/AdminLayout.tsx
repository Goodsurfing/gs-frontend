import { FC, ReactNode } from "react";
import cn from "classnames";
import { Sidebar, SidebarContentProps, useSidebarContext } from "@/widgets/Sidebar";

import { AdminHeader } from "@/widgets/AdminHeader";
import styles from "./AdminLayout.module.scss";

interface AdminLayoutProps {
    wrapperClassName?: string;
    sidebarContent: SidebarContentProps[];
    children: ReactNode;
}

export const AdminLayout: FC<AdminLayoutProps> = (props) => {
    const { wrapperClassName, children, sidebarContent } = props;
    const { isOpen } = useSidebarContext();
    return (
        <div id="admin-layout" className={styles.layout}>
            <AdminHeader />
            <Sidebar
                classNameSidebar={styles.sidebar}
                classNameSidebarLinks={styles.sidebarLinks}
                content={sidebarContent}
                classNameDropdownContainer={styles.dropdownContainer}
                classNameDropdownItem={styles.dropdownItem}
                isSidebarDisabled
            />
            <div
                className={cn(styles.wrapper, {
                    [styles.opened]: isOpen,
                })}
            >
                <div className={cn(styles.innerWrapper, wrapperClassName)}>
                    {children}
                </div>
            </div>
        </div>
    );
};
