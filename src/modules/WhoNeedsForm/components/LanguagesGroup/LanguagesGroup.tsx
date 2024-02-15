import { useCallback, useState } from "react";

import { AddButton } from "@/shared/ui/AddButton/AddButton";
import { CloseButton } from "@/shared/ui/CloseButton/CloseButton";

import Languages from "../Languages/Languages";
import ExtraControls from "../ExtraControls/ExtraControls";

import styles from "./LanguagesGroup.module.scss";

const LanguagesGroup = () => {
    const [languagesCount, setLanguagesCount] = useState([0]);

    const onCloseBtnClick = useCallback((index: number) => {
        if (index === 0) return;
        setLanguagesCount(languagesCount.filter((_, i) => i !== index));
    }, [languagesCount]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.langsWrapper}>
                {languagesCount.map((_, index) => (
                    <Languages
                        key={index}
                        close={(
                            <CloseButton
                                className={styles.closeBtn}
                                onClick={() => onCloseBtnClick(index)}
                            />
                        )}
                    />
                ))}
                {languagesCount.length > 1 && (
                    <ExtraControls />
                )}
            </div>
            <div className="">
                <AddButton
                    text="Добавить язык"
                    onClick={() => setLanguagesCount((prev) => [...prev, 0])}
                />
            </div>
        </div>
    );
};

export default LanguagesGroup;
