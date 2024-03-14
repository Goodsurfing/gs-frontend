import React, { FC } from "react";

import { useTranslation } from "react-i18next";
import Input from "@/shared/ui/Input/Input";

import styles from "./OfferQuestionnaire.module.scss";

interface OfferQuestionnaireProps {
    value: string;
    onChange: (value: string) => void;
}

export const OfferQuestionnaire: FC<OfferQuestionnaireProps> = (
    props: OfferQuestionnaireProps,
) => {
    const { value, onChange } = props;
    const { t } = useTranslation("offer");
    return (
        <div className={styles.wrapper}>
            <Input
                label={t("finishingTouches.Вы можете добавить стандартные вопросы волонтёру или ссылку на анкету, которую он должен заполнить и отправить. Данное сообщение будет автоматически отправляться всем соискателям после того, как они нажмут кнопку «Участвовать».")}
                description={t("finishingTouches.Добавить ссылку на анкету")}
                onChange={(e) => onChange(e.target.value)}
                value={value}
            />
        </div>
    );
};
