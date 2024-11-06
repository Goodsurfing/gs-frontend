import React, { FC, ReactNode } from "react";

import cn from "classnames";
import { Footer } from "@/widgets/Footer";
import MainHeader from "@/widgets/MainHeader/MainHeader";

import styles from "./MainPageLayout.module.scss";

interface MainPageLayoutProps {
    children: ReactNode;
    isFooterShow?: boolean;
    className?: string;
}

export const MainPageLayout: FC<MainPageLayoutProps> = (
    props: MainPageLayoutProps,
) => {
    const { children, isFooterShow = true, className } = props;
    return (
        <div className={cn(styles.layout, className)}>
            <MainHeader />
            <div className={styles.content}>
                {children}
            </div>
            {isFooterShow && <Footer />}
        </div>
    );
};
