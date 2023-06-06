import React, { FC, ReactNode, useState } from "react";
import cn from "classnames";
import MainHeader from "@/UI/MainHeader/MainHeader";
import SideMenu from "@/components/SideMenu/SideMenu";
import { Theme } from "@/components/SideMenu/types/SideMenu.interface";

import styles from "./HostPageLayout.module.scss";
import { HostPagesSidebarData } from "../model/items";

interface HostPageLayoutProps {
    children: ReactNode;
}

export const HostPageLayout: FC<HostPageLayoutProps> = ({ children }) => {
    const [isOpen, setOpen] = useState<boolean>(false);
    return (
        <div className={styles.layout}>
            <MainHeader />
            <SideMenu
                isOpen={isOpen}
                setOpen={setOpen}
                theme={Theme.LIGHT}
                content={HostPagesSidebarData}
            />
            <div
                className={cn(styles.wrapper, {
                    [styles.opened]: isOpen,
                })}
            >
                <div className={styles.innerWrapper}>
                    {children}
                </div>
            </div>
        </div>
    );
};
