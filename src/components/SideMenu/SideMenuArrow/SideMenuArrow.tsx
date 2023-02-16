import cn from "classnames";
import React, { FC } from "react";

import arrow from "@/assets/icons/arrow.svg";

import { ISideMenuArrow } from "../types/SideMenuArrow.interface";
import styles from "./SideMenuArrow.module.scss";

const SideMenuArrow: FC<ISideMenuArrow> = ({ setOpened, opened, theme }) => {
    return (
        <div
            onClick={() => setOpened(!opened)}
            className={cn(
                styles.box,
                {
                    [styles.boxOpened]: opened,
                },
                {
                    [styles.dark]: theme === "DARK",
                    [styles.light]: theme === "LIGHT",
                }
            )}
        >
            <img
                className={cn({
                    [styles.opened]: opened === true,
                    [styles.closed]: opened === false,
                })}
                src={arrow}
                alt="arrow"
                loading="lazy"
            />
        </div>
    );
};

export default SideMenuArrow;
