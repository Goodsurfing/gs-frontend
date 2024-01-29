import cn from "classnames";
import React, { FC, useCallback } from "react";

import styles from "./Anchor.module.scss";

interface AnchorProps {
    id: string;
    title: string;
    activeId: string;
    className?: string;
    onClick?: () => void;
}

export const Anchor: FC<AnchorProps> = (props: AnchorProps) => {
    const {
        id, title, activeId, className, onClick,
    } = props;

    const handleClick = useCallback(() => {
        onClick?.();
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 100,
                behavior: "smooth",
            });
        }
    }, [id, onClick]);

    return (
        <div
            onClick={handleClick}
            className={cn(className, styles.wrapper, {
                [styles.active]: id === activeId,
            })}
        >
            {title}
        </div>
    );
};
