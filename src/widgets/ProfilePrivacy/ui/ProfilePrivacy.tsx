import React, { FC, memo } from "react";

import {
    ProfileDeleteSwitch,
    ProfileHideSwitch,
    ProfileNewsletterSwitch,
} from "@/features/ProfilePrivacy";

import styles from "./ProfilePrivacy.module.scss";

export const ProfilePrivacy: FC = memo(() => (
    <div className={styles.wrapper}>
        <div className={styles.container}>
            <ProfileHideSwitch />
            <p className={styles.description}>
                Деактивировав аккаунт вы делаете его недоступным для остальных.
                Функции Гудсёрфинга становятся недоступными для вас. Если вы
                хост, то ваши проекты также деактивируются. Вы можете
                активировать аккаунт позже и всё вернуть.
            </p>
        </div>
        <div className={styles.container}>
            <ProfileNewsletterSwitch />
            <p className={styles.description}>
                Отказавшись от рассылки вы можете пропустить важные новости
                проекта, а также уникальные возможности.
            </p>
        </div>
        <div className={styles.container}>
            <ProfileDeleteSwitch />
            <div className={styles.iconContainer}>
                <div className={styles.errorLineIcon} />
                <p className={styles.description}>
                    Нажимая эту кнопку вы удаляете ваш аккаунт со всей
                    заполненной вами информацией. Восстановить её будет нельзя.
                    Только заново зарегистрироваться.
                </p>
            </div>
        </div>
    </div>
));
