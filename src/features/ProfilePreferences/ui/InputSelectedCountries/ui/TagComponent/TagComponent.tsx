import React, { FC, memo, useCallback } from "react";

import styles from "./TagComponent.module.scss";

interface TagComponentProps {
    tag: string;
    index: number;
    handleDelete: (index: number) => void;
}

export const TagComponent: FC<TagComponentProps> = memo((props: TagComponentProps) => {
    const { tag, handleDelete, index } = props;

    const onHandleDelete = useCallback(() => {
        handleDelete(index);
    }, [index, handleDelete]);

    return (
        <li key={tag}>
            {tag}
            <button
                type="button"
                onClick={onHandleDelete}
            >
                <div className={styles.deleteIcon} />
            </button>
        </li>
    );
});
