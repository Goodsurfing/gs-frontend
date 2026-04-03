import cn from "classnames";
import React, { FC, useMemo } from "react";

import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import { Comment } from "../Comment/Comment";
import styles from "./CommentList.module.scss";
import { Comments } from "../../model/types/articleSchema";

interface CommentListProps {
    className?: string;
    comments: Comments[];
    locale: Locale;
}

export const CommentList: FC<CommentListProps> = (props: CommentListProps) => {
    const { className, comments, locale } = props;

    const renderComments = useMemo(
        () => comments.map((comment) => (
            <Comment
                authorAvatar={comment.authorAvatar}
                authorName={comment.authorName}
                date={comment.date}
                comment={comment.comment}
                authorId={comment.authorId}
                locale={locale}
            />
        )),
        [comments, locale],
    );

    return (
        <div className={cn(className, styles.wrapper)}>{renderComments}</div>
    );
};
