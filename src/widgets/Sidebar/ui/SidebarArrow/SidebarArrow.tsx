import { memo } from "react";
import cn from "classnames";
import { ReactSVG } from "react-svg";
import { useSidebarContext } from "../SidebarContext/SidebarContext";

import arrow from "@/shared/assets/icons/arrow.svg";

import styles from "./SidebarArrow.module.scss";

export const SidebarArrow = memo(() => {
    const { isOpen, setOpen } = useSidebarContext();
    return (
        <button
            onClick={() => setOpen?.(!isOpen)}
            className={styles.wrapper}
            type="button"
        >
            <ReactSVG
                className={cn(styles.arrow, {
                    [styles.opened]: isOpen,
                })}
                src={arrow}
            />
        </button>
    );
});
