import React, { FC, ReactNode, useEffect } from "react";

import cn from "classnames";
import { useLocation } from "react-router-dom";
import { Footer } from "@/widgets/Footer";
import MainHeader from "@/widgets/MainHeader/MainHeader";

import styles from "./MainPageLayout.module.scss";

interface MainPageLayoutProps {
    children: ReactNode;
    isFooterShow?: boolean;
    className?: string;
    headerVariant?: "floating" | "static";
}

export const MainPageLayout: FC<MainPageLayoutProps> = (
    props: MainPageLayoutProps,
) => {
    const {
        children, isFooterShow = true, className, headerVariant,
    } = props;

    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className={cn(styles.layout, className)}>
            <MainHeader variant={headerVariant} />
            <div className={styles.content}>
                {children}
            </div>
            {isFooterShow && <Footer />}
        </div>
    );
};
