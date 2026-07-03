import React, { FC } from "react";
import cn from "classnames";
import { useTranslation } from "react-i18next";

import globeIcon from "@/shared/assets/images/membership/flat-color-icons_globe.svg";
import likeIcon from "@/shared/assets/images/membership/flat-color-icons_like.svg";
import okIcon from "@/shared/assets/images/membership/flat-color-icons_ok.svg";
import plannerIcon from "@/shared/assets/images/membership/flat-color-icons_planner.svg";
import smsIcon from "@/shared/assets/images/membership/flat-color-icons_sms.svg";
import todoListIcon from "@/shared/assets/images/membership/flat-color-icons_todo-list.svg";

import styles from "./HowItWorks.module.scss";

interface HowItWorksProps {
    className?: string;
}

export const HowItWorks: FC<HowItWorksProps> = (props) => {
    const { className } = props;
    const { t } = useTranslation("membership");

    const steps = [
        {
            icon: plannerIcon,
            text: t("how-it-works.1. Оплачиваете годовое членство"),
        },
        {
            icon: okIcon,
            text: t("how-it-works.2. Проходите верификацию сервисом и получаете специальный значок на свою страницу"),
        },
        {
            icon: todoListIcon,
            text: t("how-it-works.3. Выбираете хосты на сервисе без ограничений"),
        },
        {
            icon: likeIcon,
            text: t("how-it-works.4. Хосты смотрят на вашу верификацию и отдают вам предпочтения"),
        },
        {
            icon: smsIcon,
            text: t("how-it-works.5. При необходимости пользуетесь чатом поддержки для планирования своего путешествия"),
        },
        {
            icon: globeIcon,
            text: t("how-it-works.6. Делаете доброе дело и получаете незабываемые впечатления"),
        },
    ];

    return (
        <section className={cn(className, styles.wrapper)}>
            <div className={styles.inner}>
                <h2 className={styles.title}>{t("how-it-works.Как это работает")}</h2>
                <p className={styles.description}>
                    {t("how-it-works.С оформленным членством Гудсёрфинга вы можете пользоваться всеми возможностями нашего сервиса без каких-либо ограничений.")}
                </p>
                <div className={styles.grid}>
                    {steps.map((step, idx) => (
                        <div key={idx} className={styles.step}>
                            <div className={styles.stepIconWrapper}>
                                <img
                                    className={styles.stepIcon}
                                    src={step.icon}
                                    alt=""
                                    aria-hidden="true"
                                />
                            </div>
                            <p className={styles.stepText}>{step.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
