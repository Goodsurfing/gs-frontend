import { FC, useCallback } from "react";

import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AddButton } from "@/shared/ui/AddButton/AddButton";
import { CloseButton } from "@/shared/ui/CloseButton/CloseButton";
import ExtraControls from "../ExtraControls/ExtraControls";

import styles from "./LanguagesGroup.module.scss";
import Languages from "../Languages/Languages";
import { Language } from "@/types/languages";

interface LanguagesGroupProps {
    value: Language[];
    onChange: (value: Language[]) => void
}

const LanguagesGroup: FC<LanguagesGroupProps> = (props) => {
    const { value, onChange } = props;
    const { control } = useFormContext();
    const { t } = useTranslation("offer");

    const onAddBtnClick = useCallback(() => {
        if ((value[0].language === "not_matter") && (value[0].languageLevel === "not_matter")) {
            return;
        }
        if (value.length < 10) {
            onChange([...value, { language: "english", languageLevel: "not_matter" } as Language]);
        }
    }, [onChange, value]);

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
                        selectedLanguages={value}
                        onChange={(newValue) => {
                            const newLanguages = [...value];
                            newLanguages[index] = newValue;
                            if (newLanguages[0].language === "not_matter") {
                                onChange([newLanguages[0]]);
                                return;
                            }
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
                    <Controller
                        control={control}
                        name="needAllLanguages"
                        render={({ field }) => (
                            <ExtraControls value={field.value} onChange={field.onChange} />
                        )}
                    />
                )}
            </div>
            <div className="">
                <AddButton
                    text={t("whoNeeds.Добавить язык")}
                    onClick={onAddBtnClick}
                />
            </div>
        </div>
    );
};

export default LanguagesGroup;
