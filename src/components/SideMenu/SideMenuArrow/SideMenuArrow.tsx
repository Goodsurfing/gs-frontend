import cn from "classnames";
import React, { FC } from "react";

import arrow from "@/assets/icons/arrow.svg";

import { ISideMenuArrow } from "../types/SideMenuArrow.interface";
import styles from "./SideMenuArrow.module.scss";

const SideMenuArrow: FC<ISideMenuArrow> = ({ setOpened, opened, theme }) => {
    const boxClassname = cn(styles.box, {
        [styles.boxOpened]: opened,
    });

    const arrowClassname = cn({
        [styles.opened]: opened === true,
        [styles.closed]: opened === false,
    });

    return (
        <div
            onClick={() => setOpened(!opened)}
            className={cn(boxClassname, {
                [styles.dark]: theme === "DARK",
                [styles.light]: theme === "LIGHT",
            })}
        >
            <img
                className={arrowClassname}
                src={arrow}
                alt="arrow"
                loading="lazy"
            />
        </div>
    );
};

export default SideMenuArrow;
