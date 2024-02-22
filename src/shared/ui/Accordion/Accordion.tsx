import cn from "classnames";
import React, {
    FC, memo, useCallback, useMemo, useRef, useState,
} from "react";

import arrowIcon from "@/shared/assets/icons/accordion-arrow.svg";

import styles from "./Accordion.module.scss";

export interface AccordionData {
    title: string;
    description: string;
}

interface AccordionProps {
    data: AccordionData[];
    className?: string;
}

export const Accordion: FC<AccordionProps> = memo((props: AccordionProps) => {
    const { data, className } = props;
    const [openId, setId] = useState<number | null>(null);
    const itemRef = useRef<HTMLDivElement | null>(null);

    const openHandler = useCallback(
        (id: number) => {
            if (id === openId) setId(null);
            else setId(id);
        },
        [openId],
    );

    const renderList = useMemo(
        () => data.map((item, key) => (
            <li className={styles.item}>
                <button
                    className={styles.header}
                    type="button"
                    onClick={() => openHandler(key)}
                >
                    {item.title}
                    <img
                        src={arrowIcon}
                        alt="arrow"
                        className={cn(styles.arrow, {
                            [styles.arrowActive]: key === openId,
                        })}
                    />
                </button>
                <div
                    className={cn(styles.collapse)}
                    style={
                        key === openId && itemRef.current
                            ? { height: itemRef.current.scrollHeight }
                            : { height: "0px" }
                    }
                >
                    <div className={styles.body} ref={itemRef}>
                        {item.description}
                    </div>
                </div>
            </li>
        )),
        [data, openHandler, openId],
    );

    return <ul className={cn(className, styles.accordion)}>{renderList}</ul>;
});
