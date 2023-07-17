import { FC, ReactNode } from "react";
import cn from "classnames";
import MainHeader from "@/shared/ui/MainHeader/MainHeader";
import { Sidebar, useSidebarContext, type SidebarContentProps } from "@/widgets/Sidebar";

import styles from "./PageLayout.module.scss";

interface PageLayoutProps {
    children: ReactNode;
    sidebarContent: SidebarContentProps[];
    wrapperClassName?: string;
}

export const PageLayout: FC<PageLayoutProps> = ({ children, sidebarContent, wrapperClassName }) => {
    const { isOpen } = useSidebarContext();
    return (
        <div className={styles.layout}>
            <MainHeader />
            <Sidebar content={sidebarContent} />
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
