import cn from "classnames";
import React, {
    ChangeEventHandler, FC, useCallback, useState,
} from "react";

import { useTranslation } from "react-i18next";
import {
    CommentCount, CommentInput, CommentList, Comments,
} from "@/features/Article";

import { ShowNext } from "@/shared/ui/ShowNext/ShowNext";
import styles from "./CommentWidget.module.scss";

interface CommentWidgetProps {
    className?: string;
    commentsCount: number;
    onSend: (value: string) => void;
    onNextComments: () => void;
    comments: Comments[];
    total?: number;
}

export const CommentWidget: FC<CommentWidgetProps> = (
    props: CommentWidgetProps,
) => {
    const {
        className, onSend, commentsCount, comments, onNextComments, total,
    } = props;
    const { t } = useTranslation();
    const [commentInput, setCommentInput] = useState<string>("");

    const handleCommentInput: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
        (event) => {
            setCommentInput(event.currentTarget.value);
        },
        [setCommentInput],
    );

    return (
        <div className={cn(className, styles.wrapper)}>
            <CommentCount count={commentsCount} className={styles.commentCount} />
            <CommentInput
                className={styles.commentInput}
                value={commentInput}
                onChange={handleCommentInput}
                onSend={(comment) => {
                    onSend(comment);
                    setCommentInput("");
                }}
                btnText={t("Написать комментарий")}
            />
            <CommentList comments={comments} className={styles.commentsList} />
            {(comments.length > 0) && (total !== undefined)
            && (comments.length < total) && (
                <ShowNext onClick={onNextComments} />
            )}
        </div>
    );
};
