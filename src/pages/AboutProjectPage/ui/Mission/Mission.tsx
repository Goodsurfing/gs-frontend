import cn from "classnames";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import Button from "@/shared/ui/Button/Button";

import styles from "./Mission.module.scss";

interface MissionProps {
    className?: string;
}

export const Mission: FC<MissionProps> = (props: MissionProps) => {
    const { className } = props;
    const { t } = useTranslation("about-project");
    return (
        <section className={cn(className, styles.wrapper)}>
            <h2 className={styles.title}>{t("Миссия ГудСёрфинга")}</h2>
            <p className={styles.description}>
                {t(
                    "Миссия Гудсёрфинга – развитие выездного добровольчества в России и мире с помощью создания удобного веб-сервиса и распространения информации о подобных возможностях. Национальные парки и заповедники, археологические экспедиции, туристические станции и кемпинги, фермы и благотворительные организации часто привлекают к своей деятельности волонтёров. Это помогает их развитию и вовлекает новых людей в их деятельность. Волонтёры, таким образом не просто помогают своим трудом, но и узнают много нового о принципах работы этих организаций, получают навыки экспедиционной и природоохранной деятельности. Некоммерческим, бюджетным и прочим организациям, а также частным лицам тяжело найти подходящих волонтёров для участия в своём проекте. Тем, кто хочет совместить полезную деятельность с путешествием, трудно найти подходящие предложение, а также убедиться в его надёжности и полноте информации, так как даже в этой сфере уже появились мошенники.",
                )}
            </p>
            <Button
                className={styles.button}
                color="BLUE"
                size="MEDIUM"
                variant="FILL"
            >
                {t("О некоммерческой организации")}
            </Button>
        </section>
    );
};
