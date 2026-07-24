import React from "react";

import cn from "classnames";

import logoIcon from "@/shared/assets/icons/logo-black.svg";
import styles from "./Preloader.module.scss";

interface PreloaderProps {
    className?: string;
    preloader?: string;
}

const Preloader = ({ className, preloader }: PreloaderProps) => (
    <div className={cn(styles.layout, className)}>
        <div className={cn(preloader, styles.preloader)}>
            <img src={logoIcon} alt="GoodSurfing" className={styles.logo} />
            <div className={styles.waveViewport}>
                <svg
                    className={styles.wave}
                    viewBox="0 0 240 24"
                    fill="none"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0 12 C 15 2, 45 2, 60 12 C 75 22, 105 22, 120 12 C 135 2, 165 2, 180 12 C 195 22, 225 22, 240 12"
                        stroke="#00A0A8"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                </svg>
            </div>
        </div>
    </div>
);

export default Preloader;
