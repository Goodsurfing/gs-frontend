import React, {
    FC, KeyboardEvent, useState, ChangeEvent,
} from "react";

import styles from "./InputSelectedCountries.module.scss";

export const InputSelectedCountries: FC = () => {
    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>("");

    const setTagList = () => {
        const value = inputValue.trim();
        if (value && !tags.includes(value)) {
            setTags([...tags, value]);
        }
        setInputValue("");
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (["Enter", "Tab", ";"].includes(event.key)) {
            event.preventDefault();
            setTagList();
        }
    };

    const handleDelete = (index: number) => {
        const newTags = [...tags];
        newTags.splice(index, 1);
        setTags(newTags);
    };

    const handleOnBlur = () => {
        setTagList();
    };

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.title}>Выберите страны</h3>
            <div className={styles.tagInput}>
                <ul className={styles.tagList}>
                    {tags.map((tag, index) => (
                        <li key={tag}>
                            {tag}
                            <button type="button" onClick={() => { handleDelete(index); }}>
                                <div className={styles.deleteIcon} />
                            </button>
                        </li>
                    ))}
                </ul>
                <input
                    type="text"
                    placeholder="Укажите страны через запятую"
                    value={inputValue}
                    onKeyDown={handleKeyDown}
                    onBlur={handleOnBlur}
                    onChange={handleOnChange}
                />
            </div>
        </div>
    );
};
