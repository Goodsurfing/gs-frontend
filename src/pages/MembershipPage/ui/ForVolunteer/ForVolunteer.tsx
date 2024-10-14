import cn from "classnames";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";
import checkIcon from "@/shared/assets/icons/select-check.svg";
import Button from "@/shared/ui/Button/Button";

import styles from "./ForVolunteer.module.scss";
import { getProfileRolePagePageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

interface ForVolunteerProps {
    className?: string;
}

export const ForVolunteer: FC<ForVolunteerProps> = (
    props: ForVolunteerProps,
) => {
    const { className } = props;
    const { t } = useTranslation("membership");
    const navigate = useNavigate();
    const { locale } = useLocale();

    const handleNavigateToRole = () => {
        navigate(getProfileRolePagePageUrl(locale));
    };

    return (
        <section className={cn(className, styles.wrapper)}>
            <h2 className={styles.title}>{t("for-volunteer.Для волонтёра")}</h2>
            <div className={styles.table}>
                <div className={styles.column}>
                    <div className={styles.columnHeader}>
                        <h2 className={styles.columnTitle}>
                            {t("for-volunteer.Без членства")}
                        </h2>
                        <span className={styles.price}>
                            0
                            {" "}
                            <span className={styles.smallPrice}>руб/год</span>
                        </span>
                    </div>
                    <div className={styles.columnContent}>
                        <div className={styles.row}>
                            <span>
                                {t(
                                    "for-volunteer.Отклик на волонтёрские вакансии через платформу «Гудсёрфинг»",
                                )}
                            </span>
                            <span className={styles.blueText}>
                                {t("for-volunteer.1 раз в год")}
                            </span>
                        </div>
                        <div className={styles.row}>
                            <span>
                                {t(
                                    "for-volunteer.Участие в онлайн-мероприятиях «Гудсёрфинг»",
                                )}
                            </span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                        <div className={styles.row}>
                            <span>{t("for-volunteer.Доступ к Академии «Гудсёрфинг»")}</span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                        <div className={styles.row}>
                            <span>{t("for-volunteer.Доступ к блогу «Гудсёрфинг»")}</span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                    </div>
                    <div className={styles.columnFooter}>
                        <Button color="BLUE" size="SMALL" variant="FILL" onClick={handleNavigateToRole}>
                            {t("for-volunteer.Зарегистрироваться")}
                        </Button>
                    </div>
                </div>
                <div className={styles.column}>
                    <div className={styles.columnHeader}>
                        <h2 className={styles.columnTitle}>{t("for-volunteer.Членство")}</h2>
                        <span className={styles.price}>
                            1 500
                            {" "}
                            <span className={styles.smallPrice}>руб/год</span>
                        </span>
                    </div>
                    <div className={styles.columnContent}>
                        <div className={styles.row}>
                            <span>
                                {t(
                                    "for-volunteer.Отклик на волонтёрские вакансии через платформу «Гудсёрфинг»",
                                )}
                            </span>
                            <span className={styles.blueText}>
                                {t("for-volunteer.не ограничено")}
                            </span>
                        </div>
                        <div className={styles.row}>
                            <span>
                                {t(
                                    "for-volunteer.Доступ к уникальным волонтёрским вакансиям и чатам платформы «Гудсёрфинг»",
                                )}
                            </span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                        <div className={styles.row}>
                            <span>{t("for-volunteer.Доступ к Академии «Гудсёрфинг»")}</span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                        <div className={styles.row}>
                            <span>
                                {t(
                                    "for-volunteer.Получение статуса амбассадора (при выполнении условий)",
                                )}
                            </span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                        <div className={styles.row}>
                            <span>
                                {t(
                                    "for-volunteer.Участие в онлайн-мероприятиях «Гудсёрфинг»",
                                )}
                            </span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                        <div className={styles.row}>
                            <span>
                                {t(
                                    "for-volunteer.Участие в офлайн-мероприятиях «Гудсёрфинг»",
                                )}
                            </span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                        <div className={styles.row}>
                            <span>
                                {t(
                                    "for-volunteer.Повышенное доверие организатора волонтёрского проекта при отборе участников (специальная метка в профиле)",
                                )}
                            </span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                        <div className={styles.row}>
                            <span>{t("for-volunteer.Доступ к блогу «Гудсёрфинг»")}</span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                    </div>
                    <div className={styles.columnFooter}>
                        <Button color="GREEN" size="SMALL" variant="FILL">
                            {t("for-volunteer.Получить членство")}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};
