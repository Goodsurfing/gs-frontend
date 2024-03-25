import cn from "classnames";
import React, { FC, useMemo } from "react";

import defaultImage from "@/shared/assets/images/personalCardMOCK.png";

import { Comment } from "../Comment/Comment";
import styles from "./CommentList.module.scss";

interface CommentListProps {
    className?: string;
    comments: any[];
}

export const CommentList: FC<CommentListProps> = (props: CommentListProps) => {
    const { className, comments } = props;

    const renderComments = useMemo(
        () => comments.map(() => (
            <Comment
                authorAvatar={defaultImage}
                authorName="Алексей Петров"
                date="17 мая 2023"
                comment="Tremblant is based in Canada and has over 90 runs servicing millions of skiers each year. With 13 state-of-the-art ski lifts and a selection of choices for both snowboarders and skiers Tremblant attained its reputation through daring, varied runs catering for a selection of abilities and preferences. With its longest run being 6km long, you cannot help but picture Tremblant as the skiing capital of Canada. Tremblant has also recently had 18 acres of quality."
            />
        )),
        [comments],
    );

    return (
        <div className={cn(className, styles.wrapper)}>{renderComments}</div>
    );
};
