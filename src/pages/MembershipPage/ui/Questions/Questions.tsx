import cn from "classnames";
import React, { FC } from "react";

import { useTranslation } from "react-i18next";
import { Accordion } from "@/shared/ui/Accordion/Accordion";

import { getMembershipFaq } from "../../lib/getMembershipFaq";
import styles from "./Questions.module.scss";

interface QuestionsProps {
    className?: string;
}

export const Questions: FC<QuestionsProps> = (props) => {
    const { className } = props;
    const { t } = useTranslation("membership");
    const questionData = getMembershipFaq(t);

    return (
        <div className={cn(className, styles.wrapper)}>
            <h2 className={styles.title}>
                {t("questions.Остались вопросы?")}
                <br />
                {t("questions.Сейчас ответим")}
            </h2>
            <Accordion data={questionData} className={styles.container} />
        </div>
    );
};
