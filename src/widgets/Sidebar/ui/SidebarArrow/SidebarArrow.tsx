import { memo } from "react";
import cn from "classnames";
import { useSidebarContext } from "../SidebarContext/SidebarContext";

import arrow from "@/shared/assets/icons/arrow.svg";

import styles from "./SidebarArrow.module.scss";

export const SidebarArrow = memo(() => {
    const { isOpen, setOpen } = useSidebarContext();
    return (
        <button
            onClick={() => setOpen?.(!isOpen)}
            className={styles.wrapper}
        >
            <img
                className={cn(styles.arrow, {
                    [styles.opened]: isOpen,
                })}
                src={arrow}
                alt="arrow"
            />
        </button>
    );
});
