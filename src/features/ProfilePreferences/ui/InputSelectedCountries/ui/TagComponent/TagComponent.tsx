import React, { FC, memo, useCallback } from "react";
import { useTranslation } from "react-i18next";

import styles from "./TagComponent.module.scss";

interface TagComponentProps {
    tag: string;
    index: number;
    handleDelete: (index: number) => void;
}

export const TagComponent: FC<TagComponentProps> = memo((props: TagComponentProps) => {
    const { tag, handleDelete, index } = props;
    const { t } = useTranslation("profile");

    const onHandleDelete = useCallback(() => {
        handleDelete(index);
    }, [index, handleDelete]);

    return (
        <li className={styles.tagWrapper} key={tag}>
            {tag}
            <button
                type="button"
                onClick={onHandleDelete}
                aria-label={t("preferences.Удалить {{tag}}", { tag })}
            >
                <div className={styles.deleteIcon} />
            </button>
        </li>
    );
});
