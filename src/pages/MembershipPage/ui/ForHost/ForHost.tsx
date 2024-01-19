import cn from "classnames";
import React, { FC } from "react";

import { useTranslation } from "react-i18next";
import checkIcon from "@/shared/assets/icons/select-check.svg";
import Button from "@/shared/ui/Button/Button";

import styles from "./ForHost.module.scss";

interface ForHostProps {
    className?: string;
}

export const ForHost: FC<ForHostProps> = (props: ForHostProps) => {
    const { className } = props;
    const { t } = useTranslation("membership");
    return (
        <section className={cn(className, styles.wrapper)}>
            <h2 className={styles.title}>{t("for-host.Для организатора")}</h2>
            <div className={styles.table}>
                <div className={styles.column}>
                    <div className={styles.columnHeader}>
                        <h2 className={styles.columnTitle}>{t("for-host.Без членства")}</h2>
                        <span className={styles.price}>
                            0
                            {" "}
                            <span className={styles.smallPrice}>руб/год</span>
                        </span>
                    </div>
                    <div className={styles.columnContent}>
                        <div className={styles.row}>
                            <span>
                                {t("for-host.Количество бесплатных объявлений на платформе «Гудсёрфинг»")}
                            </span>
                            <span className={styles.blueText}>
                                {t("for-host.1 объявление в год")}
                            </span>
                        </div>
                        <div className={styles.row}>
                            <span>
                                {t("for-host.Участие в онлайн-мероприятиях «Гудсёрфинг»")}
                            </span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                        <div className={styles.row}>
                            <span>{t("for-host.Доступ к Академии «Гудсёрфинг»")}</span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                        <div className={styles.row}>
                            <span>{t("for-host.Доступ к блогу «Гудсёрфинг»")}</span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                    </div>
                    <div className={styles.columnFooter}>
                        <Button color="BLUE" size="SMALL" variant="FILL">
                            {t("for-host.Зарегистрироваться")}
                        </Button>
                    </div>
                </div>
                <div className={styles.column}>
                    <div className={styles.columnHeader}>
                        <h2 className={styles.columnTitle}>{t("for-host.Членство")}</h2>
                        <span className={styles.price}>
                            1 500
                            {" "}
                            <span className={styles.smallPrice}>руб/год</span>
                        </span>
                    </div>
                    <div className={styles.columnContent}>
                        <div className={styles.row}>
                            <span>
                                {t("for-host.Количество бесплатных объявлений на платформе «Гудсёрфинг»")}
                            </span>
                            <span className={styles.blueText}>
                                {t("for-host.не ограничено")}
                            </span>
                        </div>
                        <div className={styles.row}>
                            <span>
                                {t("for-host.Доступ к уникальным чатам платформы «Гудсёрфинг»")}
                            </span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                        <div className={styles.row}>
                            <span>{t("for-host.Доступ к Академии «Гудсёрфинг»")}</span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                        <div className={styles.row}>
                            <span>
                                {t("for-host.Получение статуса амбассадора (при выполнении условий)")}
                            </span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                        <div className={styles.row}>
                            <span>
                                {t("for-host.Участие в онлайн-мероприятиях «Гудсёрфинг»")}
                            </span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                        <div className={styles.row}>
                            <span>
                                {t("for-host.Участие в офлайн-мероприятиях «Гудсёрфинг»")}
                            </span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                        <div className={styles.row}>
                            <span>
                                {t("for-host.Повышенное доверие волонтёров при выборе проекта для участия (специальная метка в профиле)")}
                            </span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                        <div className={styles.row}>
                            <span>{t("for-host.Доступ к блогу «Гудсёрфинг»")}</span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                        <div className={styles.row}>
                            <span>
                                {t("for-host.Скидка для размещения рекламы и объявлений по платным тарифам на платформе «Гудсёрфинг»")}
                            </span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                    </div>
                    <div className={styles.columnFooter}>
                        <Button color="GREEN" size="SMALL" variant="FILL">
                            {t("for-host.Получить членство")}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};
