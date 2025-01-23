import cn from "classnames";
import React, {
    FC, useCallback, useEffect, useState,
} from "react";

import styles from "./Anchor.module.scss";

interface AnchorProps {
    id: string;
    title: string;
    className?: string;
    onClick?: () => void;
    topGap?: number;
}

export const Anchor: FC<AnchorProps> = (props: AnchorProps) => {
    const {
        id, title, className, onClick, topGap = 100,
    } = props;

    const [isActive, setIsActive] = useState(false);

    const handleScroll = useCallback(() => {
        const element = document.getElementById(id);
        if (element) {
            const rect = element.getBoundingClientRect();
            const isInView = rect.top - topGap <= 100 && rect.bottom > 100;
            setIsActive(isInView);
        }
    }, [id, topGap]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll]);

    const handleClick = useCallback(() => {
        onClick?.();
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - topGap,
                behavior: "smooth",
            });
        }
    }, [id, onClick, topGap]);

    return (
        <div
            onClick={handleClick}
            className={cn(className, styles.wrapper, { [styles.active]: isActive })}
        >
            {title}
        </div>
    );
};
