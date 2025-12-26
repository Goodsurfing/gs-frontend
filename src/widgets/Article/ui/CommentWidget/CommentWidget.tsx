import cn from "classnames";
import React, {
    ChangeEventHandler, FC, useCallback, useState,
} from "react";

import { CommentCount, CommentInput, CommentList } from "@/features/Article";

import styles from "./CommentWidget.module.scss";

interface CommentWidgetProps {
    className?: string;
}

export const CommentWidget: FC<CommentWidgetProps> = (
    props: CommentWidgetProps,
) => {
    const { className } = props;
    const [commentInput, setCommentInput] = useState<string>("");

    const handleCommentInput: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
        (event) => {
            setCommentInput(event.currentTarget.value);
        },
        [setCommentInput],
    );

    return (
        <div className={cn(className, styles.wrapper)}>
            <CommentCount count="0" className={styles.commentCount} />
            <CommentInput
                className={styles.commentInput}
                value={commentInput}
                onChange={handleCommentInput}
                onSend={() => {}}
            />
            <CommentList comments={[""]} className={styles.commentsList} />
        </div>
    );
};
