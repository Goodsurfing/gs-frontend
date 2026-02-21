import React, { FC } from "react";
import cn from "classnames";
import CustomLink from "@/shared/ui/Link/Link";
import { getVolunteerPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import styles from "./Comment.module.scss";

interface CommentProps {
    className?: string;
    comment: string;
    authorId: string;
    authorAvatar?: string;
    authorName: string;
    date: string;
    locale: Locale;
}

export const Comment: FC<CommentProps> = (props: CommentProps) => {
    const {
        className, authorAvatar, authorName, comment, date, authorId,
        locale,
    } = props;
    return (
        <div className={cn(className, styles.wrapper)}>
            <span className={styles.comment}>{comment}</span>
            <div className={styles.wrapperInfo}>
                <CustomLink to={getVolunteerPersonalPageUrl(locale, authorId)} variant="DEFAULT" className={styles.wrapperAuthor}>
                    {authorAvatar ? (
                        <img src={authorAvatar} alt="" className={styles.authorAvatar} />
                    ) : (
                        <div className={styles.noImg} />
                    )}
                    <span className={styles.authorName}>{authorName}</span>
                </CustomLink>
                <span className={styles.date}>
                    /
                    {date}
                </span>
            </div>
        </div>
    );
};
