import React, { useState } from "react";

import AddButton from "@/UI/AddButton/AddButton";
import CloseButton from "@/UI/CloseButton/CloseButton";
import Switch from "@/UI/Switch/Switch";

import Languages from "../Languages/Languages";
import ExtraControls from "../ExtraControls/ExtraControls";

import styles from "./LanguagesGroup.module.scss";

const LanguagesGroup = () => {
    const [languagesCount, setLanguagesCount] = useState([0]);

    const onCloseBtnClick = (index: number) => {
        if (index === 0) return;
        setLanguagesCount(languagesCount.filter((_, i) => { return i !== index; }));
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.langsWrapper}>
                {languagesCount.map((_, index) => {
                    return (
                        <Languages
                            key={index}
                            close={(
                                <CloseButton
                                    sx={{
                                        minWidth: "36px",
                                        minHeight: "36px",
                                        mb: "8px",
                                    }}
                                    className={styles.closeBtn}
                                    onClick={() => { return onCloseBtnClick(index); }}
                                />
                            )}
                        />
                    );
                })}
                {languagesCount.length > 1 && (
                    <ExtraControls />
                )}
            </div>
            <div className="">
                <AddButton
                    onClick={() => {
                        return setLanguagesCount((prev) => {
                            return [...prev, 0];
                        });
                    }}
                >
                    Добавить язык
                </AddButton>
            </div>
        </div>
    );
};

export default LanguagesGroup;
