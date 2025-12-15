import cn from "classnames";
import React, {
    FC,
    memo,
    useCallback,
    useMemo,
    useState,
} from "react";

import { useTranslation } from "react-i18next";
import { HandySvg } from "@handy-ones/handy-svg";
import deleteIcon from "@/shared/assets/icons/delete.svg";

import { LanguageLevelComponent } from "../LanguageLevelComponent/LanguageLevelComponent";
import styles from "./VolunteerLanguage.module.scss";
import { AddButton } from "@/shared/ui/AddButton/AddButton";
import { Language } from "@/types/languages";

interface VolunteerLanguageProps {
    value?: Language[];
    onChange: (value: Language[]) => void;
    className?: string;
}

export const VolunteerLanguage: FC<VolunteerLanguageProps> = memo(
    (props: VolunteerLanguageProps) => {
        const { className, value, onChange } = props;
        const { t } = useTranslation("volunteer");
        const [mainLanguageSkills, setMainLanguageSkills] = useState<
        Language | undefined
        >(undefined);
        const isDisabledButton = !mainLanguageSkills
            || !mainLanguageSkills?.language
            || !mainLanguageSkills?.level;

        const handleMainLanguageChange = (item: Language) => {
            setMainLanguageSkills(item);
        };

        const handleClearMainLanguageChange = () => {
            setMainLanguageSkills(undefined);
        };

        const handleAddLanguage = () => {
            if (mainLanguageSkills && (value?.length || 0) <= 10) {
                onChange([...(value || []), mainLanguageSkills]);
                setMainLanguageSkills(undefined);
            }
        };

        const handleDeleteLanguage = useCallback(
            (index: number) => {
                const newValue = value?.filter((item, i) => i !== index) || [];
                onChange(newValue);
            },
            [onChange, value],
        );

        const handleUpdateLanguage = useCallback(
            (updatedItem: Language, index: number) => {
                const newValue = value?.map((item, i) => (i === index ? updatedItem : item)) || [];
                onChange(newValue);
            },
            [value, onChange],
        );

        const renderLanguageLevelComponents = useMemo(
            () => value?.map((item, index) => (
                <div className={styles.wrapperLanguageComponent} key={index}>
                    <LanguageLevelComponent
                        value={item}
                        onChange={(updatedItem) => {
                            handleUpdateLanguage(updatedItem, index);
                        }}
                        isTitle={false}
                    />
                    <HandySvg
                        className={styles.deleteIcon}
                        onClick={() => handleDeleteLanguage(index)}
                        src={deleteIcon}
                        alt="delete"
                    />
                </div>
            )),
            [handleUpdateLanguage, value, handleDeleteLanguage],
        );

        return (
            <div className={cn(className, styles.wrapper)}>
                <div className={styles.wrapperLanguageComponent}>
                    <LanguageLevelComponent
                        value={mainLanguageSkills}
                        onChange={(item) => handleMainLanguageChange(item)}
                    />
                    {!isDisabledButton && (
                        <img
                            className={styles.deleteIcon}
                            onClick={() => handleClearMainLanguageChange()}
                            src={deleteIcon}
                            alt="delete"
                        />
                    )}
                </div>
                <div className={styles.container}>
                    {renderLanguageLevelComponents}
                </div>
                <AddButton
                    text={t("volunteer-skills.Добавить язык")}
                    className={styles.button}
                    onClick={handleAddLanguage}
                    disabled={isDisabledButton}
                />
            </div>
        );
    },
);
