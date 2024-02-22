import React, { FC } from "react";
import cn from "classnames";
import { useTranslation } from "react-i18next";
import { Item } from "../Item/Item";

import plannerIcon from "@/shared/assets/images/membership/flat-color-icons_planner.svg";
import okIcon from "@/shared/assets/images/membership/flat-color-icons_ok.svg";
import listIcon from "@/shared/assets/images/membership/flat-color-icons_todo-list.svg";
import likeIcon from "@/shared/assets/images/membership/flat-color-icons_like.svg";
import smsIcon from "@/shared/assets/images/membership/flat-color-icons_sms.svg";
import globeIcon from "@/shared/assets/images/membership/flat-color-icons_globe.svg";
import styles from "./HowItWorks.module.scss";

interface HowItWorksProps {
    className?: string;
}

export const HowItWorks: FC<HowItWorksProps> = (props) => {
    const { className } = props;
    const { t } = useTranslation("membership");
    return (
        <section className={cn(className, styles.wrapper)}>
            <h2 className={styles.title}>{t("how-it-works.Как это работает")}</h2>
            <p className={styles.description}>
                {t("how-it-works.С оформленным членством Гудсёрфинга вы можете пользоваться всеми возможностями нашего сервиса без каких-либо ограничений.")}
            </p>
            <div className={styles.items}>
                <Item image={plannerIcon} title={t("how-it-works.1. Оплачиваете годовое членство")} />
                <Item image={okIcon} title={t("how-it-works.2. Проходите верификацию сервисом и получаете специальный значок на свою страницу")} />
                <Item image={listIcon} title={t("how-it-works.3. Выбираете хосты на сервисе без ограничений")} />
                <Item image={likeIcon} title={t("how-it-works.4. Хосты смотрят на вашу верификацию и отдают вам предпочтения")} />
                <Item image={smsIcon} title={t("how-it-works.5. При необходимости пользуетесь чатом поддержки для планирования своего путешествия")} />
                <Item image={globeIcon} title={t("how-it-works.6. Делаете доброе дело и получаете незабываемые впечатления")} />
            </div>
        </section>
    );
};
