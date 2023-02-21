import cn from "classnames";
import React, { FC } from "react";

import arrow from "@/assets/icons/arrow.svg";

import { Theme } from "../types/SideMenu.interface";
import { ISideMenuArrow } from "../types/SideMenuArrow.interface";
import styles from "./SideMenuArrow.module.scss";

const SideMenuArrow: FC<ISideMenuArrow> = ({ setOpen, isOpen, theme }) => {
    return (
        <div
            onClick={() => { return setOpen(!isOpen); }}
            className={cn(
                styles.box,
                {
                    [styles.boxOpened]: isOpen,
                },
                {
                    [styles.dark]: theme === Theme.DARK,
                    [styles.light]: theme === Theme.LIGHT,
                },
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
