import AOS from "aos";
import "aos/dist/aos.css";
import cn from "classnames";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import whatReturn1 from "@/shared/assets/images/become-host/whatReturn1.webp";
import whatReturn2 from "@/shared/assets/images/become-host/whatReturn2.webp";
import whatReturn3 from "@/shared/assets/images/become-host/whatReturn3.webp";

import styles from "./WhatReturn.module.scss";

export const WhatReturn = () => {
    const { t } = useTranslation("become-host");

    useEffect(() => {
        AOS.init({ duration: 2000, once: true, delay: 200 });

        return () => {
            AOS.refreshHard();
        };
    });

    return (
        <div className={styles.wrapper}>
            <div className={styles.top}>
                <h2>{t("Что вы предлагаете взамен")}</h2>
                <p>
                    {t("Нужно понимать, что работа с гудсёрферами, как и с волонтёрами – это взаимный процесс. Чем больше вы сможете предложить, тем более вероятно вы сможете привлечь талантливых и трудолюбивых гудсёрферов.")}
                </p>
            </div>
            <div className={styles.mid}>
                <div className={cn(styles.mark, styles.left)}>
                    <div className={styles.circle}>
                        <span>{t("25 часов")}</span>
                    </div>
                    <span>{t("помощи в неделю в среднем запрашивают наши хосты")}</span>
                </div>
                <div className={styles.mark}>
                    <div className={styles.circle}>
                        <span>{t("На 2-4 недели")}</span>
                    </div>
                    <span>{t("в среднем приглашают гудсёрферов")}</span>
                </div>
            </div>
            <div className={styles.bottom}>
                <p>
                    {t("Основой является предложение питания, проживания и культурный обмен")}
                </p>
                <div className={styles.content}>
                    <div className={styles.item} data-aos="flip-left">
                        <img src={whatReturn1} alt="whatReturn1" />
                        <p>{t("Проживание")}</p>
                        <ul>
                            <li>{t("Отдельный дом")}</li>
                            <li>{t("Комната")}</li>
                            <li>{t("Койко-место")}</li>
                            <li>{t("Палатка")}</li>
                            <li>{t("Место под палатку")}</li>
                        </ul>
                    </div>
                    <div className={styles.item}>
                        <img src={whatReturn2} alt="whatReturn2" data-aos="flip-right" />
                        <p>{t("Питание")}</p>
                        <ul>
                            <li>{t("Полный пансион")}</li>
                            <li>{t("Завтрак включен")}</li>
                            <li>{t("Продукты")}</li>
                            <li>{t("Вегетарианское")}</li>
                        </ul>
                    </div>
                    <div className={styles.item}>
                        <img src={whatReturn3} alt="whatReturn3" data-aos="flip-left" />
                        <p>{t("Культурный обмен")}</p>
                        <span>
                            {t("Взаимодействие и взаимное развитие между волонтерами и принимающей стороной")}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
