import cn from "classnames";
import React, { FC, useMemo } from "react";

import { Comment } from "../Comment/Comment";
import styles from "./CommentList.module.scss";
import { Comments } from "../../model/types/articleSchema";

interface CommentListProps {
    className?: string;
    comments: Comments[];
}

export const CommentList: FC<CommentListProps> = (props: CommentListProps) => {
    const { className, comments } = props;

    const renderComments = useMemo(
        () => comments.map((comment) => (
            <Comment
                authorAvatar={comment.authorAvatar}
                authorName={comment.authorName}
                date={comment.date}
                comment={comment.comment}
            />
        )),
        [comments],
    );

    return (
        <div className={cn(className, styles.wrapper)}>{renderComments}</div>
    );
};
