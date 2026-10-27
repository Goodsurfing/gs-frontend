import React from "react";
import { useTranslation } from "react-i18next";

import Button from "@/shared/ui/Button/Button";

import styles from "./Header.module.scss";

export const Header = () => {
    const { t } = useTranslation("academy");

    const handleScrollToCourses = () => {
        const coursesSection = document.getElementById("courses");
        if (coursesSection) {
            const elementPosition = coursesSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - 60;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <h1>{t("Учитесь гудсёрфингу вместе с нами!")}</h1>
                <p>
                    {t("Goodsurfing — способ путешествовать недорого, занимаясь интересным и важным делом с помощью волонтёрства или экспедиций")}
                </p>
                <Button
                    className={styles.button}
                    color="GREEN"
                    size="MEDIUM"
                    variant="FILL"
                    onClick={handleScrollToCourses}
                >
                    {t("Выбрать курс")}
                </Button>
            </div>
        </div>
    );
};
