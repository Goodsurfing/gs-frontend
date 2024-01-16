import cn from "classnames";
import React, { FC } from "react";

import { useTranslation } from "react-i18next";
import { Accordion, AccordionData } from "@/shared/ui/Accordion/Accordion";

import styles from "./Questions.module.scss";

const questionData: AccordionData[] = [
    {
        title: "Какие преимущества даёт членство Гудсёрфинга?",
        description:
            "Членство Гудсёрфинга даёт неограниченный доступ ко всем направлениям и видам путешествий, прямое общение с хостом, поддержку в путешествиях со стороны Гудсёрфинга, доступ к образовательным материалам.",
    },
    {
        title: "Какие преимущества даёт членство Гудсёрфинга?",
        description:
            "Членство Гудсёрфинга даёт неограниченный доступ ко всем направлениям и видам путешествий, прямое общение с хостом, поддержку в путешествиях со стороны Гудсёрфинга, доступ к образовательным материалам.",
    },
    {
        title: "Какие преимущества даёт членство Гудсёрфинга?",
        description:
            "Членство Гудсёрфинга даёт неограниченный доступ ко всем направлениям и видам путешествий, прямое общение с хостом, поддержку в путешествиях со стороны Гудсёрфинга, доступ к образовательным материалам.",
    },
];

interface QuestionsProps {
    className?: string;
}

export const Questions: FC<QuestionsProps> = (props) => {
    const { className } = props;
    const { t } = useTranslation("membership");
    return (
        <div className={cn(className, styles.wrapper)}>
            <h2 className={styles.title}>
                {t("Остались вопросы?")}
                <br />
                {t("Сейчас ответим")}
            </h2>
            <Accordion data={questionData} className={styles.container} />
        </div>
    );
};
