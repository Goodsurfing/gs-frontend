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
        const animationFrameId = window.requestAnimationFrame(() => {
            if (location.hash) {
                const targetId = decodeURIComponent(location.hash.slice(1));
                const target = document.getElementById(targetId);

                if (target) {
                    const anchorOffset = 80;
                    const targetTop = target.getBoundingClientRect().top + window.scrollY;

                    window.scrollTo(0, targetTop - anchorOffset);
                    return;
                }
            }

            window.scrollTo(0, 0);
        });

        return () => window.cancelAnimationFrame(animationFrameId);
    }, [location.hash, location.pathname]);

    return (
        <div className={cn(styles.layout, headerVariant !== "static" ? styles.floating : undefined, className)}>
            <MainHeader variant={headerVariant} />
            <div className={styles.content}>
                {children}
            </div>
            {isFooterShow && <Footer />}
        </div>
    );
};
