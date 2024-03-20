/* eslint-disable react/no-danger */
import cn from "classnames";
import DOMPurify from "dompurify";
import React, { FC } from "react";

import styles from "./ArticleContent.module.scss";

interface ArticleContentProps {
    className?: string;
    content: string;
}

export const ArticleContent: FC<ArticleContentProps> = (
    props: ArticleContentProps,
) => {
    const { className, content } = props;
    const sanitizedHtml = DOMPurify.sanitize(content);
    return (
        <div
            className={cn(className, styles.wrapper)}
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
    );
};
