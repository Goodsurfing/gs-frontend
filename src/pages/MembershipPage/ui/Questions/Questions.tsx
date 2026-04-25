import cn from "classnames";
import React, { FC } from "react";

import { useTranslation } from "react-i18next";
import { Accordion, AccordionData } from "@/shared/ui/Accordion/Accordion";

import styles from "./Questions.module.scss";

const questionData: AccordionData[] = [
    {
        title: "Почему я должен платить, если я и так помогаю как волонтёр?",
        description:
            "Ваш членский взнос идёт на поддержку инфраструктуры проекта: разработку сайта, создание контента, организацию мероприятий и юридическую поддержку. Так вы помогаете Гудсёрфингу расти и становиться лучше для всех участников.",
    },
    {
        title: "Что будет, если я не продлю членство?",
        description:
            "Вы всегда можете оставаться частью сообщества, читать блог и участвовать в открытых мероприятиях. Однако доступ к волонтёрским проектам и закрытым материалам будет ограничен до момента продления членства.",
    },
    {
        title: "Куда идут мои деньги?",
        description:
            "Мы — некоммерческая организация, и все средства направляются на развитие проекта. Вы можете ознакомиться с нашими отчётами и финансовой информацией в разделе «Об НКО».",
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
                {t("questions.Остались вопросы?")}
                <br />
                {t("questions.Сейчас ответим")}
            </h2>
            <Accordion data={questionData} className={styles.container} />
        </div>
    );
};
