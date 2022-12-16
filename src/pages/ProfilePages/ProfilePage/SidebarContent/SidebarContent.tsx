import React, { FC, PropsWithChildren } from "react";

import LocaleLink from "@/components/LocaleLink/LocaleLink";
import SupportWidget from "@/components/SupportWidget/SupportWidget";

import styles from "./SidebarContent.module.scss";

interface SidebarContentProps {
    withSupportWidget?: boolean;
}

const SidebarContent: FC<PropsWithChildren<SidebarContentProps>> = ({
    children,
    withSupportWidget = true,
}) => {
    return (
        <div className={styles.wrapper}>
            <nav className={styles.menu}>
                <LocaleLink to={"/"} className={styles.menuLink}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        fill="none"
                        viewBox="0 0 40 40"
                    >
                        <g
                            stroke="#fff"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.667"
                            clipPath="url(#clip0_1567_0)"
                        >
                            <path d="M20 18.333a5 5 0 100-10 5 5 0 000 10zM30 30c0-5.523-4.477-10-10-10s-10 4.477-10 10M30 3.333h6.667V10M10 3.333H3.333V10M30 36.667h6.667V30M10 36.667H3.333V30"></path>
                        </g>
                        <defs>
                            <clipPath id="clip0_1567_0">
                                <path fill="#fff" d="M0 0H40V40H0z"></path>
                            </clipPath>
                        </defs>
                    </svg>
                    <p>Обо мне</p>
                </LocaleLink>
                <LocaleLink to={"/"} className={styles.menuLink}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        fill="none"
                        viewBox="0 0 40 40"
                    >
                        <g
                            stroke="#fff"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.667"
                            clipPath="url(#clip0_1567_0)"
                        >
                            <path d="M20 18.333a5 5 0 100-10 5 5 0 000 10zM30 30c0-5.523-4.477-10-10-10s-10 4.477-10 10M30 3.333h6.667V10M10 3.333H3.333V10M30 36.667h6.667V30M10 36.667H3.333V30"></path>
                        </g>
                        <defs>
                            <clipPath id="clip0_1567_0">
                                <path fill="#fff" d="M0 0H40V40H0z"></path>
                            </clipPath>
                        </defs>
                    </svg>
                    <p>Обо мне</p>
                </LocaleLink>
                <LocaleLink to={"/"} className={styles.menuLink}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        fill="none"
                        viewBox="0 0 40 40"
                    >
                        <g
                            stroke="#fff"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.667"
                            clipPath="url(#clip0_1567_0)"
                        >
                            <path d="M20 18.333a5 5 0 100-10 5 5 0 000 10zM30 30c0-5.523-4.477-10-10-10s-10 4.477-10 10M30 3.333h6.667V10M10 3.333H3.333V10M30 36.667h6.667V30M10 36.667H3.333V30"></path>
                        </g>
                        <defs>
                            <clipPath id="clip0_1567_0">
                                <path fill="#fff" d="M0 0H40V40H0z"></path>
                            </clipPath>
                        </defs>
                    </svg>
                    <p>Обо мне</p>
                </LocaleLink>
                <LocaleLink to={"/"} className={styles.menuLink}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        fill="none"
                        viewBox="0 0 40 40"
                    >
                        <g
                            stroke="#fff"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.667"
                            clipPath="url(#clip0_1567_0)"
                        >
                            <path d="M20 18.333a5 5 0 100-10 5 5 0 000 10zM30 30c0-5.523-4.477-10-10-10s-10 4.477-10 10M30 3.333h6.667V10M10 3.333H3.333V10M30 36.667h6.667V30M10 36.667H3.333V30"></path>
                        </g>
                        <defs>
                            <clipPath id="clip0_1567_0">
                                <path fill="#fff" d="M0 0H40V40H0z"></path>
                            </clipPath>
                        </defs>
                    </svg>
                    <p>Обо мне</p>
                </LocaleLink>
            </nav>
            {withSupportWidget && <SupportWidget />}
        </div>
    );
};

export default SidebarContent;
