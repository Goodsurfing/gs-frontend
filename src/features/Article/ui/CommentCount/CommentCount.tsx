import React, { FC } from "react";
import cn from "classnames";

import styles from "./CommentCount.module.scss";

interface CommentCountProps {
    className?: string;
    count: string;
}

export const CommentCount: FC<CommentCountProps> = (props: CommentCountProps) => {
    const { className, count } = props;
    return (
        <div className={cn(className, styles.wrapper)}>
            {count}
            {" "}
            комментариев
        </div>
    );
};
