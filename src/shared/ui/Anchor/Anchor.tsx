import cn from "classnames";
import React, { FC, useCallback } from "react";
import styles from "./Anchor.module.scss";

interface AnchorProps {
    id: string;
    title: string;
    activeId: string;
    className?: string;
}

export const Anchor: FC<AnchorProps> = (props: AnchorProps) => {
    const {
        id, title, activeId, className,
    } = props;

    const handleClick = useCallback(() => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    }, [id]);

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
