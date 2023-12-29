import React, { FC, ReactNode } from "react";
import { Outlet } from "react-router-dom";

import { Footer } from "@/widgets/Footer";
import MainHeader from "@/widgets/MainHeader/MainHeader";

import styles from "./MainPageLayout.module.scss";

interface MainPageLayoutProps {
    children: ReactNode;
}

export const MainPageLayout: FC<MainPageLayoutProps> = (
    props: MainPageLayoutProps,
) => {
    const { children } = props;
    return (
        <div className={styles.layout}>
            <MainHeader />
            <div className={styles.content}>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};
