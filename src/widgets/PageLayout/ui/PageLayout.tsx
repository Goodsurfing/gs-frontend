import React, { FC, ReactNode, useState } from "react";
import cn from "classnames";
import MainHeader from "@/shared/ui/MainHeader/MainHeader";
import SideMenu from "@/components/SideMenu/SideMenu";
import { SideMenuParams, Theme } from "@/components/SideMenu/types/SideMenu.interface";

import styles from "./PageLayout.module.scss";

interface PageLayoutProps {
    children: ReactNode;
    sidebarContent: SideMenuParams[];
    wrapperClassName?: string;
}

export const PageLayout: FC<PageLayoutProps> = ({ children, sidebarContent, wrapperClassName }) => {
    const [isOpen, setOpen] = useState<boolean>(false);
    return (
        <div className={styles.layout}>
            <MainHeader />
            <SideMenu
                isOpen={isOpen}
                setOpen={setOpen}
                theme={Theme.LIGHT}
                content={sidebarContent}
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
