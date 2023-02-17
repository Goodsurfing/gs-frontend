import cn from "classnames";
import React, { FC } from "react";

import arrow from "@/assets/icons/arrow.svg";

import { ISideMenuArrow } from "../types/SideMenuArrow.interface";
import styles from "./SideMenuArrow.module.scss";
import { Theme } from "../types/SideMenu.interface";

const SideMenuArrow: FC<ISideMenuArrow> = ({ setOpened, isOpen, theme }) => {
    return (
        <div
            onClick={() => setOpened(!isOpen)}
            className={cn(
                styles.box,
                {
                    [styles.boxOpened]: isOpen,
                },
                {
                    [styles.dark]: theme === Theme.DARK,
                    [styles.light]: theme === Theme.LIGHT,
                }
            )}
        >
            <img
                className={cn({
                    [styles.opened]: isOpen === true,
                    [styles.closed]: isOpen === false,
                })}
                src={arrow}
                alt="arrow"
                loading="lazy"
            />
        </div>
    );
};

export default SideMenuArrow;
