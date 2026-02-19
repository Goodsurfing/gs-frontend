import React, { FC } from "react";
import cn from "classnames";

import { useTranslation } from "react-i18next";
import styles from "./CommentCount.module.scss";

interface CommentCountProps {
    className?: string;
    count: number;
}

export const CommentCount: FC<CommentCountProps> = (props: CommentCountProps) => {
    const { className, count } = props;
    const { t } = useTranslation();

    return (
        <div className={cn(className, styles.wrapper)}>
            {count}
            {" "}
            { t("комментариев") }
        </div>
    );
};
