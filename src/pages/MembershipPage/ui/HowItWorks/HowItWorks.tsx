import React, { FC } from "react";
import cn from "classnames";
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
    return (
        <section className={cn(className, styles.wrapper)}>
            <h2 className={styles.title}>Как это работает</h2>
            <p className={styles.description}>
                С оформленным членством Гудсёрфинга вы можете пользоваться всеми
                возможностями нашего сервиса без каких-либо ограничений.
            </p>
            <div className={styles.items}>
                <Item image={plannerIcon} title="1. Оплачиваете годовое членство" />
                <Item image={okIcon} title="2. Проходите верификацию сервисом и получаете специальный значок на свою страницу" />
                <Item image={listIcon} title="3. Выбираете хосты на сервисе без ограничений" />
                <Item image={likeIcon} title="4. Хосты смотрят на вашу верификацию и отдают вам предпочтения" />
                <Item image={smsIcon} title="5. При необходимости пользуетесь чатом поддержки для планирования своего путешествия" />
                <Item image={globeIcon} title="6. Делаете доброе дело и получаете незабываемые впечатления" />
            </div>
        </section>
    );
};
