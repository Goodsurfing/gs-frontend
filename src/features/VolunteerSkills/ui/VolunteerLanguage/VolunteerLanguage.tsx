import { IconButton } from "@mui/material";
import cn from "classnames";
import React, {
    FC,
    memo,
    useCallback,
    useMemo,
    useState,
} from "react";

import deleteIcon from "@/shared/assets/icons/delete.svg";
import plusIcon from "@/shared/assets/icons/plus-icon.svg";
import IconComponent from "@/shared/ui/IconComponent/IconComponent";

import { LanguageSkills } from "../../model/types/volunteerSkills";
import { LanguageLevelComponent } from "../LanguageLevelComponent/LanguageLevelComponent";
import styles from "./VolunteerLanguage.module.scss";

interface VolunteerLanguageProps {
    value?: LanguageSkills[];
    onChange: (value: LanguageSkills[]) => void;
    className?: string;
}

export const VolunteerLanguage: FC<VolunteerLanguageProps> = memo(
    (props: VolunteerLanguageProps) => {
        const { className, value, onChange } = props;
        const [mainLanguageSkills, setMainLanguageSkills] = useState<
        LanguageSkills | undefined
        >(undefined);
        const isDisabledButton = !mainLanguageSkills
            || !mainLanguageSkills?.language
            || !mainLanguageSkills?.level;

        const handleMainLanguageChange = (item: LanguageSkills) => {
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
            (updatedItem: LanguageSkills, index: number) => {
                const newValue = value?.map((item, i) => (i === index ? updatedItem : item)) || [];
                onChange(newValue);
            },
            [value, onChange],
        );

        const renderLanguageLevelComponents = useMemo(
            () => value?.map((item, index) => (
                <div className={styles.wrapperLanguageComponent}>
                    <LanguageLevelComponent
                        key={index}
                        value={item}
                        onChange={(updatedItem) => {
                            handleUpdateLanguage(updatedItem, index);
                        }}
                        isTitle={false}
                    />
                    <img
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
                <IconButton
                    className={styles.button}
                    onClick={handleAddLanguage}
                    disabled={isDisabledButton}
                >
                    <IconComponent
                        icon={plusIcon}
                        className={styles.plus}
                        alt="add"
                    />
                    {" "}
                    Добавить язык
                </IconButton>
            </div>
        );
    },
);
