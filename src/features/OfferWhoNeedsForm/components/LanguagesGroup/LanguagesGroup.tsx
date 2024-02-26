import { FC, useCallback } from "react";

import { AddButton } from "@/shared/ui/AddButton/AddButton";
import { CloseButton } from "@/shared/ui/CloseButton/CloseButton";
import { Languages as ILanguages, Language } from "@/entities/Offer/model/types/offerWhoNeeds";
import ExtraControls from "../ExtraControls/ExtraControls";

import styles from "./LanguagesGroup.module.scss";
import Languages from "../Languages/Languages";

interface LanguagesGroupProps {
    value: ILanguages;
    onChange: (value: ILanguages) => void
}

const LanguagesGroup: FC<LanguagesGroupProps> = (props) => {
    const { value, onChange } = props;

    const onCloseBtnClick = useCallback((index: number) => {
        if (index === 0) return;
        const newValue = [...value];
        newValue.splice(index, 1);
        onChange(newValue);
    }, [value, onChange]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.langsWrapper}>
                {value.map((valueLanguage, index) => (
                    <Languages
                        key={index}
                        value={valueLanguage}
                        onChange={(newValue) => {
                            const newLanguages = [...value];
                            newLanguages[index] = newValue;
                            onChange(newLanguages);
                        }}
                        close={(
                            <CloseButton
                                className={styles.closeBtn}
                                onClick={() => onCloseBtnClick(index)}
                            />
                        )}
                    />
                ))}
                {value.length > 1 && (
                    <ExtraControls />
                )}
            </div>
            <div className="">
                <AddButton
                    text="Добавить язык"
                    onClick={() => onChange([...value, { language: "Английский", level: "not_matter" } as Language])}
                />
            </div>
        </div>
    );
};

export default LanguagesGroup;
