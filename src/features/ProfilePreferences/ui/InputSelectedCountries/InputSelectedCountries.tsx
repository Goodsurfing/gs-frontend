import React, { FC, useRef, useState } from "react";

import styles from "./InputSelectedCountries.module.scss";

export const InputSelectedCountries:FC = () => {
    const [tags, setTags] = useState([]);

    const handleKeyDown = (evt) => {
        if (["Enter", "Tab", ","].includes(evt.key)) {
            evt.preventDefault();

            const value = evt.target.value.trim();
            if (value && !tags.includes(value)) {
                setTags([...tags, value]);
            }
            evt.target.value = "";
        }
    };

    const handleDelete = (i) => {
        const newTags = [...tags];
        newTags.splice(i, 1);
        setTags(newTags);
    };

    return (
        <div className={styles.tagInput}>
            <ul className={styles.tagList}>
                {tags.map((tag, i) => (
                    <li key={tag}>
                        {tag}
                        <button type="button" onClick={() => { handleDelete(i); }}>+</button>
                    </li>
                ))}
            </ul>
            <input type="text" onKeyDown={handleKeyDown} onBlur={handleKeyDown} />
        </div>
    );
};
