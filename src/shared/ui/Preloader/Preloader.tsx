import React from "react";

import cn from "classnames";

import styles from "./Preloader.module.scss";

interface PreloaderProps {
    className?: string;
    preloader?: string;
}

const Preloader = ({ className, preloader }: PreloaderProps) => (
    <div className={cn(styles.layout, className)}>
        <div className={cn(preloader, styles.preloader)}>
            <svg
                viewBox="0 0 102 102"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    className={styles.bigCircle}
                    d="M101 51C101 78.6142 78.6142 101 51 101C23.3858 101 1 78.6142 1 51"
                    stroke="#252525"
                    strokeWidth="2"
                />
                <path
                    className={styles.smallCircle}
                    d="M91 51C91 28.9086 73.0914 11 51 11C28.9086 11 11 28.9086 11 51"
                    stroke="#252525"
                    strokeWidth="2"
                />
            </svg>
        </div>
    </div>
);

export default Preloader;
